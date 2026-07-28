import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle, XCircle, Package, AlertCircle } from 'lucide-react';
import { productApi, type Product, type CreateProductPayload } from '@/api/product.api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    category: 'Beans',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: '',
    status: 'active'
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getProducts({ status: 'all' });
      setProducts(res.data);
    } catch (err: any) {
      console.error('Lỗi khi tải danh sách sản phẩm', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Beans',
      price: 18,
      stock: 50,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop',
      status: 'active'
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl,
      status: product.status
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      setErrorMessage('Vui lòng điền đầy đủ tên và giá sản phẩm hợp lệ');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      if (editingProduct) {
        await productApi.updateProduct(editingProduct._id, formData);
      } else {
        await productApi.createProduct(formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;
    try {
      await productApi.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      await productApi.updateProduct(product._id, { status: newStatus });
      fetchProducts();
    } catch {
      alert('Không thể đổi trạng thái sản phẩm');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-stone-50 border-stone-200"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 focus:outline-none"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Beans">Hạt cà phê (Beans)</option>
            <option value="Tools">Dụng cụ pha (Tools)</option>
            <option value="Tech">Máy móc & Thiết bị (Tech)</option>
          </select>
        </div>

        <Button onClick={openCreateModal} className="bg-coffee-amber hover:bg-amber-700 text-white gap-2 rounded-xl">
          <Plus className="size-4" />
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Product List Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-200">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-coffee-amber border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-stone-500">
            <Package className="size-12 mb-3 text-stone-300" />
            <p className="font-semibold text-stone-700">Không tìm thấy sản phẩm nào</p>
            <p className="text-sm text-stone-400">Hãy bấm nút "Thêm sản phẩm mới" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-stone-50 text-xs uppercase text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Giá bán</th>
                  <th className="px-6 py-4">Tồn kho</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="size-12 rounded-lg object-cover border border-stone-200 bg-stone-100"
                        />
                        <div>
                          <p className="font-bold text-stone-800">{p.name}</p>
                          <p className="line-clamp-1 text-xs text-stone-400 max-w-xs">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-700">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-coffee-amber border border-amber-200">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-900">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                        {p.stock} sản phẩm
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {p.status === 'active' ? (
                          <>
                            <CheckCircle className="size-3.5" /> Đang bán
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3.5" /> Ẩn bán
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-amber-50 hover:text-coffee-amber transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-stone-800 mb-4">
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm cà phê mới'}
            </h3>

            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Tên sản phẩm</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Ethiopia Yirgacheffe Special"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full h-10 rounded-md border border-stone-200 bg-stone-50 px-3 text-sm focus:outline-none"
                  >
                    <option value="Beans">Beans (Hạt cà phê)</option>
                    <option value="Tools">Tools (Dụng cụ pha)</option>
                    <option value="Tech">Tech (Thiết bị/Máy pha)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-10 rounded-md border border-stone-200 bg-stone-50 px-3 text-sm focus:outline-none"
                  >
                    <option value="active">Active (Đang bán)</option>
                    <option value="inactive">Inactive (Ngừng bán)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Giá bán ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Số lượng kho</label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">URL Hình ảnh</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-stone-200 bg-stone-50 p-2.5 text-sm focus:outline-none"
                  placeholder="Mô tả hương vị, nguồn gốc hạt..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-coffee-amber hover:bg-amber-700 text-white"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
