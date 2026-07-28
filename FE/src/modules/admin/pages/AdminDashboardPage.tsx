import React, { useState } from 'react';
import { Package, ShoppingBag, ShieldAlert, Sparkles } from 'lucide-react';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminOrdersPage } from './AdminOrdersPage';
import { http } from '@/shared/api/http';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteStatus, setPromoteStatus] = useState('');

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteEmail) return;
    try {
      const res = await http.post<{ message: string }>('/auth/promote-admin', { email: promoteEmail });
      setPromoteStatus(res.data.message);
      setPromoteEmail('');
    } catch (err: any) {
      setPromoteStatus(err.response?.data?.message || 'Không thể thăng cấp người dùng');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-coffee-dark to-stone-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30 mb-3 backdrop-blur-md">
              <ShieldAlert className="size-3.5" />
              Hệ thống Quản trị viên (Admin Portal)
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-serif">Trang Quản Lý Daily Grind</h1>
            <p className="mt-1 text-sm text-stone-300">
              Quản lý danh mục sản phẩm cà phê, thiết bị pha chế và theo dõi các đơn hàng khách hàng.
            </p>
          </div>

          {/* Quick Promote Tool */}
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 max-w-sm">
            <p className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
              <Sparkles className="size-3.5" /> Cấp quyền Admin nhanh
            </p>
            <form onSubmit={handlePromote} className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="Nhập email người dùng..."
                value={promoteEmail}
                onChange={(e) => setPromoteEmail(e.target.value)}
                className="w-full rounded-xl bg-white/20 px-3 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
              >
                Nâng cấp
              </button>
            </form>
            {promoteStatus && <p className="text-[11px] text-amber-200 mt-2">{promoteStatus}</p>}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 gap-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
            activeTab === 'products'
              ? 'border-coffee-amber text-coffee-amber'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="size-4" />
          Quản Lý Sản Phẩm
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
            activeTab === 'orders'
              ? 'border-coffee-amber text-coffee-amber'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingBag className="size-4" />
          Quản Lý Đơn Hàng
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'products' ? <AdminProductsPage /> : <AdminOrdersPage />}
    </div>
  );
};
