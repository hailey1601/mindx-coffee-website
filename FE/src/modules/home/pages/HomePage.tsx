import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Coffee, 
  ShoppingBag, 
  ChevronRight, 
  ArrowRight, 
  Heart, 
  Star, 
  Sparkles, 
  Plus, 
  Search
} from 'lucide-react';
import { authApi } from '@/modules/auth/api/auth.api';
import { productApi, type Product as ApiProduct } from '@/api/product.api';
import { toast } from 'sonner';
import type { CurrentUser } from '@/modules/auth/types/auth.types';

const mockProductsMapped: ApiProduct[] = [
  {
    _id: 'p1',
    name: 'Ethiopia Yirgacheffe (Light Roast)',
    category: 'Beans',
    price: 24.99,
    stock: 15,
    description: 'Sourced ethically from global micro-lots, roasted fresh.',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
    status: 'active',
  },
  {
    _id: 'p2',
    name: 'Precision Gooseneck Kettle (Matte Black)',
    category: 'Tools',
    price: 120.00,
    stock: 8,
    description: 'Kettles, drippers, and smart scales for exact extractions.',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    status: 'active',
  },
  {
    _id: 'p3',
    name: 'Craft French Press Kit',
    category: 'Tools',
    price: 149.00,
    stock: 12,
    description: 'Craft French press kit for rich flavor extraction.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    status: 'active',
  },
  {
    _id: 'p4',
    name: 'Smart Drip Coffee Scale',
    category: 'Tech',
    price: 89.00,
    stock: 20,
    description: 'Smart scale with timer and auto-tare feature.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
    status: 'active',
  }
];

const categoryMap: Record<string, string> = {
  Beans: 'Coffee Beans',
  Tools: 'Brewing Tools',
  Tech: 'Brewing Tech'
};

const getProductRating = (name: string) => {
  const score = (name.length % 5) * 0.1;
  return (4.5 + score).toFixed(1);
};

const getProductBadge = (category: string, name: string) => {
  if (name.includes('Ethiopia')) return 'Best Seller';
  if (category === 'Beans') return 'Roast';
  if (category === 'Tools') return 'New';
  if (category === 'Tech') return 'Smart';
  return undefined;
};

