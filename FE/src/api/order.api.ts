import { http } from '@/shared/api/http';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface Order {
  _id: string;
  userId: string | { _id: string; email: string; displayName?: string };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'Online';
}

export const orderApi = {
  createOrder: (payload: CreateOrderPayload) =>
    http.post<{ message: string; order: Order }>('/orders/checkout', payload),

  getOrders: () =>
    http.get<Order[]>('/orders'),

  getAllOrders: () =>
    http.get<Order[]>('/orders/all'),

  getOrderById: (id: string) =>
    http.get<Order>(`/orders/${id}`),

  cancelOrder: (id: string) =>
    http.patch<{ message: string; order: Order }>(`/orders/${id}/cancel`),

  // Admin APIs
  updateOrderStatus: (id: string, status: Order['status']) =>
    http.patch<{ message: string; order: Order }>(`/orders/${id}/status`, { status }),

  updatePaymentStatus: (id: string, paymentStatus: Order['paymentStatus']) =>
    http.patch<{ message: string; order: Order }>(`/orders/${id}/payment-status`, { paymentStatus })
};

