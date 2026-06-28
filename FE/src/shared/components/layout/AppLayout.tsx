import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, LogOut, ShieldCheck } from 'lucide-react';
import { authApi } from '@/modules/auth/api/auth.api';
import { tokenStore } from '@/modules/auth/store/token.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import type { CurrentUser } from '@/modules/auth/types/auth.types';

export const AppLayout = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    authApi.getMe()
      .then((res) => setUser(res.data as CurrentUser))
      .catch(() => {
        tokenStore.clear();
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    tokenStore.clear();
    navigate('/login');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <div className="min-h-screen bg-coffee-bg text-coffee-dark font-sans transition-all duration-300">
      {/* Brand Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-coffee-latte bg-coffee-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Coffee className="size-6 text-coffee-amber" />
            <span className="text-xl font-bold tracking-wider font-serif text-coffee-dark">DAILY GRIND</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/?category=Beans" className="hover:text-coffee-amber transition-colors text-coffee-dark">Shop Beans</Link>
            <Link to="/?category=Tools" className="hover:text-coffee-amber transition-colors text-coffee-dark">Brewing Tools</Link>
            <Link to="/?category=Tech" className="hover:text-coffee-amber transition-colors text-coffee-dark">Tech & Gear</Link>
            <a href="#subscriptions" className="hover:text-coffee-amber transition-colors text-coffee-dark">Subscriptions</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 hover:text-coffee-amber transition-all">
              <Avatar className="size-8 border border-coffee-latte">
                <AvatarImage src={user?.avatarUrl} alt={user?.email} />
                <AvatarFallback className="text-xs bg-coffee-latte text-coffee-dark">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold hidden sm:inline-block text-coffee-dark">
                Hi, {displayName}
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="gap-1.5 text-stone-500 hover:text-coffee-amber hover:bg-coffee-latte/40 px-3 py-1.5 rounded-full text-xs"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
