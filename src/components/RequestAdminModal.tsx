import React, { useState } from 'react';
import { Building2, X, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { submitAdminRequestApi } from '../services/api';

interface RequestAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestAdminModal: React.FC<RequestAdminModalProps> = ({ isOpen, onClose }) => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState<'HOTEL_ADMIN' | 'TRAVEL_ADMIN'>('HOTEL_ADMIN');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !ownerName || !phone || !email || !address) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitAdminRequestApi({
        businessName,
        ownerName,
        phone,
        email,
        address,
        businessType,
        notes,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setBusinessName('');
    setOwnerName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div 
      id="request-admin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="request-admin-modal-card"
        className="w-full max-w-lg bg-[#0D0D12] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-white relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Partner / Admin Registration
              </h3>
              <p className="text-xs text-zinc-400 font-mono-tech">
                For Hotel Owners & Travel Fleet Agencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-request-admin-btn"
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold font-serif-luxury text-white">
              Application Submitted Successfully!
            </h4>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Thank you for partnering with TOURGUIDE AI. Our team will review your business details and activate your Sub-Admin account credentials shortly.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B89628] text-black font-bold font-mono-tech text-xs tracking-wider uppercase transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono-tech">
                {errorMsg}
              </div>
            )}

            {/* Business Type */}
            <div>
              <label className="block text-xs font-mono-tech text-[#D4AF37] mb-2 uppercase">
                Business Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBusinessType('HOTEL_ADMIN')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    businessType === 'HOTEL_ADMIN'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-sm">Hotel / Resort</div>
                  <div className="text-[11px] text-zinc-400">Receive guest stays</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBusinessType('TRAVEL_ADMIN')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    businessType === 'TRAVEL_ADMIN'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-sm">Travel Agency</div>
                  <div className="text-[11px] text-zinc-400">Manage car rides</div>
                </button>
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                Hotel or Business Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Royal Grand Hotel / City Fleet Agency"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Owner Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                Official Business Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@yourhotel.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                Business Address & City *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Plot 24, Outer Ring Road, Hyderabad"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Number of rooms, fleet vehicles, special services..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-request-admin-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5C158] hover:to-[#B89628] text-black font-bold font-mono-tech text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Partnership Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
