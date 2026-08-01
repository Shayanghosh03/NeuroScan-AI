import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { UploadArea } from '../components/mri/UploadArea';
import { usePrediction } from '../context/PredictionContext';
import { Brain, User, Shield, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export const MRIUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const { analyzeMRI, isAnalyzing } = usePrediction();
  const navigate = useNavigate();

  const handleFileSelected = (orig: File, comp: File) => {
    setFile(orig);
    setCompressedFile(comp);
  };

  const isFormValid = Boolean(
    (compressedFile || file) &&
    patientName.trim().length > 0 &&
    patientAge.trim().length > 0 &&
    Number(patientAge) > 0 &&
    patientGender !== '' &&
    patientGender !== 'Unspecified'
  );

  const handleStartAnalysis = async () => {
    setFormError(null);
    if (!patientName.trim()) {
      setFormError('Patient Name is required before analyzing the scan.');
      return;
    }
    if (!patientAge.trim() || Number(patientAge) <= 0) {
      setFormError('Valid Patient Age is required before analyzing the scan.');
      return;
    }
    if (!patientGender || patientGender === 'Unspecified') {
      setFormError('Patient Gender selection is required before analyzing the scan.');
      return;
    }
    if (!compressedFile && !file) {
      setFormError('Please select or drag & drop an MRI scan image.');
      return;
    }

    const targetFile = compressedFile || file!;
    
    try {
      await analyzeMRI(targetFile, {
        name: patientName.trim(),
        age: Number(patientAge),
        gender: patientGender,
      });
      navigate('/prediction');
    } catch (err: any) {
      setFormError(err.message || 'AI Model detection error: The uploaded file is not a valid Brain MRI scan image.');
    }
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
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Patient Metadata
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-500">
                REQUIRED
              </span>
            </div>

            {/* Patient Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Patient Name</span>
                <span className="text-rose-500 text-xs font-bold">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            {/* Age & Gender Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Age</span>
                  <span className="text-rose-500 text-xs font-bold">*</span>
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => {
                    setPatientAge(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. 45"
                  min="1"
                  max="120"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Gender</span>
                  <span className="text-rose-500 text-xs font-bold">*</span>
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => {
                    setPatientGender(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">Select Gender</option>
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

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {!isFormValid && file && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Please complete Patient Name, Age, and Gender above to unlock MRI analysis.</span>
              </div>
            )}

            <button
              onClick={handleStartAnalysis}
              disabled={!isFormValid || isAnalyzing}
              className={`w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 transition-all ${
                isFormValid && !isAnalyzing
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
