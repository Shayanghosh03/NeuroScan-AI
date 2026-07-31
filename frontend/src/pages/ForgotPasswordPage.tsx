import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Brain, Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Step 1 = Enter Email, Step 2 = Enter OTP & New Password, Step 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Step 1: Send OTP to email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      
      if (!res || !res.success || !res.otp) {
        setIsLoading(false);
        setError(res?.message || 'No account found with this email address. Please register your account first.');
        return;
      }

      setIsLoading(false);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setStep(2);

      if (res.otp) {
        // Dispatch 6-digit OTP code securely to user's email inbox via EmailJS
        try {
          const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_azhfbua';
          const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || 'template_rrubd8s';
          const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'OsYSMeTXW8DpUKaB0';

          if (publicKey && !publicKey.includes('your_emailjs_public_key')) {
            await emailjs.send(
              serviceId,
              autoReplyTemplateId,
              {
                name: email.split('@')[0],
                user_name: email.split('@')[0],
                email: res.email,
                to_email: res.email,
                user_email: res.email,
                title: `Password Reset Code: ${res.otp}`,
                subject: `Password Reset Code: ${res.otp}`,
                message: `Your NeuroScan AI password reset 6-digit verification code is: ${res.otp}. Please use this code to set your new password. Valid for 15 minutes.`,
              },
              publicKey
            );
          }
        } catch (emailErr) {
          console.warn('EmailJS OTP Dispatch Notice:', emailErr);
        }
      }
      setSuccessMsg(`Verification OTP code sent to ${res.email}. Please check your email inbox.`);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'No account found with this email address. Please register first.');
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim() || otp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword) {
      setError('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp: otp.trim(),
        newPassword,
      });
      setIsLoading(false);
      setStep(3);
      setTimeout(() => {
        navigate('/login');
      }, 2200);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to reset password.');
    }
  };

  // Real-time strength score calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: '' };
    if (pwd.length < 6) return { label: 'Weak (Min 6 chars)', color: 'text-rose-500' };
    if (pwd.length < 10) return { label: 'Good Password', color: 'text-amber-500' };
    return { label: 'Strong Password', color: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors relative">
      
      {/* Top Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6 mt-12 sm:mt-0">
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl blue-gradient-btn flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            NeuroScan AI Account Recovery & Security
          </p>
        </div>

        {/* Card Container */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && step === 2 && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} autoComplete="off" className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Only registered emails will receive a password reset verification code.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full blue-gradient-btn py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'Generating Code...' : 'Send Verification OTP'}</span>
              </button>
            </form>
          )}

          {/* STEP 2: Enter OTP & Reset Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} autoComplete="off" className="space-y-4">
              
              {/* 6-Digit OTP Code */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  6-Digit Verification Code (OTP)
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-brand-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="reset_otp_code"
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="new_user_password"
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && (
                  <p className={`text-[10px] font-semibold ${strength.color}`}>{strength.label}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirm_user_password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {confirmPassword && (
                  <p className="text-[10px] font-medium">
                    {confirmPassword === newPassword ? (
                      <span className="text-emerald-500 font-semibold">✓ Passwords match</span>
                    ) : (
                      <span className="text-rose-500">✗ Passwords do not match</span>
                    )}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 blue-gradient-btn py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <span>{isLoading ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Password Reset Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your password has been updated securely. Redirecting you to the Sign In page...
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="blue-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-block"
                >
                  Sign In Now
                </Link>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Remember your password?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Back to Sign In
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};
