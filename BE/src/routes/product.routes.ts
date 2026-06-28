import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../controllers/product.controller';
import { authGuard } from '../middlewares/auth.middleware';

export const productRouter = Router();

// KHÁCH HÀNG & ADMIN: Xem danh sách sản phẩm
productRouter.get('/', getProducts);

// ADMIN (yêu cầu đăng nhập): Tạo sản phẩm mới
productRouter.post('/', authGuard, createProduct);

// ADMIN (yêu cầu đăng nhập): Cập nhật thông tin sản phẩm
productRouter.put('/:id', authGuard, updateProduct);
productRouter.patch('/:id', authGuard, updateProduct);

// ADMIN (yêu cầu đăng nhập): Xóa sản phẩm
productRouter.delete('/:id', authGuard, deleteProduct);
