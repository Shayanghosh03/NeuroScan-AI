import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setErrorMessage(decodeURIComponent(error));
        setTimeout(() => navigate('/login?error=' + encodeURIComponent(error)), 3500);
        return;
      }

      if (!token) {
        setStatus('error');
        setErrorMessage('No authentication token received from provider.');
        setTimeout(() => navigate('/login'), 3500);
        return;
      }

      try {
        // Save JWT token locally
        localStorage.setItem('neuroscan_token', token);
        
        // Fetch current user details from API
        const user = await authService.getProfile();
        if (user) {
          localStorage.setItem('neuroscan_user', JSON.stringify(user));
        }

        // If authenticated via popup window, notify parent window and close popup
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token, user }, window.location.origin);
          window.close();
          return;
        }

        setStatus('success');
        
        // Short pause to render success animation then transition to workstation dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 800);
      } catch (err: any) {
        console.warn('Backend profile resolution notice on Google callback:', err);
        const cachedUser = localStorage.getItem('neuroscan_user');
        if (cachedUser) {
          setStatus('success');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 800);
        } else {
          setStatus('error');
          setErrorMessage('Failed to verify session profile.');
          setTimeout(() => navigate('/login'), 3500);
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white">
      <div className="w-full max-w-md p-8 glass-card rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl blue-gradient-btn flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
          <Brain className="w-8 h-8 text-white" />
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-brand-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-semibold tracking-wide">Verifying Google Credentials...</span>
            </div>
            <p className="text-xs text-slate-400">Exchanging authorization token for secure JWT session.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-6 h-6" />
              <span>Authentication Successful!</span>
            </div>
            <p className="text-xs text-slate-400">Redirecting to your Radiologist Dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertCircle className="w-6 h-6" />
              <span>Authentication Failed</span>
            </div>
            <p className="text-xs text-rose-300/80 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              {errorMessage}
            </p>
            <p className="text-[11px] text-slate-500">Redirecting back to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
};
