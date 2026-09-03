import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Building2, Sun, Moon, Laptop, Compass } from 'lucide-react';
import { loginApi, registerApi, AuthRoleUser } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthRoleUser, token: string) => void;
  onRequestAdmin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onRequestAdmin }) => {
  const { theme, setTheme } = useTheme();
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
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMsg('Please fill in all details (Name, Email, Phone, and Password).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
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
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden transition-colors">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gold-gradient-bg text-black flex items-center justify-center font-extrabold text-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#D4AF37]">
            <Compass className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-serif-luxury">
              TourGuide <span className="gold-gradient-text font-black">AI</span>
            </h1>
            <p className="text-xs text-[#F3E5AB] font-mono-tech">Personal Travel Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Partner Registration Modal Opener */}
          <button
            onClick={onRequestAdmin}
            id="partner-request-header-btn"
            className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Partner Registration</span>
            <span className="sm:hidden">Partner</span>
          </button>

          {/* Back to App / Guest Option */}
          <button
            onClick={() => {
              const guestUser: AuthRoleUser = {
                id: 'GUEST-001',
                name: 'Guest Traveler',
                email: 'guest@tourguide.com',
                phone: '+91 99999 99999',
                role: 'USER',
              };
              onLoginSuccess(guestUser, 'guest@tourguide.com');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#14141B] hover:bg-[#20202A] text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>← Back to Previous Page</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full my-auto py-8 z-10">
        
        {/* Card Container */}
        <div className="ui-card-luxury p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.9)] border border-[#D4AF37]/30">
          
          {/* Welcome Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold mb-3 shadow-[0_0_15px_rgba(212,175,55,0.15)] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Smart AI Travel Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif-luxury">
              {isRegisterMode ? 'Create Your Account' : 'Sign In to Your Hub'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {isRegisterMode
                ? 'Register to plan and book custom highway journeys'
                : 'Access your trips, bookings, and custom itineraries'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#0a0a0f] rounded-xl border border-[#D4AF37]/20 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                !isRegisterMode
                  ? 'gold-gradient-bg text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                isRegisterMode
                  ? 'gold-gradient-bg text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ammu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium bg-[#0a0a0f] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium bg-[#0a0a0f] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="ui-btn-primary w-full py-3.5 text-xs font-extrabold uppercase tracking-wider mt-2"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ammu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium bg-[#0a0a0f] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ammu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium bg-[#0a0a0f] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium bg-[#0a0a0f] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium bg-[#0a0a0f] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="ui-btn-primary w-full py-3.5 text-xs font-extrabold uppercase tracking-wider mt-2"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create My Account</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security badge */}
          <div className="mt-5 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Secure SSL encrypted connection</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-zinc-400 z-10 py-2">
        © 2026 TourGuide AI — Luxury Travel Platform
      </footer>
    </div>
  );
};
