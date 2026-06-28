import mongoose, { Schema, Document } from 'mongoose';

// 1. Định nghĩa kiểu dữ liệu (Interface) cho Sản phẩm theo TypeScript
export interface ProductDocument extends Document {
  name: string;
  category: 'Beans' | 'Tools' | 'Tech'; // Phân loại: Hạt cà phê, Dụng cụ, Thiết bị công nghệ
  price: number;
  stock: number; // Số lượng gói/thiết bị còn trong kho
  description: string; // Mô tả mẻ rang hoặc chất liệu dụng cụ
  imageUrl: string; // Đường link ảnh sản phẩm online
  status: 'active' | 'inactive'; // Trạng thái hiển thị bán
}

// 2. Tạo Schema để MongoDB hiểu cấu trúc bảng
const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Beans', 'Tools', 'Tech'] },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true } // Tự động tạo trường lưu ngày đăng sản phẩm (createdAt)
);

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);