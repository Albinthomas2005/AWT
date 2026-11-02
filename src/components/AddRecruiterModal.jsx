import React, { useState } from 'react';
import { UserCheck, X, Building2, Mail, Globe, Phone, Lock, ShieldCheck } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const AddRecruiterModal = ({ isOpen, onClose }) => {
  const { addRecruiterDirectly, showToast } = usePlacement();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Recruiter@123',
    companyName: '',
    website: 'https://',
    phone: '',
    industry: 'Technology & Enterprise Solutions',
    status: 'Approved'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Recruiter Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Corporate Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid corporate email';
    }
    if (!formData.companyName.trim()) errs.companyName = 'Company Name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone Number is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await addRecruiterDirectly(formData);
    if (res.success) {
      onClose();
      setFormData({
        name: '',
        email: '',
        password: 'Recruiter@123',
        companyName: '',
        website: 'https://',
        phone: '',
        industry: 'Technology & Enterprise Solutions',
        status: 'Approved'
      });
      setErrors({});
    } else {
      setErrors({ general: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-indigo-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-7 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  Add Corporate Recruiter
                </h3>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-300">
                  Officer Action
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Grant recruitment access to an authorized partner
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-4 text-sm sm:text-base">
          {errors.general && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 text-xs sm:text-sm">
                Recruiter Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Siddharth Sen"
                className={`w-full px-4 py-2.5 rounded-2xl border ${errors.name ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm`}
              />
              {errors.name && <span className="text-xs text-rose-500 font-semibold">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 text-xs sm:text-sm">
                Official Corporate Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. recruiter@google.com"
                className={`w-full px-4 py-2.5 rounded-2xl border ${errors.email ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm`}
              />
              {errors.email && <span className="text-xs text-rose-500 font-semibold">{errors.email}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 text-xs sm:text-sm">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Google India"
                className={`w-full px-4 py-2.5 rounded-2xl border ${errors.companyName ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm`}
              />
              {errors.companyName && <span className="text-xs text-rose-500 font-semibold">{errors.companyName}</span>}
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 text-xs sm:text-sm">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98111 22334"
                className={`w-full px-4 py-2.5 rounded-2xl border ${errors.phone ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm`}
              />
              {errors.phone && <span className="text-xs text-rose-500 font-semibold">{errors.phone}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 text-xs sm:text-sm">
                Company Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://careers.google.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 text-xs sm:text-sm">
                Temporary Password
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 text-xs sm:text-sm">
              Approval Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Approved"
                  checked={formData.status === 'Approved'}
                  onChange={() => setFormData({ ...formData, status: 'Approved' })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Approved & Active Immediately</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Pending"
                  checked={formData.status === 'Pending'}
                  onChange={() => setFormData({ ...formData, status: 'Pending' })}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Pending Review</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition-all"
            >
              Add Recruiter
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
