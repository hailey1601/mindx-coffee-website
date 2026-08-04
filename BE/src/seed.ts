import mongoose from 'mongoose';
import { connectDb } from './config/db';
import { ProductModel } from './models/product.model';
import { UserModel } from './models/user.model';
import { hashPassword } from './utils/hash';

const seedProducts = [
  // 1. Category: Beans
  {
    name: 'Ethiopia Yirgacheffe Kochere',
    category: 'Beans' as const,
    price: 380000,
    stock: 45,
    description: 'Nốt hương hoa nhài tinh tế, vị chua thanh thoát của cam quýt và hậu vị ngọt dịu của mật ong ngọt ngào. Phù hợp nhất cho phương pháp pha Pour Over (V60).',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  },
  {
    name: 'Colombia Supremo Huila',
    category: 'Beans' as const,
    price: 320000,
    stock: 60,
    description: 'Vị đậm đà vừa phải, nốt hương ngọt của caramel cháy, chocolate đen cùng một chút hậu vị quả mọng chín. Lý tưởng cho cả Espresso và pha phin.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  },
  {
    name: 'Vietnam Fine Robusta Lâm Đồng',
    category: 'Beans' as const,
    price: 250000,
    stock: 80,
    description: 'Đặc trưng hạt Robusta chế biến ướt chất lượng cao (Fine Robusta). Hương vị đậm đặc của chocolate hạt dẻ, ít chát, thể chất dày và hậu vị ngọt sâu kéo dài.',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800',
    status: 'active' as const
  },
  {
    name: 'Guatemala Antigua Pastoral',
    category: 'Beans' as const,
    price: 390000,
    stock: 30,
    description: 'Hạt Arabica trồng trên vùng đất núi lửa đặc thù. Mang hương vị phức hợp của khói nhẹ, gia vị, chocolate đen và độ chua tinh tế từ táo xanh.',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800',
    status: 'active' as const
  },

  // 2. Category: Tools
  {
    name: 'Hario V60 Ceramic Dripper 02',
    category: 'Tools' as const,
    price: 550000,
    stock: 25,
    description: 'Phễu lọc làm bằng gốm sứ cao cấp của Hario Nhật Bản. Thiết kế rãnh xoắn ốc độc đáo giúp dòng chảy tối ưu cho ly cà phê Pour Over tròn vị.',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  },
  {
    name: 'Classic French Press Coffee Maker 800ml',
    category: 'Tools' as const,
    price: 680000,
    stock: 15,
    description: 'Bình pha kiểu Pháp với kính borosilicate chịu nhiệt chịu lực tốt, khung thép không gỉ. Đem lại ly cà phê body dày dặn và hương vị trọn vẹn của tinh dầu.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  },
  {
    name: 'AeroPress Original Coffee Maker',
    category: 'Tools' as const,
    price: 850000,
    stock: 40,
    description: 'Dụng cụ pha cà phê đa năng bằng áp suất pittông của AeroPress. Pha chế cực kỳ nhanh gọn, dễ vệ sinh, mang đi du lịch tiện lợi, tạo ra ly cà phê ít chua và mịn màng.',
    imageUrl: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  },
  {
    name: 'Hario Buono Pouring Kettle 1.2L',
    category: 'Tools' as const,
    price: 950000,
    stock: 20,
    description: 'Ấm rót cổ ngỗng Hario Buono bằng inox cao cấp. Vòi rót uốn cong đặc trưng giúp kiểm soát tốc độ và vị trí dòng nước chảy cực kì chính xác.',
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800',
    status: 'active' as const
  },

  // 3. Category: Tech
  {
    name: 'Baratza Encore Conical Burr Grinder',
    category: 'Tech' as const,
    price: 3450000,
    stock: 10,
    description: 'Máy xay cà phê điện gia đình huyền thoại của Baratza Mỹ. Thiết kế 40 cấp độ xay tinh chỉnh từ thô (French Press) đến mịn (Espresso). Lưỡi dao hình nón bền bỉ.',
    imageUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  },
  {
    name: 'Timemore Black Mirror Basic 2 Smart Scale',
    category: 'Tech' as const,
    price: 1150000,
    stock: 18,
    description: 'Cân điện tử chuyên dụng cho pha chế cà phê, cảm biến siêu nhạy, độ chính xác 0.1g. Tích hợp màn hình LED ẩn sắc nét và chức năng tự động đếm thời gian pha.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  },
  {
    name: 'Fellow Stagg EKG Electric Kettle 0.9L',
    category: 'Tech' as const,
    price: 3850000,
    stock: 8,
    description: 'Ấm đun nước điện thông minh điều chỉnh nhiệt độ chính xác từng độ C. Vòi rót Fluted kiểm soát dòng chảy đỉnh cao, giữ nhiệt lên đến 60 phút.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
    status: 'active' as const
  }
];

const seedUsers = async () => {
  const hashedAdminPassword = await hashPassword('admin123');
  const hashedUserPassword = await hashPassword('user123');

  return [
    {
      email: 'admin@dailygrind.com',
      password: hashedAdminPassword,
      role: 'admin' as const,
      isEmailVerified: true,
      displayName: 'Quản Trị Viên',
      phone: '0987654321',
      bio: 'Tài khoản quản lý hệ thống Daily Grind'
    },
    {
      email: 'user@dailygrind.com',
      password: hashedUserPassword,
      role: 'user' as const,
      isEmailVerified: true,
      displayName: 'Khách hàng thân thiết',
      phone: '0123456789',
      bio: 'Tài khoản trải nghiệm mua sắm cà phê'
    }
  ];
};

const runSeed = async () => {
  console.log('Bắt đầu kết nối database để nạp dữ liệu mẫu...');
  await connectDb();

  // 1. Dọn dẹp dữ liệu cũ
  console.log('Đang xóa dữ liệu cũ...');
  await ProductModel.deleteMany({});
  await UserModel.deleteMany({});

  // 2. Nạp dữ liệu sản phẩm mẫu
  console.log(`Đang nạp ${seedProducts.length} sản phẩm mẫu...`);
  await ProductModel.insertMany(seedProducts);
  console.log('Nạp dữ liệu sản phẩm thành công!');

  // 3. Nạp dữ liệu người dùng mẫu
  console.log('Đang mã hóa mật khẩu & nạp người dùng mẫu...');
  const users = await seedUsers();
  await UserModel.insertMany(users);
  console.log('Nạp dữ liệu người dùng mẫu thành công!');

  console.log('---');
  console.log('Đã hoàn thành nạp dữ liệu mẫu (Seeding complete)!');
  console.log('Thông tin tài khoản đăng nhập để kiểm thử:');
  console.log('1. Admin: admin@dailygrind.com / Mật khẩu: admin123');
  console.log('2. User: user@dailygrind.com / Mật khẩu: user123');
  console.log('---');

  await mongoose.disconnect();
  console.log('Đã ngắt kết nối database.');
  process.exit(0);
};

runSeed().catch((error) => {
  console.error('Lỗi khi nạp dữ liệu mẫu:', error);
  process.exit(1);
});
