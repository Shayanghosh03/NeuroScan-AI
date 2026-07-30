import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import brainMriImage from '../../assets/brain-mri.png';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Animated Background Shapes & Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-400/10 blur-[90px] rounded-full pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-500/30 text-xs font-semibold text-brand-600 dark:text-brand-400 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>VGG16 Deep Learning Convolutional Neural Network</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
            >
              AI Powered <br />
              <span className="blue-gradient-text">Brain Tumor Detection</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Upload MRI scans and receive AI-powered predictions within seconds. Advanced multi-class segmentation for Glioma, Meningioma, Pituitary, and Healthy tissues.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/upload"
                className="w-full sm:w-auto blue-gradient-btn px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 group"
              >
                <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Analyze MRI</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 glass-card border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-center transition-all"
              >
                Learn More
              </a>
            </motion.div>

            {/* Key Value Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>98.72% Validation Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Inference (~1.2s)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
                <span>HIPAA Ready Standards</span>
              </div>
            </motion.div>

          </div>

          {/* Right Graphic / Interactive Floating AI Brain Badge (Matching Screenshot 1) */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-10 min-h-[420px] select-none">
            
            {/* Outer Glow Halo Pulse */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-brand-500/30 via-cyan-400/30 to-indigo-500/20 blur-3xl animate-pulse pointer-events-none" />

            {/* Main Central Circular Brain Logo Sphere */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative z-10 w-56 h-56 rounded-full bg-gradient-to-tr from-blue-600 via-brand-500 to-cyan-400 p-1 shadow-[0_20px_50px_rgba(12,141,233,0.35)] flex items-center justify-center animate-float group cursor-pointer"
            >
              {/* Inner Sphere Container */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 via-brand-500 to-cyan-500 flex items-center justify-center relative overflow-hidden shadow-inner">
                
                {/* Dynamic Synapse Pulse Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow" />
                <div className="absolute inset-3 rounded-full border border-cyan-300/30 animate-ping" />

                {/* Central App Brain Icon */}
                <Brain className="w-24 h-24 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-110" />
              </div>
            </motion.div>

            {/* Floating Card 1: Top Right - Live Anomaly Checks */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-4 right-2 sm:right-6 z-20 glass-card bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-1 animate-float"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live anomaly checks</span>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white pl-4">3.2s avg</p>
            </motion.div>

            {/* Floating Card 2: Bottom Left - Secure Handoff Encrypted */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-6 left-2 sm:left-6 z-20 glass-card bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-1 animate-float"
              style={{ animationDelay: '1.2s' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Secure handoff</span>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white pl-4">Encrypted</p>
            </motion.div>

            {/* Floating Card 3: Top Left - VGG16 Benchmark */}
            <motion.div
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-6 left-4 z-20 glass-card bg-white/95 dark:bg-slate-900/95 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xl hidden sm:flex items-center gap-3 animate-float"
              style={{ animationDelay: '1.8s' }}
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">VGG16 Accuracy</span>
                <span className="text-xs font-black text-brand-600 dark:text-brand-400">98.72% Validated</span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
