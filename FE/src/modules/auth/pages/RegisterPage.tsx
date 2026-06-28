import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { OtpInput } from '@/shared/components/ui/otp-input';

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onRegisterSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      await authApi.register({ email: values.email, password: values.password });
      setEmail(values.email);
      setStep('verify');
      toast.success('OTP sent to your email.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  });

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await authApi.verifyRegisterOtp(email, otp);
      toast.success('Account verified! You can login now.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Invalid OTP');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="bg-white border border-coffee-latte rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold font-serif text-coffee-dark">Confirm OTP</h2>
          <p className="text-xs text-stone-500">
            Enter the 6-digit code sent to <span className="font-semibold text-coffee-amber">{email}</span>
          </p>
        </div>
        <div>
          <form className="space-y-5" onSubmit={onVerifySubmit}>
            <div className="flex justify-center">
              <OtpInput value={otp} onChange={setOtp} />
            </div>
            <Button 
              className="w-full bg-coffee-dark hover:bg-coffee-amber text-coffee-bg font-bold rounded-full h-11 transition-all duration-300 shadow-sm" 
              type="submit" 
              disabled={otp.length !== 6 || loading}
            >
              {loading && <Loader2 className="size-4 animate-spin mr-1.5" />}
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => { setStep('register'); setOtp(''); }}
              className="block w-full text-center text-xs font-semibold text-stone-500 hover:text-coffee-amber transition-colors"
            >
              Back to register
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-coffee-latte rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold font-serif text-coffee-dark">Create account</h2>
        <p className="text-xs text-stone-500">Register with your email and password.</p>
      </div>
      <div>
        <form className="space-y-4" onSubmit={onRegisterSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Email Address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <Input 
                id="email" 
                className="pl-9 bg-white border border-coffee-latte focus-visible:ring-coffee-amber focus-visible:border-coffee-amber text-coffee-dark rounded-xl h-11" 
                placeholder="name@example.com" 
                {...register('email')} 
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Password</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <Input 
                id="password" 
                className="pl-9 bg-white border border-coffee-latte focus-visible:ring-coffee-amber focus-visible:border-coffee-amber text-coffee-dark rounded-xl h-11" 
                type="password" 
                placeholder="At least 6 characters" 
                {...register('password')} 
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <Button 
            className="w-full bg-coffee-dark hover:bg-coffee-amber text-coffee-bg font-bold rounded-full h-11 transition-all duration-300 mt-2 shadow-sm" 
            type="submit" 
            disabled={loading}
          >
            {loading && <Loader2 className="size-4 animate-spin mr-1.5" />}
            Register and Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
};
