import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { usePrediction } from '../../context/PredictionContext';

export const AnalyticsCharts: React.FC = () => {
  const { history } = usePrediction();

  // Total generated reports count
  const totalReports = history.length;
  const gliomaCount = history.filter((h) => h.prediction === 'Glioma').length;
  const meningiomaCount = history.filter((h) => h.prediction === 'Meningioma').length;
  const pituitaryCount = history.filter((h) => h.prediction === 'Pituitary').length;
  const noTumorCount = history.filter((h) => h.prediction === 'No Tumor').length;

  const getPercent = (count: number) => {
    if (totalReports === 0) return 0;
    return Math.round((count / totalReports) * 100);
  };

  // Pie chart data starts strictly at 0 if no reports generated
  const pieData = [
    { name: 'Glioma', value: totalReports > 0 ? gliomaCount : 0, count: gliomaCount, percentage: getPercent(gliomaCount), color: '#ef4444' },
    { name: 'Meningioma', value: totalReports > 0 ? meningiomaCount : 0, count: meningiomaCount, percentage: getPercent(meningiomaCount), color: '#f59e0b' },
    { name: 'Pituitary', value: totalReports > 0 ? pituitaryCount : 0, count: pituitaryCount, percentage: getPercent(pituitaryCount), color: '#8b5cf6' },
    { name: 'No Tumor', value: totalReports > 0 ? noTumorCount : 0, count: noTumorCount, percentage: getPercent(noTumorCount), color: '#10b981' },
  ];

  // If 0 reports exist, fallback placeholder ring data (empty ring)
  const emptyPieData = [
    { name: 'No Scan Data', value: 1, color: '#334155' }
  ];

  // Dynamic Real-time Monthly Scan Activity Trend Data
  const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const months = ALL_MONTHS.slice(0, Math.max(currentMonthIdx + 1, 6));

  const monthCounts: Record<string, { scans: number; tumors: number }> = {};
  months.forEach((m) => {
    monthCounts[m] = { scans: 0, tumors: 0 };
  });

  history.forEach((item) => {
    let dateObj: Date | null = null;
    if (item.date) {
      const parsed = new Date(item.date);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }

    if (!dateObj) {
      dateObj = new Date();
    }

    const mName = dateObj.toLocaleString('en-US', { month: 'short' });
    if (monthCounts[mName] !== undefined) {
      monthCounts[mName].scans += 1;
      if (item.prediction !== 'No Tumor') {
        monthCounts[mName].tumors += 1;
      }
    }
  });

  const lineData = months.map((m) => ({
    month: m,
    scans: monthCounts[m].scans,
    tumors: monthCounts[m].tumors,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Distribution Pie Chart */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Classification Breakdown</h3>
          <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{totalReports} Total Reports</span>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={totalReports > 0 ? pieData : emptyPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={totalReports > 0 ? 5 : 0}
                dataKey="value"
              >
                {(totalReports > 0 ? pieData : emptyPieData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {totalReports > 0 && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any, item: any) => {
                    const payload = item?.payload;
                    return [`${payload?.count ?? value} Scans (${payload?.percentage ?? 0}%)`, name];
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-2">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                {item.name} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends Line Chart */}
      <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Scan Activity</h3>
          <span className="text-xs text-slate-400 font-medium">2026 YTD</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="scans" stroke="#0c8de9" strokeWidth={3} dot={{ r: 4 }} name="Total Scans" />
              <Line type="monotone" dataKey="tumors" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="Tumors Detected" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
