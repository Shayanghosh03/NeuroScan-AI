import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { UploadArea } from '../components/mri/UploadArea';
import { usePrediction } from '../context/PredictionContext';
import { Brain, User, Shield, Sparkles, ArrowRight } from 'lucide-react';

export const MRIUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('Unspecified');
  const { analyzeMRI, isAnalyzing } = usePrediction();
  const navigate = useNavigate();

  const handleFileSelected = (orig: File, comp: File) => {
    setFile(orig);
    setCompressedFile(comp);
  };

  const handleStartAnalysis = async () => {
    if (!compressedFile && !file) return;
    const targetFile = compressedFile || file!;
    
    await analyzeMRI(targetFile, {
      name: patientName.trim() || 'Anonymous Patient',
      age: patientAge ? Number(patientAge) : undefined,
      gender: patientGender,
    });

    navigate('/prediction');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>VGG16 Model Ready</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analyze Brain MRI Scan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload axial slice DICOM/PNG/JPG MRI scan for automated tumor classification and feature mapping.
          </p>
        </div>

        {/* Form & Upload Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Patient Details Side Form */}
          <div className="md:col-span-4 glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Patient Metadata (Optional)
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Patient Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe (Optional)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Unspecified">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Shield className="w-4 h-4" />
                <span>Client Pre-processing</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Images are normalized to 224x224 RGB tensors before neural inference to maximize detection accuracy.
              </p>
            </div>
          </div>

          {/* Upload Area & Analyze Action */}
          <div className="md:col-span-8 space-y-6">
            <UploadArea
              onFileSelected={handleFileSelected}
              isAnalyzing={isAnalyzing}
              onCancel={() => {
                setFile(null);
                setCompressedFile(null);
              }}
            />

            <button
              onClick={handleStartAnalysis}
              disabled={!file || isAnalyzing}
              className={`w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 transition-all ${
                file && !isAnalyzing
                  ? 'blue-gradient-btn text-white shadow-xl shadow-blue-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span>{isAnalyzing ? 'Running Neural Classification...' : 'Analyze MRI Scan Now'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
