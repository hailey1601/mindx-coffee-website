import { http } from '@/shared/api/http';

export interface Product {
  _id: string;
  name: string;
  category: 'Beans' | 'Tools' | 'Tech';
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  category: 'Beans' | 'Tools' | 'Tech';
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  status?: 'active' | 'inactive';
}

export interface UpdateProductPayload {
  name?: string;
  category?: 'Beans' | 'Tools' | 'Tech';
  price?: number;
  stock?: number;
  description?: string;
  imageUrl?: string;
  status?: 'active' | 'inactive';
}

export interface ProductQueryParams {
  search?: string;
  category?: 'Beans' | 'Tools' | 'Tech' | string;
}

export const productApi = {
  getProducts: (params?: ProductQueryParams) =>
    http.get<Product[]>('/products', { params }),

  createProduct: (payload: CreateProductPayload) =>
    http.post<{ message: string; product: Product }>('/products', payload),

  updateProduct: (id: string, payload: UpdateProductPayload) =>
    http.patch<{ message: string; product: Product }>(`/products/${id}`, payload),

  deleteProduct: (id: string) =>
    http.delete<{ message: string }>(`/products/${id}`)
};
