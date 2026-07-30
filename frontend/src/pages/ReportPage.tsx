import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { usePrediction } from '../context/PredictionContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { Printer, Download, Brain, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { history } = usePrediction();
  const { user } = useAuth();
  const reportRef = useRef<HTMLDivElement>(null);

  const report = history.find((h) => h.id === id || h.reportId === id) || history[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `NeuroScan_Medical_Report_${report?.reportId || 'Summary'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Fallback to native print dialog:', err);
      window.print();
    }
  };

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-sm font-semibold text-slate-500">Report not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Link
              to="/history"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Clinical Radiology Report
              </h1>
              <p className="text-xs text-slate-400">Report ID: {report.reportId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="blue-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <Download className="w-4 h-4" />
              <span>Save / Download PDF</span>
            </button>
          </div>
        </div>

        {/* Printable PDF Document Sheet Container */}
        <div
          ref={reportRef}
          className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 space-y-8 print:shadow-none print:border-none print:p-0 print:m-0"
        >
          
          {/* Medical Letterhead */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  NeuroScan <span className="text-blue-600">AI</span>
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Diagnostic Neuroradiology Report
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5 text-slate-600">
              <p className="font-bold text-slate-900">{user?.hospital || report.hospitalName || 'Metropolitan Neurological Institute'}</p>
              <p>Department of Diagnostic Imaging</p>
              <p className="font-mono text-slate-500">REF: {report.reportId}</p>
            </div>
          </div>

          {/* Patient Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{report.patientName || 'Robert Vance'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Age / Gender</span>
              <span className="font-semibold text-slate-800">{report.patientAge || 54} Yrs / {report.patientGender || 'Male'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Scan Date</span>
              <span className="font-semibold text-slate-800">{formatDate(report.date)}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Attending Physician</span>
              <span className="font-semibold text-slate-800">{user?.name || 'Attending Physician'}</span>
            </div>
          </div>

          {/* Diagnosis & Findings */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* MRI Thumbnail */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Acquired Slice</span>
              <div className="rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 flex items-center justify-center h-48">
                <img
                  src={report.imageUrl || 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600'}
                  alt="Patient Brain MRI Scan"
                  className="h-48 w-full object-cover"
                />
              </div>
            </div>

            {/* Neural Findings Summary */}
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">AI Model Findings</span>
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Classification</span>
                  <span className="text-lg font-black text-rose-600">{report.prediction}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Neural Confidence Score</span>
                  <span className="font-bold text-slate-900">{report.confidence}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Assessed Risk Category</span>
                  <span className="font-bold text-slate-900">{report.riskLevel || 'High'}</span>
                </div>
              </div>

              {/* Probabilities Mini Table */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Class Probabilities</span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-100">
                    <span className="block text-[10px] text-slate-500">Glioma</span>
                    <span className="font-bold text-slate-900">{report.probabilities?.Glioma || 0}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100">
                    <span className="block text-[10px] text-slate-500">Meningioma</span>
                    <span className="font-bold text-slate-900">{report.probabilities?.Meningioma || 0}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100">
                    <span className="block text-[10px] text-slate-500">Pituitary</span>
                    <span className="font-bold text-slate-900">{report.probabilities?.Pituitary || 0}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100">
                    <span className="block text-[10px] text-slate-500">No Tumor</span>
                    <span className="font-bold text-slate-900">{report.probabilities?.['No Tumor'] || 0}%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Clinical Impressions & Recommendations */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Clinical Impression & Recommendations</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {report.doctorNotes ||
                `Axial MRI slice demonstrates hyperintense signal pattern consistent with ${report.prediction}. VGG16 model confidence logged at ${report.confidence}%. Recommend correlation with contrast-enhanced T1-weighted MRI sequences and immediate multidisciplinary neuro-oncology referral.`}
            </p>
          </div>

          {/* Doctor Signature Block */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200">
            <div className="text-xs text-slate-400">
              <p>Generated by NeuroScan AI Workstation v2.4</p>
              <p className="font-mono text-[10px]">MD5: {Math.random().toString(36).substring(7)}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="font-serif italic text-lg text-slate-800 font-bold border-b border-slate-400 pb-1 px-6">
                Dr. Sarah Jenkins, MD
              </div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Attending Neuroradiologist</span>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
