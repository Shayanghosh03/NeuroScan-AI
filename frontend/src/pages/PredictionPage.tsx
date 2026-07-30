import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GradCAMOverlay } from '../components/mri/GradCAMOverlay';
import { ConfidenceMeter } from '../components/mri/ConfidenceMeter';
import { ProbabilityChart } from '../components/mri/ProbabilityChart';
import { Modal } from '../components/common/Modal';
import { usePrediction } from '../context/PredictionContext';
import { getTumorBadgeColor, getRiskBadgeColor, formatDate } from '../utils/formatters';
import { Brain, FileText, Share2, ArrowLeft, CheckCircle2, AlertTriangle, Stethoscope, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PredictionPage: React.FC = () => {
  const { currentPrediction, history } = usePrediction();
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeData = currentPrediction || history[0];

  useEffect(() => {
    if (activeData && activeData.prediction === 'No Tumor') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [activeData]);

  if (!activeData) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 space-y-4">
          <Brain className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">No active prediction available</h2>
          <p className="text-sm text-slate-500">Please upload an MRI scan to view classification results.</p>
          <Link to="/upload" className="blue-gradient-btn inline-flex px-6 py-3 rounded-xl font-bold text-sm">
            Analyze MRI Scan
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isHealthy = activeData.prediction === 'No Tumor';

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Prediction Diagnosis
              </h1>
              <p className="text-xs text-slate-400">Report ID: {activeData.reportId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Result</span>
            </button>

            <Link
              to={`/report/${activeData.reportId}`}
              className="blue-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF Report</span>
            </Link>
          </div>
        </div>

        {/* Primary Classification Result Banner */}
        <div
          className={`glass-card rounded-3xl p-6 sm:p-8 border ${
            isHealthy
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-rose-500/30 bg-rose-500/5'
          } flex flex-col sm:flex-row items-center justify-between gap-6`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${
                isHealthy ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
            >
              {isHealthy ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                Primary Classification Result
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {activeData.prediction} {isHealthy ? '(Normal Parenchyma)' : 'Detected'}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTumorBadgeColor(activeData.prediction)}`}>
                  {activeData.prediction}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeColor(activeData.riskLevel)}`}>
                  Risk Level: {activeData.riskLevel || 'Low'}
                </span>
                <span className="text-xs text-slate-400">Scan Date: {formatDate(activeData.date)}</span>
              </div>
            </div>
          </div>

          <ConfidenceMeter confidence={activeData.confidence} prediction={activeData.prediction} />
        </div>

        {/* 2-Column Grid: Visualizer & Probabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: GradCAM Overlay MRI Visualizer */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-brand-500" />
              <span>MRI Feature Mapping & Heatmap</span>
            </h3>

            <GradCAMOverlay
              imageUrl={activeData.imageUrl || 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600'}
              prediction={activeData.prediction}
            />
          </div>

          {/* Right: Probability Chart & Recommendations */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Probability Distribution Box */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Class Probability Distribution
              </h3>
              <ProbabilityChart probabilities={activeData.probabilities} />
            </div>

            {/* Doctor Recommendation Card */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
                <Stethoscope className="w-5 h-5" />
                <span>Clinical Recommendations</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHealthy
                  ? 'No mass effect or abnormal enhancement detected. Recommend routine screening according to standard clinical protocols.'
                  : `High indication of ${activeData.prediction} detected with ${activeData.confidence}% neural confidence. Recommended contrast T1/T2 MRI sequence and consultation with neurosurgery.`}
              </p>
            </div>

          </div>

        </div>

        {/* Share Modal */}
        <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share Diagnosis Result">
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Share secure diagnostic summary report link with consulting radiologists:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-300"
              />
              <button
                onClick={handleCopyShareLink}
                className="blue-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </DashboardLayout>
  );
};
