import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  Car,
  Users,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AdminService } from '../../services/adminService';
import { AdminSession } from '../../types/admin';

interface AdminLoginProps {
  onLoginSuccess: (session: AdminSession) => void;
  onBackToApp: () => void;
  onOpenPartnerRegister?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToApp, onOpenPartnerRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = AdminService.login(email, password);
      setIsLoading(false);

      if (res.success && res.session) {
        onLoginSuccess(res.session);
      } else {
        setErrorMessage(res.error || 'Incorrect email or password. Please try again.');
      }
    }, 200);
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-zinc-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenPartnerRegister && (
            <button
              onClick={onOpenPartnerRegister}
              className="px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Partner Registration (Admin Passcode)</span>
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Secure Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f0f18] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Admin & Partner Login
            </h1>
            <p className="text-xs text-zinc-400">
              Enter your authorized email and password to open your dashboard
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs flex items-center gap-2.5 shadow-sm"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@tourguide.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* New Partner Pre-Auth Registration Callout */}
          {onOpenPartnerRegister && (
            <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs text-amber-300 block mb-1 font-medium">New Hotel Owner or Travel Agency?</span>
              <button
                type="button"
                onClick={onOpenPartnerRegister}
                className="text-xs text-white hover:text-amber-300 underline font-semibold transition-colors"
              >
                Register Account with Admin Pre-Auth Passcode →
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-zinc-500">
        TOURGUIDE AI • Secure Startup Multi-Tenant Management Platform
      </div>
    </div>
  );
};
