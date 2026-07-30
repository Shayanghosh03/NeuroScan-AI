import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl blue-gradient-btn flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                NeuroScan <span className="blue-gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Clinical-grade deep learning solution powered by VGG16 Convolutional Neural Networks for fast, accurate brain tumor detection.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant Protocol Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home Landing</Link></li>
              <li><Link to="/upload" className="hover:text-white transition-colors">Analyze MRI Scan</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Radiologist Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">Prediction History</Link></li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">AI Stack & Research</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">VGG16 CNN Architecture</Link></li>
              <li><span className="text-slate-500">TensorFlow & Keras API</span></li>
              <li><span className="text-slate-500">GradCAM Heatmap Overlay</span></li>
              <li><span className="text-slate-500">Multi-class Classification</span></li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Medical Disclaimer</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              NeuroScan AI is designed to assist medical professionals in diagnostic screening. Predictions should be corroborated with certified clinical evaluation.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400 shrink-0" />
              <span>98.72% Validation Accuracy on MRI Datasets</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NeuroScan AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