export const HomePage = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [cartCount, setCartCount] = useState<number>(2);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    authApi.getMe()
      .then((res) => setUser(res.data as CurrentUser))
      .catch(() => {});

    productApi.getProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCategorySelect = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);

    setTimeout(() => {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAddToCart = (productName: string) => {
    setCartCount(prev => prev + 1);
    toast.success(`Added ${productName} to cart!`, {
      description: 'Your cart has been updated.',
      position: 'bottom-right',
    });
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
    toast.info('Favorites updated', {
      position: 'bottom-right',
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    toast.success('Thank you for subscribing!', {
      description: 'You will receive our coffee newsletters and brewing guides.',
    });
    setEmailInput('');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Coffee Lover';

  const displayProducts = products.length > 0 ? products : mockProductsMapped;

  const filteredProducts = displayProducts.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-12 pb-16">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-coffee-latte/30 rounded-3xl p-8 md:p-12 mb-12 border border-coffee-latte/50 shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-coffee-latte px-3 py-1 rounded-full text-xs font-semibold text-coffee-amber uppercase tracking-wider">
              <Sparkles className="size-3" />
              Specialty Coffee Shop
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-serif text-coffee-dark">
              CRAFT. BREW. SAVOR.<br />
              <span className="text-coffee-amber">Elevated Coffee & Gear.</span>
            </h1>
            <p className="text-stone-600 max-w-md text-sm md:text-base leading-relaxed">
              Discover curated, ethically sourced single-origin beans, precision brewing tools, and modern coffee tech crafted for coffee lovers.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#products" 
                className="inline-flex items-center justify-center bg-coffee-dark hover:bg-coffee-amber text-coffee-bg font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md gap-2"
              >
                SHOP ALL PRODUCTS
                <ArrowRight className="size-4" />
              </a>
              <a 
                href="#subscriptions" 
                className="inline-flex items-center justify-center border border-coffee-dark hover:border-coffee-amber hover:text-coffee-amber text-coffee-dark font-semibold px-6 py-3 rounded-full text-sm transition-colors duration-300"
              >
                Coffee Club Subscriptions
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-coffee-latte">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800" 
                alt="Premium espresso station" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/40 flex items-center justify-between shadow-md">
                <div>
                  <p className="text-xs font-semibold text-coffee-amber uppercase tracking-wider">Featured Gear</p>
                  <p className="text-sm font-bold text-coffee-dark">Premium Espresso Prep Set</p>
                </div>
                <ChevronRight className="size-5 text-coffee-dark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout for Product Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-serif mb-8 text-center md:text-left">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Category 1: Beans */}
          <div 
            onClick={() => handleCategorySelect('Beans')}
            className="group relative bg-coffee-latte/40 hover:bg-coffee-latte/70 transition-all duration-300 rounded-3xl p-8 border border-coffee-latte/60 flex flex-col justify-between h-[360px] shadow-sm hover:shadow-md cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-coffee-amber tracking-widest uppercase">Organic Roasts</span>
              <h3 className="text-2xl font-bold font-serif mt-2 mb-2 text-coffee-dark">EXPLORE BEANS</h3>
              <p className="text-xs text-stone-600">Single-origin beans, custom light/medium roasts, and customizable recurring subscription options.</p>
            </div>
            <div className="relative my-4 h-[120px] overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400" 
                alt="Coffee Beans packaging" 
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-bold text-coffee-dark group-hover:text-coffee-amber transition-colors text-left">
              Browse Beans <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Category 2: Tools */}
          <div 
            onClick={() => handleCategorySelect('Tools')}
            className="group relative bg-coffee-latte/40 hover:bg-coffee-latte/70 transition-all duration-300 rounded-3xl p-8 border border-coffee-latte/60 flex flex-col justify-between h-[360px] shadow-sm hover:shadow-md cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-coffee-amber tracking-widest uppercase">Manual Brewing</span>
              <h3 className="text-2xl font-bold font-serif mt-2 mb-2 text-coffee-dark">ESSENTIAL TOOLS</h3>
              <p className="text-xs text-stone-600">Precision kettles, drippers, scales, and filtration tools for the dedicated home barista.</p>
            </div>
            <div className="relative my-4 h-[120px] overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400" 
                alt="Brewing Tools" 
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-bold text-coffee-dark group-hover:text-coffee-amber transition-colors text-left">
              Shop Tools <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Category 3: Tech */}
          <div 
            onClick={() => handleCategorySelect('Tech')}
            className="group relative bg-coffee-latte/40 hover:bg-coffee-latte/70 transition-all duration-300 rounded-3xl p-8 border border-coffee-latte/60 flex flex-col justify-between h-[360px] shadow-sm hover:shadow-md cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-coffee-amber tracking-widest uppercase">Advanced Brew</span>
              <h3 className="text-2xl font-bold font-serif mt-2 mb-2 text-coffee-dark">BREWING TECH</h3>
              <p className="text-xs text-stone-600">Smart scales, commercial-grade home grinders, and temperature-controlled brewing tech.</p>
            </div>
            <div className="relative my-4 h-[120px] overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400" 
                alt="Brewing Tech" 
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-bold text-coffee-dark group-hover:text-coffee-amber transition-colors text-left">
              Explore Tech <ChevronRight className="size-4" />
            </button>
          </div>

        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="products" className="mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold font-serif text-coffee-dark">New Arrivals</h2>
            <p className="text-xs text-stone-500 mt-1">Freshly roasted selections and newly launched brewing accessories.</p>
          </div>
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 max-w-full">
            {['all', 'Beans', 'Tools', 'Tech'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 font-semibold ${
                  selectedCategory === cat
                    ? 'bg-coffee-dark text-white border-coffee-dark shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-coffee-amber hover:text-coffee-amber'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat === 'Beans' ? 'Coffee Beans' : cat === 'Tools' ? 'Brewing Tools' : 'Brewing Tech'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-coffee-latte rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="aspect-square bg-stone-200 rounded-xl w-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-5 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-200 rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-stone-200 rounded-full w-full pt-2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-coffee-latte rounded-2xl w-full">
            <Coffee className="size-12 text-stone-300 mx-auto mb-3" />
            <p className="text-sm text-stone-500 font-semibold">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const badge = getProductBadge(product.category, product.name);
              const rating = getProductRating(product.name);
              
              return (
                <div 
                  key={product._id}
                  className="group relative bg-white border border-coffee-latte rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image & Badge Container */}
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    {badge && (
                      <span className="absolute top-3 left-3 z-10 bg-coffee-amber text-coffee-bg text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                        {badge}
                      </span>
                    )}
                    <button 
                      onClick={() => toggleFavorite(product._id)}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 text-stone-500 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Heart className={`size-4 ${favorites.includes(product._id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-coffee-amber font-semibold uppercase tracking-wider">
                        {categoryMap[product.category] || product.category}
                      </span>
                      <h3 className="font-bold text-sm text-coffee-dark line-clamp-2 mt-0.5 hover:text-coffee-amber transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="size-3 fill-coffee-amber text-coffee-amber" />
                        <span className="text-xs font-semibold text-stone-600">{rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-coffee-latte mt-3">
                      <span className="font-bold text-sm text-coffee-dark">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => handleAddToCart(product.name)}
                        className="p-2 rounded-full bg-coffee-latte/50 hover:bg-coffee-amber hover:text-white text-coffee-dark transition-all duration-300 shadow-sm"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Newsletter Signup (Join Us) */}
      <section id="subscriptions" className="bg-coffee-dark text-coffee-bg rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden border border-coffee-dark/80">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-coffee-amber/10 rounded-full blur-2xl"></div>
        <div className="relative max-w-xl space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold font-serif">Join the Daily Grind Club</h2>
          <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
            Subscribe to our newsletter for exclusive discounts, notifications of new roast drops, and curated brewing guides from champion baristas.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="bg-stone-800/80 border border-stone-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-coffee-amber text-coffee-bg flex-grow"
              required
            />
            <button 
              type="submit" 
              className="bg-coffee-amber hover:bg-coffee-amber/90 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors flex items-center justify-center gap-1.5"
            >
              Subscribe
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Styled Coffee Shop Footer */}
      <footer className="border-t border-coffee-latte pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="size-5 text-coffee-amber" />
              <span className="font-bold tracking-wider font-serif">DAILY GRIND</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              We source specialty-grade, micro-lot coffee beans directly from ethical farmers globally, roasted with precision locally.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-stone-400 hover:text-coffee-amber transition-colors">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-coffee-amber transition-colors">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-coffee-amber transition-colors">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-coffee-amber transition-colors">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs text-stone-500">
              <li><a href="#beans" className="hover:text-coffee-amber transition-colors">Single Origin Beans</a></li>
              <li><a href="#beans" className="hover:text-coffee-amber transition-colors">Signature Espresso Blends</a></li>
              <li><a href="#tools" className="hover:text-coffee-amber transition-colors">Hand-Drip Kits</a></li>
              <li><a href="#tech" className="hover:text-coffee-amber transition-colors">Smart Coffee Scales & Tech</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">Coffee Resources</h4>
            <ul className="space-y-2.5 text-xs text-stone-500">
              <li><a href="#" className="hover:text-coffee-amber transition-colors">V60 Pour Over Guide</a></li>
              <li><a href="#" className="hover:text-coffee-amber transition-colors">Espresso Extraction Tips</a></li>
              <li><a href="#" className="hover:text-coffee-amber transition-colors">Water Chemistry for Brewing</a></li>
              <li><a href="#" className="hover:text-coffee-amber transition-colors">Our Direct Trade Program</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">Store Information</h4>
            <ul className="space-y-2.5 text-xs text-stone-500">
              <li>📍 53 Specialty Ave, Brewtown</li>
              <li>✉️ support@dailygrind.coffee</li>
              <li>📞 (555) 433-2739</li>
              <li>🕒 Mon - Sun: 7:00 AM - 5:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-coffee-latte/50 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Daily Grind Specialty Coffee. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-coffee-amber transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-coffee-amber transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-coffee-amber transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

