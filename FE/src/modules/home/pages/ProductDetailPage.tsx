import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star, Plus, Minus, CheckCircle, AlertTriangle, Coffee } from 'lucide-react';
import { productApi, type Product } from '@/api/product.api';
import { cartStore } from '@/modules/cart/store/cart.store';
import { toast } from 'sonner';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    
    const loadProductData = async () => {
      try {
        setLoading(true);
        // Fetch current product details
        const res = await productApi.getProductById(id);
        setProduct(res.data);
        
        // Fetch related products (same category)
        const allRes = await productApi.getProducts();
        const related = allRes.data
          .filter((p) => p.category === res.data.category && p._id !== id)
          .slice(0, 4); // Limit to 4 related products
        setRelatedProducts(related);
      } catch (err: any) {
        toast.error('Không thể tải thông tin chi tiết sản phẩm.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
    setQuantity(1); // Reset quantity when switching products
  }, [id]);

  const handleIncrease = () => {
    if (!product) return;
    if (quantity >= product.stock) {
      toast.warning(`Chỉ còn lại ${product.stock} sản phẩm trong kho`);
      return;
    }
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity <= 1) return;
    setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const items = cartStore.get();
    const existing = items.find(item => item.productId === product._id);
    
    // Add to cart store first
    cartStore.add(product);
    
    // Update to correct quantity
    const newQty = existing ? existing.quantity + quantity : quantity;
    if (newQty > 1) {
      cartStore.updateQuantity(product._id, newQty);
    }
    
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, {
      description: product.name,
      position: 'bottom-right',
    });
  };

  const getProductRating = (name: string) => {
    const score = (name.length % 5) * 0.1;
    return (4.5 + score).toFixed(1);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-6 bg-stone-200 rounded w-24"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-stone-200 rounded-3xl w-full"></div>
          <div className="space-y-6">
            <div className="h-4 bg-stone-200 rounded w-1/4"></div>
            <div className="h-8 bg-stone-200 rounded w-3/4"></div>
            <div className="h-6 bg-stone-200 rounded w-1/3"></div>
            <div className="h-20 bg-stone-200 rounded w-full"></div>
            <div className="h-12 bg-stone-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <AlertTriangle className="size-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold font-serif text-coffee-dark">Không tìm thấy sản phẩm</h2>
        <p className="text-sm text-stone-500">Sản phẩm này không tồn tại hoặc đã bị gỡ bỏ khỏi cửa hàng.</p>
        <button onClick={() => navigate('/')} className="bg-coffee-dark hover:bg-coffee-amber text-white px-6 py-2 rounded-full font-bold">
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const rating = getProductRating(product.name);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
      
      {/* Back Button */}
      <div>
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-coffee-amber transition-colors"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </button>
      </div>

      {/* Main product grid */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100 rounded-3xl border border-coffee-latte shadow-sm">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-coffee-amber text-coffee-bg text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {product.category === 'Beans' ? 'Cà phê hạt' : product.category === 'Tools' ? 'Dụng cụ pha' : 'Thiết bị công nghệ'}
          </span>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-serif text-coffee-dark leading-tight">{product.name}</h1>
            
            {/* Rating & Stock status */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="size-4 fill-amber-500" />
                <span className="font-bold text-stone-700">{rating}</span>
                <span className="text-stone-400">(42 đánh giá)</span>
              </div>
              <div className="h-4 w-px bg-stone-200"></div>
              <div className="flex items-center gap-1.5">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle className="size-4 text-green-500" />
                    <span className="text-green-600 font-semibold">Còn {product.stock} sản phẩm</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-4 text-red-500" />
                    <span className="text-red-600 font-semibold">Hết hàng</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Product Price */}
          <div className="bg-coffee-latte/20 border border-coffee-latte/50 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 uppercase tracking-widest font-semibold">Giá bán lẻ</span>
              <p className="text-3xl font-extrabold text-coffee-dark font-mono">${product.price.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 uppercase tracking-widest font-semibold">Phí giao hàng</span>
              <p className="text-sm font-semibold text-green-600">Miễn phí toàn quốc</p>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-coffee-dark text-sm uppercase tracking-wider">Mô tả sản phẩm</h3>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>
          </div>

          {/* Quantity Selector & Add to Cart */}
          {product.stock > 0 && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-coffee-dark uppercase tracking-wider">Số lượng:</span>
                <div className="flex items-center border border-stone-200 rounded-full bg-white p-1">
                  <button 
                    onClick={handleDecrease}
                    className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-12 text-center font-bold text-stone-800 text-sm">{quantity}</span>
                  <button 
                    onClick={handleIncrease}
                    className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-coffee-dark hover:bg-coffee-amber text-white font-bold rounded-full h-12 shadow-md hover:shadow-lg transition-all duration-300 gap-2 text-sm flex items-center justify-center"
                >
                  <ShoppingBag className="size-5" />
                  Thêm vào giỏ hàng (${(product.price * quantity).toFixed(2)})
                </button>
              </div>
            </div>
          )}

          {/* Brand value statement */}
          <div className="border-t border-coffee-latte/50 pt-4 flex gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <Coffee className="size-4 text-coffee-amber" />
              <span>100% Nguyên bản</span>
            </div>
            <div className="h-4 w-px bg-stone-200"></div>
            <div>Giao nhanh 2h</div>
            <div className="h-4 w-px bg-stone-200"></div>
            <div>Đổi trả trong 7 ngày</div>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 border-t border-coffee-latte pt-12">
          <div>
            <h2 className="text-2xl font-bold font-serif text-coffee-dark">Sản phẩm tương tự</h2>
            <p className="text-xs text-stone-500 mt-1">Các dụng cụ hoặc hạt cà phê thuộc nhóm sản phẩm liên quan.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link 
                to={`/product/${p._id}`}
                key={p._id}
                className="group bg-white border border-coffee-latte rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 flex-grow flex flex-col justify-between">
                  <h4 className="font-bold text-xs text-coffee-dark group-hover:text-coffee-amber transition-colors line-clamp-2 leading-tight">
                    {p.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-coffee-latte mt-2">
                    <span className="font-bold text-xs text-coffee-dark font-mono">${p.price.toFixed(2)}</span>
                    <span className="text-[10px] text-coffee-amber font-semibold uppercase">{p.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
