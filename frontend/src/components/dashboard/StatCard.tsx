import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:shadow-xl transition-all">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {change && (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>{change}</span>
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
