import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles, Building2, Sun, Moon, Laptop } from 'lucide-react';
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
      setErrorMsg('Please fill in all details.');
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
      setErrorMsg(err.message || 'Account creation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden transition-colors">
      
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            TG
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">TourGuide AI</h1>
            <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider">Smart Travel Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            <span>Admin Partner</span>
          </button>
        </div>
      </div>

      {/* Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="ui-card p-6 sm:p-8 shadow-2xl relative">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Travel Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">
              Welcome to <span className="text-sky-600 dark:text-sky-400">TourGuide AI</span>
            </h2>
            <p className="text-[var(--text-muted)] text-xs sm:text-sm">
              {isRegisterMode ? 'Create your travel account' : 'Sign in to start your journey'}
            </p>
          </div>

          {/* Mode Switch */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] mb-6 text-xs">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                !isRegisterMode
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
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
              className={`py-2 rounded-lg uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                isRegisterMode
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ui-input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ui-input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="ui-btn-primary w-full py-3 text-xs uppercase tracking-wider font-bold"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="ui-input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ui-input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ui-input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ui-input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="ui-btn-primary w-full py-3 text-xs uppercase tracking-wider font-bold"
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

          <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure password encryption</span>
          </div>

        </div>
      </div>

      <div className="text-center text-[11px] text-[var(--text-muted)] z-10">
        © 2026 TourGuide AI — Smart Travel Platform
      </div>
    </div>
  );
};
