import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { usePrediction } from '../context/PredictionContext';
import { RecentTable } from '../components/dashboard/RecentTable';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const PredictionHistoryPage: React.FC = () => {
  const { history, deletePrediction } = usePrediction();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'confidence'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Search & Filter Logic
  let filtered = history.filter((item) => {
    const matchesSearch =
      (item.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.reportId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.prediction || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterClass === 'All' || item.prediction === filterClass;

    return matchesSearch && matchesFilter;
  });

  // Sort Logic
  filtered = [...filtered].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
    } else if (sortOrder === 'confidence') {
      return b.confidence - a.confidence;
    }
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Prediction History Archive
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Audit trail of all previous neural MRI scans and patient diagnostics
            </p>
          </div>
          <Link
            to="/upload"
            className="blue-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold self-start sm:self-auto shadow-lg shadow-blue-500/25"
          >
            + Analyze New Scan
          </Link>
        </div>

        {/* Toolbar: Search, Filter, Sort */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient or report ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Tumor Classes</option>
                <option value="Glioma">Glioma</option>
                <option value="Meningioma">Meningioma</option>
                <option value="Pituitary">Pituitary</option>
                <option value="No Tumor">No Tumor</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortOrder}
                onChange={(e: any) => setSortOrder(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="confidence">Sort: Confidence Score</option>
              </select>
            </div>
          </div>

        </div>

        {/* History Table Container */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <RecentTable items={paginatedItems} onDelete={deletePrediction} />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Showing {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-900 dark:text-white px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
