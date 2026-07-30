import React from 'react';
import { Brain, RefreshCw } from 'lucide-react';

interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ label = 'Processing AI Analysis...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className={`${sizeClasses[size]} rounded-2xl blue-gradient-btn flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse`}>
          <Brain className="w-1/2 h-1/2 text-white animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-400/40 animate-ping" />
      </div>
      {label && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
          <span>{label}</span>
        </p>
      )}
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
    </div>
  </div>
);
