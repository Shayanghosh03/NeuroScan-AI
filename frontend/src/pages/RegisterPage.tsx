import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Brain, User, Mail, Lock, Building, ArrowRight, ArrowLeft, RefreshCw, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { RegisterParams } from '../services/authService';

interface ExtendedRegisterParams extends RegisterParams {
  confirmPassword?: string;
  captchaInput?: string;
}

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [captchaCode, setCaptchaCode] = useState<string>('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExtendedRegisterParams>();

  const passwordValue = watch('password');

  const onSubmit = async (data: ExtendedRegisterParams) => {
    setError(null);

    // Verify Password Match
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    // Verify CAPTCHA Code
    if (!data.captchaInput || data.captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError('Invalid CAPTCHA code. Please type the exact letters shown in the image.');
      generateCaptcha();
      return;
    }

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        hospital: data.hospital
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check input values.');
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors py-12 relative">
      
      {/* Top Back to Home Button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Home Page</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6 mt-8 sm:mt-0">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl blue-gradient-btn flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Register Clinical Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join medical institutions utilizing NeuroScan AI
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name & Medical Credentials
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Dr. Sarah Jenkins, MD"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hospital / Institution Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="s.jenkins@neuroscanai.med"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500">{errors.email.message}</p>}
            </div>

            {/* Hospital / Clinic */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hospital / Institution Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  {...register('hospital')}
                  placeholder="Metropolitan Neurological Institute"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Create Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === passwordValue || 'Passwords do not match'
                  })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* CAPTCHA Security Verification */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                  <span>Security CAPTCHA Verification</span>
                </label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  title="Generate new CAPTCHA code"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Visual Captcha Image/Box */}
              <div className="relative overflow-hidden rounded-xl bg-slate-900 p-3 flex items-center justify-between border border-slate-800 shadow-inner select-none">
                <div className="flex items-center space-x-2 font-mono text-lg font-extrabold tracking-widest text-slate-100 italic select-none">
                  {captchaCode.split('').map((char, index) => (
                    <span
                      key={index}
                      className="inline-block transform"
                      style={{
                        transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (5 + (index * 4))}deg)`,
                        color: index % 2 === 0 ? '#38bdf8' : '#a855f7'
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-800/60 px-2 py-1 rounded">
                  Anti-Bot Shield
                </span>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  {...register('captchaInput', { required: 'Please enter the CAPTCHA code' })}
                  placeholder="Type CAPTCHA code"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {errors.captchaInput && <p className="text-[11px] text-rose-500">{errors.captchaInput.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full blue-gradient-btn py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 mt-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google Auth Option */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
            <button
              type="button"
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                window.location.href = `${baseUrl}/auth/google`;
              }}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Register with Google Workspace</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign In Here
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};
