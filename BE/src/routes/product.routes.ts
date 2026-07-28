import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../controllers/product.controller';
import { adminGuard, authGuard } from '../middlewares/auth.middleware';

export const productRouter = Router();

// KHÁCH HÀNG & ADMIN: Xem danh sách sản phẩm
productRouter.get('/', getProducts);

// ADMIN (yêu cầu đăng nhập + vai trò Admin): Tạo sản phẩm mới
productRouter.post('/', authGuard, adminGuard, createProduct);

// ADMIN (yêu cầu đăng nhập + vai trò Admin): Cập nhật thông tin sản phẩm
productRouter.put('/:id', authGuard, adminGuard, updateProduct);
productRouter.patch('/:id', authGuard, adminGuard, updateProduct);

// ADMIN (yêu cầu đăng nhập + vai trò Admin): Xóa sản phẩm
productRouter.delete('/:id', authGuard, adminGuard, deleteProduct);

