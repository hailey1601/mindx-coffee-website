import { useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

const TRANSLATIONS = {
  vi: {
    // Nav & Common
    navBeans: 'Hạt Cà Phê',
    navTools: 'Dụng Cụ Pha',
    navTech: 'Công Nghệ Pha',
    navSubs: 'Gói Đăng Ký',
    logout: 'Đăng Xuất',
    login: 'Đăng Nhập',
    register: 'Đăng Ký',
    hello: 'Xin chào',
    profile: 'Hồ Sơ',
    cart: 'Giỏ Hàng',
    admin: 'Quản Trị',
    
    // HomePage Hero & Categories
    heroTitle: 'THỦ CÔNG. PHA CHẾ. THƯỞNG THỨC.',
    heroSubtitle: 'Trải Nghiệm Cà Phê Đỉnh Cao.',
    heroDesc: 'Khám phá các hạt cà phê specialty được tuyển chọn kỹ lưỡng, các dụng cụ pha chế chính xác và thiết bị hiện đại cho người sành cà phê.',
    btnShopAll: 'MUA SẮM NGAY',
    btnSubClub: 'Đăng Ký Thành Viên',
    browseCategory: 'Duyệt theo danh mục',
    beansCategoryTitle: 'KHÁM PHÁ HẠT CÀ PHÊ',
    beansCategoryDesc: 'Hạt cà phê Single-origin tuyển chọn, rang tươi mộc từ những vùng trồng nổi tiếng.',
    toolsCategoryTitle: 'DỤNG CỤ THIẾT YẾU',
    toolsCategoryDesc: 'Ấm rót cổ ngỗng, phễu lọc gốm sứ cho các tín đồ pour over thủ công.',
    techCategoryTitle: 'CÔNG NGHỆ PHA CHẾ',
    techCategoryDesc: 'Cân thông minh, máy xay Baratza và các thiết bị kiểm soát nhiệt độ hiện đại.',
    newArrivals: 'Sản Phẩm Mới Nhất',
    newArrivalsDesc: 'Lô hạt mới rang và các thiết bị pha chế vừa cập bến cửa hàng.',
    allProducts: 'Tất Cả Sản Phẩm',
    beansName: 'Hạt Cà Phê',
    toolsName: 'Dụng Cụ',
    techName: 'Công Nghệ',
    noProducts: 'Không tìm thấy sản phẩm trong danh mục này.',
    addedToCart: 'Đã thêm vào giỏ hàng!',
    joinClub: 'Tham Gia Daily Grind Club',
    joinClubDesc: 'Đăng ký nhận bản tin để nhận ưu đãi độc quyền, thông báo mẻ rang mới và mẹo pha chế từ barista vô địch.',
    subscribe: 'Đăng ký nhận tin',
    subSuccess: 'Cảm ơn bạn đã đăng ký!',
    
    // Product Detail
    backToList: 'Quay lại danh sách',
    retailPrice: 'Giá bán lẻ',
    shippingFee: 'Phí giao hàng',
    freeShippingText: 'Miễn phí toàn quốc',
    productDesc: 'Mô tả sản phẩm',
    quantity: 'Số lượng',
    addToCartBtn: 'Thêm vào giỏ hàng',
    similarProducts: 'Sản phẩm tương tự',
    similarProductsDesc: 'Các sản phẩm liên quan bạn có thể thích.',
    originalProduct: '100% Nguyên bản',
    fastShipping: 'Giao nhanh 2h',
    returnPolicy: 'Đổi trả trong 7 ngày',
    outOfStock: 'Hết hàng',
    inStock: 'Còn lại',
    
    // Cart Page
    shoppingCart: 'Giỏ Hàng Của Bạn',
    emptyCart: 'Giỏ hàng của bạn đang trống.',
    emptyCartDesc: 'Hãy thêm một số loại cà phê specialty hoặc dụng cụ pha chế cao cấp từ cửa hàng của chúng tôi.',
    orderSummary: 'Tóm Tắt Đơn Hàng',
    subtotal: 'Tạm tính',
    grandTotal: 'Tổng cộng',
    freeShippingDesc: 'Miễn phí giao hàng cho đơn từ 1.500.000 đ',
    freeText: 'Miễn phí',
    fullNameLabel: 'Họ và tên người nhận',
    fullNamePlaceholder: 'Nhập họ tên...',
    phoneLabel: 'Số điện thoại',
    phonePlaceholder: 'Nhập số điện thoại...',
    addressLabel: 'Địa chỉ giao hàng',
    addressPlaceholder: 'Số nhà, tên đường...',
    cityLabel: 'Tỉnh / Thành phố',
    cityPlaceholder: 'Nhập tỉnh thành...',
    btnOrder: 'XÁC NHẬN ĐẶT HÀNG',
    orderSuccess: 'Đặt hàng thành công!',
    orderSuccessDesc: 'Cảm ơn bạn đã mua sắm tại Daily Grind.',
    totalPaid: 'Tổng tiền đã thanh toán',
    backToHome: 'Quay về trang chủ',
    shippingDetails: 'Thông tin nhận hàng',
    paymentMethod: 'Phương thức thanh toán',
    itemsCount: 'sản phẩm',
    orderId: 'Mã đơn hàng',
    recipientName: 'Tên người nhận',
    onlineCard: 'Thẻ Online',
    codText: 'Thanh toán COD',
    continueShopping: 'Tiếp tục mua hàng',
    
    // Auth Pages
    createAccount: 'Tạo tài khoản mới',
    registerDesc: 'Đăng ký nhanh bằng email và mật khẩu của bạn.',
    alreadyHaveAccount: 'Đã có tài khoản? Đăng nhập',
    emailLabel: 'Địa chỉ Email',
    passwordLabel: 'Mật khẩu',
    registerBtn: 'Đăng Ký & Nhận OTP',
    confirmOtpTitle: 'Nhập mã OTP',
    confirmOtpDesc: 'Nhập mã OTP gồm 6 chữ số vừa được gửi đến email',
    verifyOtpBtn: 'Xác Minh OTP',
    backToRegister: 'Quay lại Đăng ký',
    verifySuccess: 'Xác minh thành công! Bạn có thể đăng nhập.',
    welcomeLogin: 'Chào mừng quay lại',
    loginDesc: 'Nhập tài khoản và mật khẩu để tiếp tục.',
    loginBtn: 'Đăng Nhập',
    forgotPassword: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản? Đăng ký ngay',

    // Footer
    footerDesc: 'Chúng tôi nhập khẩu hạt cà phê specialty chất lượng cao trực tiếp từ các nông hộ bền vững trên thế giới, rang thủ công tỉ mỉ tại xưởng địa phương.',
    footerCollections: 'Bộ Sưu Tập',
    footerSingleOrigin: 'Cà Phê Hạt Đơn Vùng',
    footerEspressoBlends: 'Cà Phê Phối Trộn Espresso',
    footerHandDrip: 'Bộ Dụng Cụ Pha Tay',
    footerSmartTech: 'Cân Điện Tử & Công Nghệ',
    footerResources: 'Kiến Thức Cà Phê',
    footerV60Guide: 'Hướng Dẫn Pha V60',
    footerEspressoTips: 'Bí Quyết Chiết Xuất Espresso',
    footerWaterChem: 'Nguồn Nước Trong Pha Chế',
    footerDirectTrade: 'Chương Trình Thương Mại Trực Tiếp',
    footerStoreInfo: 'Thông Tin Cửa Hàng',
    footerHours: 'T2 - CN: 7:00 - 17:00'
  },
  en: {
    // Nav & Common
    navBeans: 'Coffee Beans',
    navTools: 'Brewing Tools',
    navTech: 'Brewing Tech',
    navSubs: 'Subscriptions',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    hello: 'Hi',
    profile: 'Profile',
    cart: 'Cart',
    admin: 'Admin Portal',
    
    // HomePage Hero & Categories
    heroTitle: 'CRAFT. BREW. SAVOR.',
    heroSubtitle: 'Elevated Coffee & Gear.',
    heroDesc: 'Discover curated, ethically sourced single-origin beans, precision brewing tools, and modern coffee tech crafted for coffee lovers.',
    btnShopAll: 'SHOP ALL PRODUCTS',
    btnSubClub: 'Coffee Club Subscriptions',
    browseCategory: 'Browse by Category',
    beansCategoryTitle: 'EXPLORE BEANS',
    beansCategoryDesc: 'Single-origin beans, custom light/medium roasts, and customizable subscription options.',
    toolsCategoryTitle: 'ESSENTIAL TOOLS',
    toolsCategoryDesc: 'Precision kettles, drippers, scales, and filtration tools for the dedicated home barista.',
    techCategoryTitle: 'BREWING TECH',
    techCategoryDesc: 'Smart scales, commercial-grade home grinders, and temperature-controlled brewing tech.',
    newArrivals: 'New Arrivals',
    newArrivalsDesc: 'Freshly roasted selections and newly launched brewing accessories.',
    allProducts: 'All Products',
    beansName: 'Coffee Beans',
    toolsName: 'Brewing Tools',
    techName: 'Brewing Tech',
    noProducts: 'No products found in this category.',
    addedToCart: 'Added to cart!',
    joinClub: 'Join the Daily Grind Club',
    joinClubDesc: 'Subscribe to our newsletter for exclusive discounts, notifications of new roast drops, and curated brewing guides.',
    subscribe: 'Subscribe',
    subSuccess: 'Thank you for subscribing!',
    
    // Product Detail
    backToList: 'Back to list',
    retailPrice: 'Retail Price',
    shippingFee: 'Shipping Fee',
    freeShippingText: 'Free Shipping Nationwide',
    productDesc: 'Product Description',
    quantity: 'Quantity',
    addToCartBtn: 'Add to Cart',
    similarProducts: 'Related Products',
    similarProductsDesc: 'Other products in the same category you might like.',
    originalProduct: '100% Original',
    fastShipping: '2h Express Delivery',
    returnPolicy: '7 Days Return Policy',
    outOfStock: 'Out of Stock',
    inStock: 'Only',
    
    // Cart Page
    shoppingCart: 'Your Shopping Cart',
    emptyCart: 'Your cart is empty.',
    emptyCartDesc: 'Add some specialty coffee or premium brewing gear from our shop.',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    grandTotal: 'Grand Total',
    freeShippingDesc: 'Free shipping for orders over 1.500.000 đ',
    freeText: 'Free',
    fullNameLabel: 'Recipient Full Name',
    fullNamePlaceholder: 'Enter full name...',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter phone number...',
    addressLabel: 'Shipping Address',
    addressPlaceholder: 'Street address, apartment number...',
    cityLabel: 'Province / City',
    cityPlaceholder: 'Enter city...',
    btnOrder: 'PLACE ORDER NOW',
    orderSuccess: 'Order Placed Successfully!',
    orderSuccessDesc: 'Thank you for shopping at Daily Grind.',
    totalPaid: 'Total Paid',
    backToHome: 'Back to Home',
    shippingDetails: 'Shipping Details',
    paymentMethod: 'Payment Method',
    itemsCount: 'items',
    orderId: 'Order ID',
    recipientName: 'Recipient Name',
    onlineCard: 'Online Card',
    codText: 'Cash on Delivery (COD)',
    continueShopping: 'Continue shopping',
    
    // Auth Pages
    createAccount: 'Create account',
    registerDesc: 'Register quickly with your email and password.',
    alreadyHaveAccount: 'Already have an account? Login',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    registerBtn: 'Register & Send OTP',
    confirmOtpTitle: 'Confirm OTP',
    confirmOtpDesc: 'Enter the 6-digit OTP code sent to your email',
    verifyOtpBtn: 'Verify OTP',
    backToRegister: 'Back to register',
    verifySuccess: 'Verification successful! You can now login.',
    welcomeLogin: 'Welcome back',
    loginDesc: 'Enter your account details to continue.',
    loginBtn: 'Login',
    forgotPassword: 'Forgot password?',
    noAccount: 'Don\'t have an account? Register now',

    // Footer
    footerDesc: 'We source specialty-grade, micro-lot coffee beans directly from ethical farmers globally, roasted with precision locally.',
    footerCollections: 'Shop Collections',
    footerSingleOrigin: 'Single Origin Beans',
    footerEspressoBlends: 'Signature Espresso Blends',
    footerHandDrip: 'Hand-Drip Kits',
    footerSmartTech: 'Smart Coffee Scales & Tech',
    footerResources: 'Coffee Resources',
    footerV60Guide: 'V60 Pour Over Guide',
    footerEspressoTips: 'Espresso Extraction Tips',
    footerWaterChem: 'Water Chemistry for Brewing',
    footerDirectTrade: 'Our Direct Trade Program',
    footerStoreInfo: 'Store Information',
    footerHours: 'Mon - Sun: 7:00 AM - 5:00 PM'
  }
};

let listeners: (() => void)[] = [];
let currentLang: Language = (localStorage.getItem('lang') as Language) ?? 'vi';

export const i18n = {
  getLanguage: (): Language => currentLang,
  setLanguage: (lang: Language) => {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    listeners.forEach((listener) => listener());
  },
  t: (key: keyof typeof TRANSLATIONS['vi']): string => {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS['vi'][key] || String(key);
  },
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
};

export const useTranslation = () => {
  const [lang, setLangState] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    return i18n.subscribe(() => {
      setLangState(i18n.getLanguage());
    });
  }, []);

  return {
    t: i18n.t,
    lang,
    setLanguage: i18n.setLanguage
  };
};
