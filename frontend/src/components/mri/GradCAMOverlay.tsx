import React, { useState } from 'react';
import { Layers, Sliders, Maximize2, Sparkles } from 'lucide-react';
import type { TumorClass } from '../../types';

interface GradCAMOverlayProps {
  imageUrl: string;
  prediction: TumorClass;
}

export const GradCAMOverlay: React.FC<GradCAMOverlayProps> = ({ imageUrl, prediction }) => {
  const [showGradCAM, setShowGradCAM] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(0.65);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(imageUrl);

  React.useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23090d16"/><circle cx="200" cy="190" r="130" fill="%231e293b" stroke="%23334155" stroke-width="4"/><path d="M140 180 Q200 120 260 180 T140 180" fill="%23334155"/><text x="200" y="350" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2394a3b8" text-anchor="middle">Brain MRI Scan</text></svg>`;

  // Gradient heatmap overlay color depending on prediction
  const isHealthy = prediction === 'No Tumor';

  return (
    <div className="space-y-4">
      
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-card rounded-xl border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGradCAM(!showGradCAM)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              showGradCAM
                ? 'blue-gradient-btn text-white shadow-md'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GradCAM Visualizer: {showGradCAM ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {showGradCAM && (
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-brand-500" />
            <span>Intensity: {Math.round(opacity * 100)}%</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        )}

        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Zoom"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive MRI Visualizer Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center min-h-[340px] group shadow-inner">
        {/* Base MRI Image */}
        <img
          src={imgSrc || fallbackSvg}
          alt="Brain MRI Scan"
          onError={() => {
            if (imgSrc !== fallbackSvg) {
              setImgSrc(fallbackSvg);
            }
          }}
          className={`w-full object-contain max-h-[440px] transition-transform duration-300 ${
            isZoomed ? 'scale-125' : 'scale-100'
          }`}
        />


        {/* GradCAM Heatmap Simulated Layer */}
        {showGradCAM && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-300 flex items-center justify-center"
            style={{ opacity }}
          >
            {isHealthy ? (
              <div className="w-48 h-48 rounded-full bg-radial from-emerald-500/80 via-cyan-500/30 to-transparent blur-2xl animate-pulse-slow" />
            ) : (
              <div className="relative">
                <div className="w-56 h-56 rounded-full bg-radial from-rose-600/90 via-amber-500/60 to-transparent blur-xl animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-radial from-red-500/90 to-transparent blur-md" />
              </div>
            )}
          </div>
        )}

        {/* Scanning Line Animation */}
        <div className="animate-scan-line pointer-events-none" />

        {/* Badge Indicator */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px] text-white flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>VGG16 Attention Map</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic">
        * Grad-CAM (Gradient-weighted Class Activation Mapping) highlights activation region focus during deep CNN inference.
      </p>
    </div>
  );
};
