import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { RecentTable } from '../components/dashboard/RecentTable';
import { usePrediction } from '../context/PredictionContext';
import { useAuth } from '../context/AuthContext';
import { Brain, Activity, ShieldAlert, CheckCircle2, UploadCloud } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { history, deletePrediction } = usePrediction();
  const { user } = useAuth();

  const totalScans = history.length;
  const tumorCount = history.filter((item) => item.prediction !== 'No Tumor').length;
  const healthyCount = history.filter((item) => item.prediction === 'No Tumor').length;
  
  const avgConfidence = totalScans > 0
    ? (history.reduce((sum, item) => sum + item.confidence, 0) / totalScans).toFixed(2)
    : '0.00';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Personalized Dynamic Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name || 'Radiologist'}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/40 shadow-lg shadow-blue-500/10"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {user?.name || 'Radiologist'}
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-brand-600 dark:text-brand-400">{user?.email || 'authenticated'}</span>
                {user?.hospital && (
                  <>
                    {' • '}
                    <span>{user.hospital}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <Link
            to="/upload"
            className="blue-gradient-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Analyze MRI Scan</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Predictions"
            value={totalScans}
            change={totalScans > 0 ? `${totalScans} total scans logged` : '0 scans logged'}
            icon={Brain}
            color="blue-gradient-btn"
          />
          <StatCard
            title="Tumors Detected"
            value={tumorCount}
            change={tumorCount > 0 ? `${tumorCount} abnormal scans` : '0 tumors detected'}
            icon={ShieldAlert}
            color="bg-gradient-to-r from-rose-500 to-amber-500"
          />
          <StatCard
            title="Normal Scans"
            value={healthyCount}
            change={healthyCount > 0 ? `${healthyCount} clear scans` : '0 normal scans'}
            icon={CheckCircle2}
            color="bg-gradient-to-r from-emerald-500 to-teal-500"
          />
          <StatCard
            title="Model Accuracy"
            value={`${avgConfidence}%`}
            change={totalScans > 0 ? `${avgConfidence}% avg confidence` : 'VGG16 Transfer Learning'}
            icon={Activity}
            color="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>

        {/* Analytics Charts */}
        <AnalyticsCharts />

        {/* Recent Scan History Log */}
        <RecentTable items={history} onDelete={deletePrediction} />

      </div>
    </DashboardLayout>
  );
};
