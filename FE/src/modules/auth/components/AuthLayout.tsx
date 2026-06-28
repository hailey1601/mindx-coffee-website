import { Coffee, CheckCircle } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
  { to: '/forgot-password', label: 'Forgot Password' }
];

export const AuthLayout = () => {
  const location = useLocation();

  return (
    <main className="relative mx-auto flex min-h-screen w-full items-center justify-center p-4 md:p-8 bg-coffee-bg">
      <section className="grid w-full max-w-5xl gap-8 md:grid-cols-2 bg-white/40 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-coffee-latte/60 shadow-sm">
        
        {/* Left Panel: Brand Showcase */}
        <div className="hidden rounded-2xl bg-coffee-latte/30 border border-coffee-latte/60 p-8 md:flex md:flex-col md:justify-between h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 size-32 bg-coffee-amber/5 rounded-full blur-xl -mr-6 -mt-6"></div>
          <div className="space-y-6 z-10">
            <div className="flex items-center gap-2">
              <Coffee className="size-6 text-coffee-amber" />
              <span className="text-xl font-bold tracking-wider font-serif text-coffee-dark">DAILY GRIND</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight font-serif text-coffee-dark">
                Elevate Your Morning Ritual.
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                Join our exclusive Coffee Club to access micro-lot single origin beans, premium brewing tools, and masterclass guides.
              </p>
            </div>

            {/* Coffee Shop Features */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="size-4 text-coffee-amber mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-coffee-dark">Direct Trade Beans</h4>
                  <p className="text-[10px] text-stone-500">Sourced ethically from global micro-lots, roasted fresh.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="size-4 text-coffee-amber mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-coffee-dark">Precision Brewing Tools</h4>
                  <p className="text-[10px] text-stone-500">Kettles, drippers, and smart scales for exact extractions.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="size-4 text-coffee-amber mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-coffee-dark">Freshness Guaranteed</h4>
                  <p className="text-[10px] text-stone-500">Every bag shipped within 48 hours of roasting.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl overflow-hidden aspect-[16/9] border border-coffee-latte shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=500" 
              alt="Artisan pour over coffee bar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Panel: Auth Forms */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="flex justify-center">
            <nav className="inline-flex rounded-full bg-coffee-latte/40 p-1 border border-coffee-latte/60 shadow-inner">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-xs transition-all duration-300 font-medium',
                    location.pathname === item.to
                      ? 'bg-coffee-dark text-coffee-bg shadow-sm'
                      : 'text-stone-600 hover:text-coffee-dark hover:bg-coffee-latte/30'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </div>

      </section>
    </main>
  );
};
