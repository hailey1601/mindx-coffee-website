import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const requestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

const resetSchema = z.object({
  email: z.string().optional(),
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type RequestValues = z.infer<typeof requestSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
  });
  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
  });

  const onRequestToken = requestForm.handleSubmit(async (values) => {
    try {
      await authApi.forgotPassword(values.email);
      setEmail(values.email);
      setStep('reset');
      toast.success('Reset token sent to your email.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Something went wrong');
    }
  });

  const onResetPassword = resetForm.handleSubmit(async (values) => {
    try {
      await authApi.resetPassword(email || values.email || '', values.token, values.newPassword);
      toast.success('Password reset successful. You can login now.');
      setStep('request');
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Something went wrong');
    }
  });

  return (
    <div className="bg-white border border-coffee-latte rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold font-serif text-coffee-dark">
          {step === 'request' ? 'Forgot password' : 'Reset password'}
        </h2>
        <p className="text-xs text-stone-500">
          {step === 'request'
            ? 'Enter your email to receive a reset token.'
            : `Enter the token sent to ${email} and your new password.`}
        </p>
      </div>
      <div>
        {step === 'request' ? (
          <form className="space-y-4" onSubmit={onRequestToken}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Email Address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <Input 
                  id="email" 
                  className="pl-9 bg-white border border-coffee-latte focus-visible:ring-coffee-amber focus-visible:border-coffee-amber text-coffee-dark rounded-xl h-11" 
                  placeholder="name@example.com" 
                  {...requestForm.register('email')} 
                />
              </div>
              {requestForm.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium">{requestForm.formState.errors.email.message}</p>
              )}
            </div>
            <Button 
              className="w-full bg-coffee-dark hover:bg-coffee-amber text-coffee-bg font-bold rounded-full h-11 transition-all duration-300 mt-2 shadow-sm" 
              type="submit"
            >
              Send Reset Token
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onResetPassword}>
            <div className="space-y-2">
              <Label htmlFor="token" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Reset Token</Label>
              <Input 
                id="token" 
                className="bg-white border border-coffee-latte focus-visible:ring-coffee-amber focus-visible:border-coffee-amber text-coffee-dark rounded-xl h-11" 
                placeholder="Paste token from email" 
                {...resetForm.register('token')} 
              />
              {resetForm.formState.errors.token && (
                <p className="text-xs text-red-500 font-medium">{resetForm.formState.errors.token.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-stone-500">New Password</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <Input 
                  id="newPassword" 
                  className="pl-9 bg-white border border-coffee-latte focus-visible:ring-coffee-amber focus-visible:border-coffee-amber text-coffee-dark rounded-xl h-11" 
                  type="password" 
                  placeholder="At least 6 characters" 
                  {...resetForm.register('newPassword')} 
                />
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="text-xs text-red-500 font-medium">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <Button 
              className="w-full bg-coffee-dark hover:bg-coffee-amber text-coffee-bg font-bold rounded-full h-11 transition-all duration-300 mt-2 shadow-sm" 
              type="submit"
            >
              Reset Password
            </Button>
            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-center text-xs font-semibold text-stone-500 hover:text-coffee-amber transition-colors mt-3"
            >
              Back to request token
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
