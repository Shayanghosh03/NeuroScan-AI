import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Brain, Cpu, Database, ShieldCheck, Target, Heart, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutPage: React.FC = () => {
  const techStack = [
    { name: 'React 19 & Vite', role: 'Frontend UI Framework', icon: Brain, color: 'text-brand-500' },
    { name: 'VGG16 CNN Architecture', role: '16-layer Deep Neural Net for Feature Maps', icon: Cpu, color: 'text-indigo-500' },
    { name: 'TensorFlow & Keras API', role: 'Model Training & Tensor Inference Backend', icon: Layers, color: 'text-amber-500' },
    { name: 'Node.js & Express API', role: 'REST API & Payload Dispatcher', icon: ShieldCheck, color: 'text-emerald-500' },
    { name: 'MongoDB', role: 'Encrypted DICOM & Prediction Audit Storage', icon: Database, color: 'text-cyan-500' },
    { name: 'Tailwind CSS & Framer', role: 'Modern Glassmorphic Clinical UI', icon: Sparkles, color: 'text-rose-500' },
  ];

  return (
    <MainLayout>
      <div className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-brand-500/30 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <Brain className="w-4 h-4 text-brand-500" />
              <span>Diagnostic Innovation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              About <span className="blue-gradient-text">NeuroScan AI</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Empowering radiologists with instant, interpretable deep neural network predictions to detect brain tumors in axial magnetic resonance imaging (MRI) scans.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                To eliminate diagnostic delays in neuroradiology by providing accessible, clinical-grade artificial intelligence tools that accelerate brain lesion identification and multi-class classification.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A world where every medical facility—regardless of regional resources—has seamless access to diagnostic AI assist tools that reduce human error and improve patient health outcomes.
              </p>
            </motion.div>
          </div>

          {/* Technology Architecture Section */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Technology Stack Architecture
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                End-to-end framework powering NeuroScan AI from client canvas compression to deep tensor evaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-brand-500/40 transition-colors"
                >
                  <tech.icon className={`w-8 h-8 ${tech.color}`} />
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{tech.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tech.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Neural Model Metrics Summary */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 text-center space-y-6">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">VGG16 Neural Model Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <span className="text-3xl sm:text-4xl font-black blue-gradient-text">98.72%</span>
                <span className="text-xs font-semibold text-slate-400 block mt-1">Validation Accuracy</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black blue-gradient-text">4</span>
                <span className="text-xs font-semibold text-slate-400 block mt-1">Classification Classes</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black blue-gradient-text">~1.2s</span>
                <span className="text-xs font-semibold text-slate-400 block mt-1">Average Latency</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black blue-gradient-text">100%</span>
                <span className="text-xs font-semibold text-slate-400 block mt-1">Client Preprocessing</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};
