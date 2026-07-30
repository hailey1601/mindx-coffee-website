import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { createUserWithOtp, issueOtpForUser, issueResetToken } from '../services/user.service';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await createUserWithOtp(email, password);
  if (!user) return res.status(409).json({ message: 'Email already exists' });
  
  const responseData: any = { message: 'OTP has been sent to your email' };
  // Trả về OTP trực tiếp trong response để test nếu chưa cấu hình Gmail thật
  if (!env.smtpUser || env.smtpUser.includes('example.com') || env.smtpUser === '') {
    responseData.otp = user.otpCode;
    responseData.note = "Test Mode: OTP được trả về trực tiếp vì chưa cấu hình SMTP.";
  }
  return res.status(201).json(responseData);
};

export const verifyRegisterOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body as { email: string; otp: string };
  const user = await UserModel.findOne({ email });
  if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isEmailVerified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  return res.json({ message: 'Email verified successfully' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await UserModel.findOne({ email });

  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isEmailVerified) {
    return res.status(403).json({ message: 'Please verify your email first using register OTP' });
  }

  const updatedUser = await issueOtpForUser(String(user._id));
  const responseData: any = { message: 'OTP has been sent to your email', requiresOtp: true, email: user.email };
  
  // Trả về OTP trực tiếp trong response để test nếu chưa cấu hình Gmail thật
  if (updatedUser && (!env.smtpUser || env.smtpUser.includes('example.com') || env.smtpUser === '')) {
    responseData.otp = updatedUser.otpCode;
    responseData.note = "Test Mode: OTP được trả về trực tiếp vì chưa cấu hình SMTP.";
  }
  return res.status(202).json(responseData);
};

export const verifyLoginOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body as { email: string; otp: string };
  const user = await UserModel.findOne({ email });
  if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
  return res.json({ token });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const updatedUser = await issueResetToken(email);
  
  const responseData: any = { message: 'Reset password token sent to your email' };
  // Trả về Token trực tiếp trong response để test nếu chưa cấu hình Gmail thật
  if (updatedUser && (!env.smtpUser || env.smtpUser.includes('example.com') || env.smtpUser === '')) {
    responseData.token = updatedUser.resetToken;
    responseData.note = "Test Mode: Token được trả về trực tiếp vì chưa cấu hình SMTP.";
  }
  return res.json(responseData);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body as {
    email: string;
    token: string;
    newPassword: string;
  };
  const user = await UserModel.findOne({ email });
  if (!user || user.resetToken !== token || !user.resetTokenExpiresAt || user.resetTokenExpiresAt.getTime() < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = await hashPassword(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  return res.json({ message: 'Password reset successful' });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  const user = await UserModel.findById(userId).select('-password -otpCode -resetToken');
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
};

export const promoteToAdmin = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  const targetEmail = email || req.user?.email;

  if (!targetEmail) {
    return res.status(400).json({ message: 'Email là bắt buộc' });
  }

  const user = await UserModel.findOne({ email: targetEmail.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: `Không tìm thấy người dùng với email: ${targetEmail}` });
  }

  user.role = 'admin';
  await user.save();

  return res.json({ message: `Đã nâng cấp tài khoản ${user.email} thành Admin thành công!`, role: user.role });
};

