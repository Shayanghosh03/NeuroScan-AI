import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Which MRI formats and file sizes are supported?',
      answer: 'NeuroScan AI supports standard image formats including PNG, JPG, and JPEG files up to 10MB. Images are automatically compressed client-side before submission for rapid processing.',
    },
    {
      question: 'What neural network architecture powers the model backend?',
      answer: 'The system uses a fine-tuned VGG16 Convolutional Neural Network (CNN) architecture trained on benchmarked axial brain MRI datasets for 4-class classification: Glioma, Meningioma, Pituitary, and No Tumor.',
    },
    {
      question: 'How does the GradCAM heatmap overlay work?',
      answer: 'GradCAM (Gradient-weighted Class Activation Mapping) calculates gradients of the score for the predicted class with respect to the feature maps of the final convolutional layer, visually highlighting regions of Interest.',
    },
    {
      question: 'Is patient data encrypted and stored securely?',
      answer: 'Yes. All image upload transactions use secure HTTPS channels, and prediction records are accessible only within your authenticated session or registered radiologist profile.',
    },
    {
      question: 'Can I export predictions as printable medical reports?',
      answer: 'Absolutely. Every prediction result provides a single-click "Download PDF" and "Print Report" action formatted according to clinical radiology reporting standards.',
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-base hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
