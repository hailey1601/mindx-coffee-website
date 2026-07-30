import { Request, Response } from 'express';
import mongoose from 'mongoose';
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
    const { search, category, status } = req.query;
    let query: any = {};

    if (status) {
      if (status !== 'all') {
        query.status = status;
      }
    } else {
      query.status = 'active'; // Mặc định khách hàng chỉ thấy sản phẩm active
    }

    // Nếu khách gõ tìm kiếm tên sản phẩm
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Nếu khách bấm lọc theo danh mục (Beans / Tools / Tech)
    if (category) {
      query.category = category;
    }

    const products = await ProductModel.find(query).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
};

// 2.5 KHÁCH HÀNG & ADMIN: Xem chi tiết một sản phẩm
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem ID có đúng định dạng MongoDB ObjectId không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm (ID không hợp lệ)' });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này' });
    }
    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error: error.message });
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