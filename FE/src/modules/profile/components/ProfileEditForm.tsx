import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { profileApi } from '@/modules/profile/api/profile.api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const schema = z.object({
  displayName: z.string().max(60, 'Max 60 characters').optional(),
  bio: z.string().max(200, 'Max 200 characters').optional(),
  phone: z.string().max(20, 'Max 20 characters').optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProfileEditFormProps {
  defaultValues: FormValues;
  onSuccess: () => void;
}

export const ProfileEditForm = ({ defaultValues, onSuccess }: ProfileEditFormProps) => {
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const bioValue = watch('bio') ?? '';

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      await profileApi.updateProfile(values);
      toast.success('Profile updated successfully.');
      window.dispatchEvent(new Event('user-change'));
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Tên hiển thị</Label>
        <Input
          id="displayName"
          placeholder="Tên của bạn"
          className="bg-stone-50 border-stone-200 text-stone-900 focus-visible:ring-coffee-amber focus-visible:border-coffee-amber rounded-xl"
          {...register('displayName')}
        />
        {errors.displayName && (
          <p className="text-xs text-red-500 font-medium">{errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Mô tả bản thân (Bio)</Label>
          <span className="text-xs text-stone-400 font-medium">{bioValue.length}/200</span>
        </div>
        <textarea
          id="bio"
          rows={3}
          placeholder="Giới thiệu bản thân một chút..."
          className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coffee-amber"
          {...register('bio')}
        />
        {errors.bio && (
          <p className="text-xs text-red-500 font-medium">{errors.bio.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Số điện thoại</Label>
        <Input
          id="phone"
          placeholder="Ví dụ: 0987654321"
          className="bg-stone-50 border-stone-200 text-stone-900 focus-visible:ring-coffee-amber focus-visible:border-coffee-amber rounded-xl"
          {...register('phone')}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-coffee-dark hover:bg-coffee-amber text-coffee-bg font-bold rounded-full h-11 transition-all duration-300 mt-2 shadow-sm" 
        disabled={saving}
      >
        {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
      </Button>
    </form>
  );
};
