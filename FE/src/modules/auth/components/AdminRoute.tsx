import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { tokenStore } from '../store/token.store';
import { authApi } from '../api/auth.api';
import type { CurrentUser } from '../types/auth.types';

export const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const token = tokenStore.get();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;
    authApi.getMe()
      .then((res) => {
        setUser(res.data as CurrentUser);
      })
      .catch(() => {
        tokenStore.clear();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-coffee-amber border-t-transparent" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-stone-100 my-12">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">Truy cập bị từ chối</h2>
        <p className="text-sm text-stone-500 mb-6">Trang này chỉ dành cho tài khoản có quyền Quản trị viên (Admin).</p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-coffee-amber px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-all"
        >
          Trở về Trang chủ
        </Link>
      </div>
    );
  }

  return children;
};
