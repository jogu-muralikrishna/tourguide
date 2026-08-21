import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ArrowRight, CheckCircle2, LogOut, KeyRound, ShieldCheck } from 'lucide-react';
import { AuthRoleUser, loginApi, registerApi } from '../services/api';
import { UserProfile } from '../types';

interface Step6LoginProps {
  currentUser: AuthRoleUser | null;
  onUserAuthenticated: (user: AuthRoleUser, token: string) => void;
  onLogout: () => void;
  onContinue: () => void;
  onGoBack: () => void;
}

export const Step6Login: React.FC<Step6LoginProps> = ({
  currentUser,
  onUserAuthenticated,
  onLogout,
  onContinue,
  onGoBack,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginApi(email.trim(), password);
      onUserAuthenticated(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setErrorMsg('Please fill in all fields.');
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
      onUserAuthenticated(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="step-6-login" className="py-12 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Step 6 of 9</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 6: <span className="gold-gradient-text">Your Account</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Log in or create a quick account so we can link your booking and generate your Registration Token ID.
          </p>
        </div>

        {/* If already logged in */}
        {currentUser ? (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/35 max-w-xl mx-auto text-center shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-fade-in mb-8">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold font-serif-luxury text-white mb-1">
              Logged in as {currentUser.name}
            </h3>
            <p className="text-xs font-mono-tech text-[#F3E5AB] mb-4">
              {currentUser.email} • {currentUser.phone}
            </p>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 max-w-sm mx-auto mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Account Verified & Active</span>
              </div>
              Your booking ticket and Token ID will be linked to this account.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono-tech flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out / Switch User</span>
              </button>

              <button
                type="button"
                id="step-6-continue-btn"
                onClick={onContinue}
                className="px-6 py-3 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] cursor-pointer"
              >
                <span>Continue to Step 7: Your Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Login or Register Form */
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/25 max-w-xl mx-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] mb-8">
            
            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-mono-tech uppercase font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-mono-tech uppercase font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Existing User Login
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono-tech mb-4">
                {errorMsg}
              </div>
            )}

            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">Mobile Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">Set Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono-tech mt-1 block">
                    Passwords are securely hashed with bcrypt. Never stored in plain text.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  id="auth-register-btn"
                  className="w-full py-3.5 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Creating Account...' : 'Create Account & Continue'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  id="auth-login-btn"
                  className="w-full py-3.5 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Logging in...' : 'Log In & Continue'}</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* Go Back Bar */}
        <div className="flex justify-start max-w-xl mx-auto">
          <button
            type="button"
            onClick={onGoBack}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 5: Route Map
          </button>
        </div>

      </div>
    </section>
  );
};
