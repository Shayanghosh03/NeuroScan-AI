import React from 'react';
import { UploadCloud, Cpu, FileCheck2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Step 1: Upload MRI',
      description: 'Drag & drop high-resolution axial brain MRI DICOM/PNG/JPG files directly into our secure scanner.',
      icon: UploadCloud,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      step: '02',
      title: 'Step 2: AI Analysis',
      description: 'VGG16 Convolutional Neural Network evaluates feature maps and extracts tissue segmentations.',
      icon: Cpu,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      step: '03',
      title: 'Step 3: Prediction Result',
      description: 'Receive instant diagnostic breakdown, GradCAM attention maps, risk level, and printable PDF report.',
      icon: FileCheck2,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-100/70 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400">
            Streamlined Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How NeuroScan AI Works
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            From raw MRI upload to actionable neuroradiological decision support in three intuitive steps.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 relative group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-3xl font-black text-slate-300 dark:text-slate-800">
                  {item.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
