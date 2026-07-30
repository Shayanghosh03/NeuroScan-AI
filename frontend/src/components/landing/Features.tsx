import React from 'react';
import { Brain, Zap, Shield, Target, LayoutDashboard, History } from 'lucide-react';
import { motion } from 'framer-motion';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'AI Detection',
      description: 'Multi-class detection identifying Glioma, Meningioma, Pituitary tumors, and Healthy tissue scans.',
      icon: Brain,
    },
    {
      title: 'Fast Prediction',
      description: 'Sub-2-second inference pipeline optimized for high-throughput radiology workflows.',
      icon: Zap,
    },
    {
      title: 'Secure Upload',
      description: 'End-to-end encrypted payload transmission with automatic client-side image compression.',
      icon: Shield,
    },
    {
      title: 'High Accuracy',
      description: 'VGG16 architecture trained on benchmarked brain MRI datasets with 98.72% validation accuracy.',
      icon: Target,
    },
    {
      title: 'Medical Dashboard',
      description: 'Interactive analytics dashboard displaying monthly trends, confidence metrics, and scan statistics.',
      icon: LayoutDashboard,
    },
    {
      title: 'Prediction History',
      description: 'Searchable, filterable audit trail for past scans with PDF report export and print options.',
      icon: History,
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400">
            Platform Capabilities
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Modern Diagnostic Excellence
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Equipping neuro-radiologists and clinicians with state-of-the-art AI tooling.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-xl blue-gradient-btn flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
