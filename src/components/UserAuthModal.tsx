import React, { useState } from 'react';
import { User, Shield, Mail, Check, LogOut, Sparkles, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserRole } from '../types';
import { AuthService } from '../services/authService';

interface UserAuthModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onUserChange: (user: UserProfile | null) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUserChange,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid communications vector (email).');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      let user: UserProfile;
      if (isSignUp) {
        user = await AuthService.signUp(name, email, role);
      } else {
        user = await AuthService.login(email);
      }
      onUserChange(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication sequence failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    onUserChange(null);
    onClose();
  };

  const handleQuickDemoUser = async (demoEmail: string) => {
    setIsLoading(true);
    try {
      const user = await AuthService.login(demoEmail);
      onUserChange(user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#0c0c14] border border-amber-500/30 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-zinc-900 via-[#141422] to-zinc-900 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-base text-zinc-100">
                  {currentUser && !currentUser.isGuest ? 'PASSENGER PROFILE' : 'IDENTITY AUTHORIZATION'}
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono-tactical">
                  TourGuide VIP Security Layer
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-left">
            {currentUser && !currentUser.isGuest ? (
              /* Logged In View */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tactical text-amber-400 font-bold">
                      {currentUser.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono-tactical bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono-tactical flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" /> {currentUser.email}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono-tactical">
                    Member Since: {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/40 border border-zinc-700 text-xs font-mono-tactical text-zinc-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Relinquish Identity Session (Sign Out)
                  </button>
                </div>
              </div>
            ) : (
              /* Auth Form View */
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono-tactical">
                    {error}
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label className="block text-[11px] font-mono-tactical text-zinc-400 mb-1">
                      FULL LEGAL / DIPLOMATIC NAME
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lord Alexander Sterling"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono-tactical text-zinc-400 mb-1">
                    COMMUNICATIONS VECTOR (EMAIL)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@luxury-voyages.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-[11px] font-mono-tactical text-zinc-400 mb-1">
                      CLEARANCE ROLE
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="USER">VIP Traveler (Standard)</option>
                      <option value="ADMIN">Command Chief (Admin Clearance)</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-serif-luxury font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isLoading ? 'Synchronizing...' : isSignUp ? 'Create VIP Traveler Pass' : 'Authorize Identity Sign In'}
                </button>

                <div className="pt-2 flex items-center justify-between text-xs font-mono-tactical">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    {isSignUp ? 'Already registered? Sign In' : 'New VIP traveler? Register here'}
                  </button>
                </div>

                {/* Quick 1-Click Demo Profiles */}
                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <span className="block text-[10px] font-mono-tactical text-zinc-500 uppercase tracking-wider">
                    Quick 1-Click Test Credentials:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoUser('alexander.sterling@monaco-voyages.com')}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono-tactical text-zinc-300 hover:text-amber-300 text-left cursor-pointer"
                    >
                      ★ Alexander Sterling (VIP)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoUser('admin@tourguide.ai')}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono-tactical text-zinc-300 hover:text-amber-300 text-left cursor-pointer"
                    >
                      ⚡ Chief Dispatcher (Admin)
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
