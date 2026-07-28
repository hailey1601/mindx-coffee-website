import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Eye, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { orderApi, type Order } from '@/api/order.api';
import { Input } from '@/shared/components/ui/input';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAllOrders();
      setOrders(res.data);
    } catch (err: any) {
      console.error('Lỗi khi tải danh sách đơn hàng', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: Order['paymentStatus']) => {
    try {
      await orderApi.updatePaymentStatus(orderId, newPaymentStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái thanh toán');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const userEmail = typeof o.userId === 'object' ? o.userId?.email || '' : '';
    const userName = typeof o.userId === 'object' ? o.userId?.displayName || '' : '';
    const shipName = o.shippingAddress?.fullName || '';

    const matchesSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      userEmail.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      shipName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="size-3.5" /> Chờ xử lý
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="size-3.5" /> Đang chuẩn bị
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="size-3.5" /> Đang giao hàng
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3.5" /> Đã giao thành công
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="size-3.5" /> Đã hủy
          </span>
        );
    }
  };

  const getPaymentBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Đã thanh toán</span>;
      case 'pending':
        return <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">Chờ thanh toán</span>;
      case 'failed':
        return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">Thất bại</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
            <Input
              placeholder="Tìm theo Mã Đơn, Khách hàng, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-stone-50 border-stone-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý (Pending)</option>
            <option value="processing">Đang chuẩn bị (Processing)</option>
            <option value="shipped">Đang giao (Shipped)</option>
            <option value="delivered">Đã giao (Delivered)</option>
            <option value="cancelled">Đã hủy (Cancelled)</option>
          </select>
        </div>

        <div className="text-xs text-stone-500 font-semibold px-2">
          Tổng số: <span className="text-coffee-amber font-bold">{filteredOrders.length}</span> đơn hàng
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-200">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-coffee-amber border-t-transparent" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-stone-500">
            <ShoppingBag className="size-12 mb-3 text-stone-300" />
            <p className="font-semibold text-stone-700">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-stone-50 text-xs uppercase text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Mã đơn & Ngày</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4">Trạng thái đơn</th>
                  <th className="px-6 py-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const customerEmail = typeof order.userId === 'object' ? order.userId?.email : 'Khách hàng';
                  return (
                    <tr key={order._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-mono font-bold text-stone-800 text-xs">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-[11px] text-stone-400">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-stone-800">{order.shippingAddress?.fullName}</p>
                        <p className="text-xs text-stone-400">{customerEmail} • {order.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-stone-900">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getPaymentBadge(order.paymentStatus)}
                          <div className="text-[11px] text-stone-400">{order.paymentMethod}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value as Order['status'])}
                          className="h-8 rounded-lg border border-stone-200 bg-stone-50 text-xs font-semibold px-2 text-stone-800 focus:outline-none cursor-pointer"
                        >
                          <option value="pending">⏳ Chờ xử lý</option>
                          <option value="processing">📦 Đang chuẩn bị</option>
                          <option value="shipped">🚚 Đang giao hàng</option>
                          <option value="delivered">✅ Đã giao hàng</option>
                          <option value="cancelled">❌ Đã hủy</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 p-2 rounded-lg text-coffee-amber hover:bg-amber-50 transition-all font-semibold text-xs"
                        >
                          <Eye className="size-4" /> Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-800">
                  Chi tiết đơn hàng #{selectedOrder._id.slice(-8).toUpperCase()}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedOrder.status)}
                  <span className="text-xs text-stone-400">
                    Thời gian: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer & Shipping info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100">
                <div>
                  <h4 className="text-xs uppercase font-bold text-stone-500 mb-2">Thông tin người nhận</h4>
                  <p className="font-semibold text-stone-800 text-sm">{selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-xs text-stone-600">SĐT: {selectedOrder.shippingAddress?.phone}</p>
                  <p className="text-xs text-stone-600">
                    Địa chỉ: {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-stone-500 mb-2">Thông tin thanh toán</h4>
                  <p className="text-xs text-stone-600">Phương thức: <span className="font-semibold text-stone-800">{selectedOrder.paymentMethod}</span></p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-stone-500">Trạng thái TT:</span>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id, e.target.value as Order['paymentStatus'])}
                      className="h-7 rounded border border-stone-300 bg-white text-xs px-2"
                    >
                      <option value="pending">Chờ thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="failed">Thất bại</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs uppercase font-bold text-stone-500 mb-3">Sản phẩm trong đơn ({selectedOrder.items?.length || 0})</h4>
                <div className="divide-y divide-stone-100 rounded-xl border border-stone-100 bg-white overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-bold text-stone-800 text-sm">{item.name}</p>
                        <p className="text-xs text-stone-400">Đơn giá: ${item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <p className="font-bold text-stone-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary total */}
              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <span className="font-bold text-stone-700">Tổng tiền đơn hàng:</span>
                <span className="text-xl font-bold text-coffee-amber">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
