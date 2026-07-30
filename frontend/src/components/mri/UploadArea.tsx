import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, X, AlertCircle, RefreshCw } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { formatBytes } from '../../utils/formatters';

interface UploadAreaProps {
  onFileSelected: (file: File, compressedFile: File) => void;
  isAnalyzing: boolean;
  onCancel?: () => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelected, isAnalyzing, onCancel }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid format. Please select a PNG, JPG, or JPEG brain MRI image.');
      return;
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds maximum limit of 10MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Compress image client side
    try {
      const compressed = await compressImage(file);
      setCompressedFile(compressed);
      onFileSelected(file, compressed);
    } catch (err) {
      setCompressedFile(file);
      onFileSelected(file, file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setCompressedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onCancel) onCancel();
  };

  return (
    <div className="space-y-6">
      
      {/* Drag & Drop File Zone */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 hover:border-brand-400 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl blue-gradient-btn flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Drag & Drop MRI Scan Here
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            or <span className="text-brand-600 dark:text-brand-400 font-semibold underline">browse files</span> from your computer
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
            <span>Supported: PNG, JPG, JPEG</span>
            <span>•</span>
            <span>Maximum Size: 10MB</span>
          </div>
        </div>
      ) : (
        /* Selected Image Preview Box */
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-slate-400">
                  Original: {formatBytes(selectedFile.size)}
                  {compressedFile && compressedFile.size !== selectedFile.size && (
                    <span className="text-emerald-500 font-medium ml-1">
                      (Compressed: {formatBytes(compressedFile.size)})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {!isAnalyzing && (
              <button
                onClick={handleRemove}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Remove File"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Preview Image Visualizer */}
          {previewUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center max-h-80">
              <img
                src={previewUrl}
                alt="MRI Scan Preview"
                className="max-h-80 w-auto object-contain"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
                  <div className="w-12 h-12 rounded-2xl blue-gradient-btn flex items-center justify-center animate-spin">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold animate-pulse">Running VGG16 Neural Network Classification...</p>
                  <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-brand-500 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

    </div>
  );
};
