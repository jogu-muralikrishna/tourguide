import React, { useState } from 'react';
import { User, Phone, Mail, FileText, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { TravelerInfo } from '../types';

interface StepRegistrationProps {
  traveler: TravelerInfo;
  onUpdateTraveler: (traveler: TravelerInfo) => void;
  onContinue: () => void;
}

export const StepRegistration: React.FC<StepRegistrationProps> = ({
  traveler,
  onUpdateTraveler,
  onContinue,
}) => {
  const [formData, setFormData] = useState<TravelerInfo>(traveler);
  const [errors, setErrors] = useState<{ fullName?: string; contactPhone?: string; email?: string }>({});
  const [isSaved, setIsSaved] = useState(false);

  const validate = () => {
    const newErrors: { fullName?: string; contactPhone?: string; email?: string } = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact mobile number is required.';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'A valid email address is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onUpdateTraveler(formData);
    setIsSaved(true);
    onContinue();
  };

  return (
    <section
      id="registration"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 6 • Guest & Contact Information</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Guest <span className="text-amber-400">Details</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Please provide your contact details for instant reservation confirmation, chauffeur pickup coordination, and booking vouchers.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto bg-[#0a0a10]/95 border border-amber-500/30 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="reg-fullname" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Guest Full Name *</span>
              </label>
              <input
                id="reg-fullname"
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                placeholder="e.g., Aarav Sharma"
                className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm sm:text-base focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all shadow-inner"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs">{errors.fullName}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Mobile Number (with country code) *</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => {
                  setFormData({ ...formData, contactPhone: e.target.value });
                  if (errors.contactPhone) setErrors({ ...errors, contactPhone: undefined });
                }}
                placeholder="e.g., +91 98765 43210"
                className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all shadow-inner"
              />
              {errors.contactPhone && (
                <p className="text-red-400 text-xs">{errors.contactPhone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="reg-email" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Address (for Booking Voucher) *</span>
              </label>
              <input
                id="reg-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="e.g., traveler@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all shadow-inner"
              />
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Special Requests */}
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="reg-requests" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Special Requests & Dietary Preferences</span>
              </label>
              <textarea
                id="reg-requests"
                rows={3}
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="e.g., Extra luggage room, airport terminal pickup, vegetarian meals, high-floor room preference."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all shadow-inner resize-none"
              />
            </div>
          </div>

          {/* Security Badge */}
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-amber-500/20 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-300">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>256-Bit SSL Encrypted & Secure</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Privacy Protected</span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex justify-end pt-2">
            <button
              id="confirm-manifest-btn"
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continue to Review & Book</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
