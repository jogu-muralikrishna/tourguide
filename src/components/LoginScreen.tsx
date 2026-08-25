import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles, Building2, Sun, Moon, Laptop, CheckCircle2 } from 'lucide-react';
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

  const fillDemoAccount = (demoEmail: string, pass: string) => {
    setEmail(demoEmail);
    setPassword(pass);
    setIsRegisterMode(false);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden transition-colors">
      
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            TG
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              TourGuide <span className="text-sky-500">AI</span>
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">Personal Travel Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Selector */}
          <div className="flex items-center bg-[var(--bg-surface-elevated)] p-0.5 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'light' ? 'bg-[var(--bg-surface)] text-amber-500 shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-[var(--bg-surface)] text-sky-400 shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'system' ? 'bg-[var(--bg-surface)] text-indigo-500 shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onRequestAdmin}
            className="ui-btn-secondary py-1.5 px-3 text-xs"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Admin Access</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md w-full mx-auto my-auto z-10 py-4">
        <div className="ui-card p-6 sm:p-8 shadow-2xl relative border-[var(--border-color)]">
          
          {/* Title Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI Travel Copilot</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1 tracking-tight">
              {isRegisterMode ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-[var(--text-muted)] text-xs sm:text-sm font-normal">
              {isRegisterMode
                ? 'Join TourGuide AI to plan custom itineraries and trips.'
                : 'Sign in to access your saved trips and travel assistant.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] mb-6 text-xs">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-semibold transition-all cursor-pointer text-center ${
                !isRegisterMode
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
              className={`py-2 rounded-lg font-semibold transition-all cursor-pointer text-center ${
                isRegisterMode
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aarav.sharma@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ui-input w-full pl-10 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ui-input w-full pl-10 text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="ui-btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="ui-input w-full pl-10 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="e.g. traveler@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ui-input w-full pl-10 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ui-input w-full pl-10 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ui-input w-full pl-10 text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="ui-btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider mt-2"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create My Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Helper */}
          <div className="mt-5 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            <div className="text-[10px] uppercase font-semibold text-sky-500 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Quick Demo Account</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
              <span className="font-mono-tech text-[var(--text-primary)] font-medium">aarav.sharma@example.com</span>
              <button
                type="button"
                onClick={() => fillDemoAccount('aarav.sharma@example.com', 'Travel@2026')}
                className="text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
              >
                Autofill
              </button>
            </div>
          </div>

          {/* Security badge */}
          <div className="mt-5 pt-3 border-t border-[var(--border-color)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure SSL encrypted connection</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-[var(--text-muted)] z-10 py-2">
        © 2026 TourGuide AI — Smart Travel Platform
      </footer>
    </div>
  );
};
