import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/modules/auth/api/auth.api';
import { tokenStore } from '@/modules/auth/store/token.store';
import { AvatarUpload } from '@/modules/profile/components/AvatarUpload';
import { ProfileEditForm } from '@/modules/profile/components/ProfileEditForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { CurrentUser } from '@/modules/auth/types/auth.types';

type ProfileUser = CurrentUser & {
  displayName?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
};

export const ProfilePage = () => {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data as ProfileUser);
    } catch {
      tokenStore.clear();
      navigate('/logout');
    }
  }, [navigate]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-coffee-dark">Hồ sơ cá nhân</h1>
        <p className="text-sm text-stone-500">Quản lý thông tin tài khoản của bạn.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — avatar + email */}
        <Card className="flex flex-col items-center gap-4 p-6 lg:col-span-1 bg-white text-coffee-dark border border-coffee-latte shadow-sm rounded-3xl">
          <AvatarUpload
            currentAvatarUrl={user?.avatarUrl}
            userInitials={initials}
            onUploadSuccess={(newUrl) => setUser((prev) => prev ? { ...prev, avatarUrl: newUrl } : prev)}
          />
          <div className="text-center space-y-1">
            {user?.displayName && (
              <p className="font-bold text-lg text-coffee-dark">{user.displayName}</p>
            )}
            <p className="text-sm text-stone-500 font-medium">{user?.email ?? '—'}</p>
          </div>
        </Card>

        {/* Right column — edit form */}
        <Card className="lg:col-span-2 bg-white text-coffee-dark border border-coffee-latte shadow-sm rounded-3xl">
          <CardHeader className="border-b border-coffee-latte pb-4">
            <CardTitle className="text-lg font-serif font-bold text-coffee-dark">Chỉnh sửa hồ sơ</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {user ? (
              <ProfileEditForm
                defaultValues={{
                  displayName: user.displayName ?? '',
                  bio: user.bio ?? '',
                  phone: user.phone ?? '',
                }}
                onSuccess={fetchUser}
              />
            ) : (
              <p className="text-sm text-stone-500">Đang tải thông tin...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
