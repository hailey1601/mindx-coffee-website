import { Router } from 'express';
import {
  cancelOrder,
  checkout,
  getAllOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/order.controller';
import { adminGuard, authGuard } from '../middlewares/auth.middleware';

export const orderRouter = Router();

// KHÁCH HÀNG: Đặt hàng
orderRouter.post('/checkout', authGuard, checkout);

// KHÁCH HÀNG: Lấy danh sách đơn hàng của tôi
orderRouter.get('/', authGuard, getOrders);

// ADMIN: Lấy tất cả đơn hàng hệ thống
orderRouter.get('/all', authGuard, adminGuard, getAllOrders);

// KHÁCH HÀNG & ADMIN: Lấy chi tiết đơn hàng
orderRouter.get('/:id', authGuard, getOrderById);

// KHÁCH HÀNG & ADMIN: Hủy đơn hàng
orderRouter.patch('/:id/cancel', authGuard, cancelOrder);

// ADMIN: Cập nhật trạng thái đơn hàng
orderRouter.patch('/:id/status', authGuard, adminGuard, updateOrderStatus);

// ADMIN: Cập nhật trạng thái thanh toán
orderRouter.patch('/:id/payment-status', authGuard, adminGuard, updatePaymentStatus);