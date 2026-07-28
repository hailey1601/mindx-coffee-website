import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model';
import { ProductModel } from '../models/product.model';

export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub; // sub is the userId in our JwtPayload
    if (!userId) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ message: 'Thiếu thông tin giao hàng' });
    }

    // 1. Kiểm tra tồn kho và lấy thông tin giá thực tế từ Database (tránh giả mạo giá ở client)
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${item.productId}` });
      }

      if (product.status !== 'active') {
        return res.status(400).json({ message: `Sản phẩm ${product.name} đã ngừng bán` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Sản phẩm ${product.name} không đủ hàng tồn kho. Chỉ còn ${product.stock} sản phẩm.` 
        });
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    // 2. Tính phí vận chuyển (Free ship đơn trên $150)
    const shipping = subtotal > 150 ? 0 : 30;
    const totalAmount = subtotal + shipping;

    // 3. Trừ số lượng tồn kho của từng sản phẩm
    for (const item of items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // 4. Tạo đơn hàng
    const order = new OrderModel({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'paid' : 'pending',
      status: 'pending'
    });

    await order.save();

    return res.status(201).json({
      message: 'Đặt hàng thành công!',
      order
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi hệ thống khi đặt hàng', error: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id).populate('userId', 'email displayName');
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    return res.json(order);
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find()
      .populate('userId', 'email displayName')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi lấy toàn bộ đơn hàng', error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ' });
    }

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'email displayName');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    return res.json({ message: 'Cập nhật trạng thái đơn hàng thành công', order });
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng', error: error.message });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validPaymentStatuses = ['pending', 'paid', 'failed'];
    if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ' });
    }

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    ).populate('userId', 'email displayName');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    return res.json({ message: 'Cập nhật trạng thái thanh toán thành công', order });
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái thanh toán', error: error.message });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;

    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (String(order.userId) !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xử lý' });
    }

    order.status = 'cancelled';
    await order.save();

    return res.json({ message: 'Đã hủy đơn hàng thành công', order });
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi hủy đơn hàng', error: error.message });
  }
};

