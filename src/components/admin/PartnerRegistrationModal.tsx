import React, { useState } from 'react';
import { Building2, ShieldCheck, KeyRound, CheckCircle2, AlertCircle, Sparkles, X, User, Phone, MapPin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminUser } from '../../types/admin';
import { AdminService } from '../../services/adminService';

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: AdminUser) => void;
}

export const PartnerRegistrationModal: React.FC<PartnerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [targetRole, setTargetRole] = useState<'HOTEL_ADMIN' | 'AGENCY_ADMIN'>('HOTEL_ADMIN');
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [businessLicenseNumber, setBusinessLicenseNumber] = useState('');
  const [taxId, setTaxId] = useState('');

  const [isVerifyingGrant, setIsVerifyingGrant] = useState(false);
  const [grantVerified, setGrantVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsVerifyingGrant(true);

    try {
      const grant = AdminService.validatePartnerCredential(email, tempPassword, targetRole);
      if (!grant) {
        setErrorMessage('Invalid or unauthorized registration credentials. Admin authorization is required to register.');
        setGrantVerified(false);
      } else {
        setGrantVerified(true);
        if (!partnerName) setPartnerName(grant.partnerName);
        setSuccessMessage(`Admin Pre-Authorization Passcode Verified! Issued for ${grant.partnerName}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to verify pre-authorization credentials.');
    } finally {
      setIsVerifyingGrant(false);
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { user } = AdminService.registerPartnerWithPreAuth(email, tempPassword, targetRole, {
        name: partnerName,
        phone,
        address,
        city,
        contactPerson,
        businessLicenseNumber,
        taxId,
      });

      setSuccessMessage('Partner Registration Successful! Logging into dashboard...');
      setTimeout(() => {
        onSuccessLogin(user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please verify credentials.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Partner Registration Portal
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                    Admin Passcode Required
                  </span>
                </h2>
                <p className="text-sm text-slate-400">
                  Register your Hotel or Travel Agency using Admin Pre-Authorized Passcode
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Alert Messages */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <div>{successMessage}</div>
              </div>
            )}

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTargetRole('HOTEL_ADMIN');
                  setGrantVerified(false);
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  targetRole === 'HOTEL_ADMIN'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Hotel Owner Portal
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetRole('AGENCY_ADMIN');
                  setGrantVerified(false);
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  targetRole === 'AGENCY_ADMIN'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                Travel Agency Portal
              </button>
            </div>

            {/* Step 1: Admin Passcode Verification Form */}
            {!grantVerified ? (
              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
                  🔒 <strong>Startup Security Requirement:</strong> Only hotels and travel agencies with an active passcode issued by the Master Platform Admin can complete registration.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Authorized Partner Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={targetRole === 'HOTEL_ADMIN' ? 'hotel.test@grandresort.com' : 'agency.test@royaltransit.com'}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Admin Pre-Authorization Passcode / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder={targetRole === 'HOTEL_ADMIN' ? 'HotelPass2026!' : 'AgencyPass2026!'}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingGrant}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {isVerifyingGrant ? 'Verifying Admin Passcode...' : 'Verify Admin Passcode'}
                </button>
              </form>
            ) : (
              /* Step 2: Complete Partner Profile Details */
              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Business / Property Name
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="e.g. Grand Goa Beachfront Resort"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Contact Person / Lead Officer
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Carlos D'Souza"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 11223"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      City / Destination
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Goa, Hyderabad"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Business License Number
                    </label>
                    <input
                      type="text"
                      value={businessLicenseNumber}
                      onChange={(e) => setBusinessLicenseNumber(e.target.value)}
                      placeholder="e.g. LIC-HTL-88219"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Tax ID / GSTIN
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="e.g. 36AAACG1234F1Z5"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Full Property / Business Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Candolim Beach Road, North Goa"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGrantVerified(false)}
                    className="w-1/3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Complete Partner Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
