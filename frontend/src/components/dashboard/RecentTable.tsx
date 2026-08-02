import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2, FileText } from 'lucide-react';
import type { PredictionResult } from '../../types';
import { formatDate, getTumorBadgeColor } from '../../utils/formatters';

interface RecentTableProps {
  items: PredictionResult[];
  onDelete?: (id: string) => void;
}

export const RecentTable: React.FC<RecentTableProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No predictions recorded yet.</p>
        <p className="text-xs text-slate-400 mt-1">Upload an MRI scan to generate your first AI report.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4">MRI Scan</th>
            <th className="py-3.5 px-4">Patient / ID</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Prediction</th>
            <th className="py-3.5 px-4">Confidence</th>
            <th className="py-3.5 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {items.map((item) => (
            <tr key={item.id || item.reportId} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=150'}
                    alt="MRI Thumbnail"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23090d16"/><circle cx="50" cy="50" r="30" fill="%231e293b"/></svg>`;
                    }}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />

                  <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                    {item.imageName || item.reportId}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-xs">{item.patientName || 'Anonymous'}</p>
                  <p className="text-[11px] font-mono text-slate-400">{item.reportId}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {formatDate(item.date)}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getTumorBadgeColor(item.prediction)}`}>
                  {item.prediction}
                </span>
              </td>
              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-xs">
                {item.confidence}%
              </td>
              <td className="py-3 px-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/report/${item.reportId || item.id}`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                    title="View Report"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  {onDelete && (item.id || item.reportId) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const recordId = item.id || item.reportId;
                        if (window.confirm(`Are you sure you want to delete report ${item.reportId || recordId}?`)) {
                          onDelete(recordId);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
