import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { loginApi, registerApi, AuthRoleUser } from '../services/api';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthRoleUser, token: string) => void;
  onRequestAdmin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onRequestAdmin }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginApi(email.trim(), password);
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMsg('Please fill in all details (Full Name, Email, Phone, and Password).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await registerApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Account creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3E5AB] to-[#8C6D1F] p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <div className="w-full h-full bg-[#09090C] rounded-[11px] flex items-center justify-center">
              <span className="font-serif-luxury font-bold text-[#D4AF37] text-lg">TG</span>
            </div>
          </div>
          <div>
            <h1 className="font-serif-luxury text-xl font-bold tracking-wider gold-gradient-text">TOURGUIDE AI</h1>
            <span className="text-[10px] uppercase font-mono-tech tracking-widest text-zinc-500">Real-Time Travel System</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono-tech text-zinc-400 hover:text-[#D4AF37] transition-colors"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Request Admin Access</span>
        </button>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Highway & Travel Platform</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-1.5">
              Welcome to <span className="gold-gradient-text">TOURGUIDE AI</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              {isRegisterMode ? 'Create your travel account in simple steps' : 'Please log in to start your journey'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#09090D] border border-zinc-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-mono-tech text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                !isRegisterMode
                  ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-mono-tech text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                isRegisterMode
                  ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs font-mono-tech flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-white placeholder-zinc-600 text-sm font-mono-tech focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-white placeholder-zinc-600 text-sm font-mono-tech focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1 font-semibold">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-white placeholder-zinc-600 text-sm font-mono-tech focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1 font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-white placeholder-zinc-600 text-sm font-mono-tech focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1 font-semibold">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-white placeholder-zinc-600 text-sm font-mono-tech focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-white placeholder-zinc-600 text-sm font-mono-tech focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security badge */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure bcrypt password encryption & isolated user tokens</span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] font-mono-tech text-zinc-400 z-10">
        © 2026 TOURGUIDE AI — Real-Time Highway & Travel System
      </div>
    </div>
  );
};
