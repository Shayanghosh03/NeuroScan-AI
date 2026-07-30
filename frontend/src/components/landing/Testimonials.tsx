import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Elizabeth Warren',
      role: 'Chief of Neuroradiology, Johns Hopkins affiliate',
      comment: 'NeuroScan AI has drastically cut our initial MRI screening turnaround time. The GradCAM visualizer offers clear interpretability into the neural model decision process.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Dr. Michael Chang',
      role: 'Consultant Neurosurgeon, St. Jude Medical',
      comment: 'The multi-class precision between Glioma and Meningioma helps prioritize urgent cases before contrast-enhanced scans come through.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Dr. Aris Thorne',
      role: 'Medical AI Researcher & Radiologist',
      comment: 'Integrating VGG16 with seamless client-side preprocessing makes NeuroScan AI one of the cleanest medical web applications I have evaluated.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=250',
    },
  ];

  return (
    <section className="py-20 bg-slate-100/60 dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400">
            Clinical Trust
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Endorsed by Healthcare Professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item) => (
            <div
              key={item.name}
              className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 mt-6">
                <img
                  src={item.avatar}
                  alt={item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250';
                  }}
                  className="w-11 h-11 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
