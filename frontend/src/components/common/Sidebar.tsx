import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, History, FileSpreadsheet, Settings, LogOut, Brain, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Analyze MRI', icon: UploadCloud, path: '/upload' },
    { label: 'Prediction History', icon: History, path: '/history' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 glass-card h-full flex flex-col justify-between p-4 border-r border-slate-200 dark:border-slate-800 transition-colors">
      
      <div className="space-y-6">
        {/* Brand / Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-xl blue-gradient-btn flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-none">
              NeuroScan AI
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Medical Workstation</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'blue-gradient-btn text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1.5">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            logout();
            if (onCloseMobile) onCloseMobile();
            navigate('/');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>

    </aside>
  );
};
