import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';

// 1. ADMIN: Tạo sản phẩm mới (Hạt cà phê hoặc dụng cụ mới)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price, stock, description, imageUrl } = req.body;

    const newProduct = new ProductModel({
      name,
      category,
      price,
      stock,
      description,
      imageUrl
    });

    await newProduct.save();
    return res.status(201).json({ message: 'Tạo sản phẩm cà phê thành công!', product: newProduct });
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error: error.message });
  }
};

// 2. KHÁCH HÀNG & ADMIN: Xem danh sách sản phẩm (Có bộ lọc category và ô tìm kiếm)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;
    let query: any = { status: 'active' }; // Mặc định chỉ lấy sản phẩm đang bán

    // Nếu khách gõ tìm kiếm tên sản phẩm
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    }

    // Nếu khách bấm lọc theo danh mục (Beans / Tools / Tech)
    if (category) {
      query.category = category;
    }

    const products = await ProductModel.find(query).sort({ createdAt: -1 }); // Sản phẩm mới đăng hiện lên trước
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
};

// 3. ADMIN: Cập nhật thông tin sản phẩm (Sửa giá, sửa kho)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm này' });
    return res.json({ message: 'Cập nhật sản phẩm thành công!', product: updatedProduct });
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật', error: error.message });
  }
};

// 4. ADMIN: Xóa sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    
    if (!deletedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    return res.json({ message: 'Xóa sản phẩm thành công!' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi xóa', error: error.message });
  }
};