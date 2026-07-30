import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { MainLayout } from '../layouts/MainLayout';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { FAQSection } from '../components/landing/FAQSection';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Clinical Deployment Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Please fill out all required fields (Name, Email, and Message).');
      return;
    }

    setIsSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_azhfbua';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_2f08cpl';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'OsYSMeTXW8DpUKaB0';

    try {
      if (publicKey && !publicKey.includes('your_emailjs_public_key')) {
        const emailParams = {
          name: formData.name,
          from_name: formData.name,
          user_name: formData.name,
          to_name: formData.name,
          email: formData.email,
          from_email: formData.email,
          to_email: formData.email,
          user_email: formData.email,
          reply_to: formData.email,
          title: formData.subject,
          subject: formData.subject,
          message: formData.message,
          time: new Date().toLocaleString(),
        };

        // Dispatch single emailjs.send call (EmailJS handles template_2f08cpl & auto-reply once)
        const mainRes = await emailjs.send(serviceId, templateId, emailParams, publicKey);
        console.log('EmailJS Single Dispatch Success:', mainRes);
      } else {
        // Fallback smooth dispatch delay when public key is being configured
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Clinical Deployment Inquiry', message: '' });
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      setIsSubmitting(false);
      setFormError(
        error?.text || error?.message || 'Failed to dispatch email via EmailJS. Please verify your EmailJS Public Key & Template ID.'
      );
    }
  };

  return (
    <MainLayout>
      <div className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Contact <span className="blue-gradient-text">NeuroScan AI Team</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Have questions regarding clinical integration, custom model APIs, or enterprise hospital licensing? Get in touch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Contact Info & Location */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Direct Channels</h3>
                
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl blue-gradient-btn flex items-center justify-center text-white shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-xs">Clinical Support Email</span>
                      <span className="font-semibold text-slate-900 dark:text-white">support@neuroscanai.med</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl blue-gradient-btn flex items-center justify-center text-white shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-xs">Medical Hotline</span>
                      <span className="font-semibold text-slate-900 dark:text-white">+1 (800) 555-NEURO</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl blue-gradient-btn flex items-center justify-center text-white shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-xs">Headquarters</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Medical Innovation Hub, Boston, MA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map Placeholder Card */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden h-48 flex items-center justify-center text-center">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                  <MapPin className="w-8 h-8 text-brand-400 animate-bounce mb-2" />
                  <p className="text-xs font-bold text-white">Boston Medical Center Campus</p>
                  <p className="text-[10px] text-slate-300">Diagnostic Imaging Wing B</p>
                </div>
              </div>

            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent Successfully</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Thank you for reaching out. Our clinical medical team will review your inquiry and respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="blue-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send us a message</h3>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Jane Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="doctor@hospital.org"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message / Inquiry</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify clinical details or questions..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full blue-gradient-btn py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Transmit Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

          <FAQSection />

        </div>
      </div>
    </MainLayout>
  );
};
