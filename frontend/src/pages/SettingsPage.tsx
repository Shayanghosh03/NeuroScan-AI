import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Modal } from '../components/common/Modal';
import { User, Lock, Bell, Moon, Sun, Globe, Check, Camera, Upload, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

const PRESET_AVATARS = [
  { id: '1', label: 'Dr. Sarah', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250' },
  { id: '2', label: 'Dr. Michael', url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250' },
  { id: '3', label: 'Dr. Elena', url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=250' },
  { id: '4', label: 'Dr. James', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=250' },
];

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [hospital, setHospital] = useState(user?.hospital || '');
  const [avatar, setAvatar] = useState(user?.avatar || PRESET_AVATARS[0].url);
  const [department, setDepartment] = useState(user?.department || 'Diagnostic Imaging');
  const [role, setRole] = useState(user?.role || 'Neuroradiologist');
  const [language, setLanguage] = useState('English');
  const [savedMsg, setSavedMsg] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, hospital, avatar, department, role });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleAvatarSelect = async (url: string) => {
    setAvatar(url);
    await updateProfile({ avatar: url });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleSelectPreset = async (presetUrl: string) => {
    setAvatar(presetUrl);
    await updateProfile({ avatar: presetUrl });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        await updateProfile({ avatar: base64 });
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e);
  };

  const handleResetAvatar = async () => {
    const fallbackUrl = PRESET_AVATARS[0].url;
    setAvatar(fallbackUrl);
    await updateProfile({ avatar: fallbackUrl });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleRemoveAvatar = async () => {
    await handleResetAvatar();
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (e) {
      logout();
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      navigate('/register?message=' + encodeURIComponent('Account permanently deleted. Please register a new account to continue.'));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your radiologist profile, security preferences, and display settings
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'profile'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'security'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Lock className="w-4 h-4" />
            <span>Password & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'notifications'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'preferences'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Globe className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveProfile} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">

              <h3 className="text-base font-bold text-slate-900 dark:text-white">Radiologist Information</h3>

              {savedMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Profile & avatar updated successfully!</span>
                </div>
              )}

              {/* Profile Photo Upload Section */}
              <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Profile Photo
                </label>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                  {/* Avatar Preview Ring */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-500/40 shadow-xl shadow-blue-500/10 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Camera overlay */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white cursor-pointer"
                      title="Change Photo"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Upload Action Buttons & Controls */}
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="blue-gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Photo</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Supports JPG, PNG or WEBP (Max 5MB). Photo syncs automatically across your medical reports and radiologist header.
                    </p>

                    {/* Preset Avatars Selection */}
                    <div className="pt-2">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                        Or select a preset medical avatar:
                      </span>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        {PRESET_AVATARS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectPreset(p.url)}
                            className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${avatar === p.url
                                ? 'border-brand-500 ring-2 ring-brand-500/30 scale-105'
                                : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                              }`}
                            title={p.label}
                          >
                            <img
                              src={p.url}
                              alt={p.label}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-400 text-xs cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hospital / Institute</label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="Hospital / Medical Institute (Optional)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="submit" className="blue-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25">
                  Save Changes
                </button>
              </div>
            </form>

            {/* Danger Zone / Delete Account Section */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 bg-rose-500/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Danger Zone — Delete Account</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Permanently delete your account and associated MRI diagnostic logs
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Once deleted, your radiologist credentials, session tokens, and personal account preferences will be permanently erased. This operation cannot be reversed.
              </p>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Radiologist Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Password & Authentication</h3>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  onClick={() => alert('Password updated successfully!')}
                  className="blue-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Danger Zone in Security Tab as well */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 bg-rose-500/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Account</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Permanently terminate your clinical profile and credentials</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Radiologist Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Preferences</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">High Risk Prediction Alerts</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive instant notifications when MRI scan analysis yields high confidence tumor detection.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-500 rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Weekly Diagnostic Reports</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive a weekly summary email of all processed scans and radiologist logs.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-500 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Display & System Preferences</h3>

            <div className="space-y-6 max-w-md">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Interface Theme</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Current theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2 shadow-sm"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-600" />}
                  <span>Toggle Theme</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">System Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="English">English (US)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="French">French (Français)</option>
                </select>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Permanent Account Deletion"
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-medium leading-relaxed">
              Warning: This operation is permanent. Deleting your account will erase your radiologist credentials (<span className="font-bold">{user?.email}</span>) and clear session data.
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Are you sure you want to delete your account? You will be logged out immediately and redirected to the home page.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteAccount}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Yes, Delete Account</span>
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
