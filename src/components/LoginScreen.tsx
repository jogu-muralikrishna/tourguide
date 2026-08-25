import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Building2, Sun, Moon, Laptop } from 'lucide-react';
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
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                theme === 'light' ? 'bg-sky-500 text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-sky-500 text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Theme"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                theme === 'system' ? 'bg-sky-500 text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>

          {/* Partner Registration Modal Opener */}
          <button
            onClick={onRequestAdmin}
            id="partner-request-header-btn"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Partner Registration</span>
            <span className="sm:hidden">Partner</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full my-auto py-8 z-10">
        
        {/* Card Container */}
        <div className="ui-card p-6 sm:p-8 shadow-xl">
          
          {/* Welcome Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart AI Travel Platform</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {isRegisterMode ? 'Create Your Account' : 'Sign In to Your Hub'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {isRegisterMode
                ? 'Register to plan and book custom highway journeys'
                : 'Access your trips, bookings, and custom itineraries'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-color)] mb-6 text-xs font-semibold">
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
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium"
                />
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
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. traveler@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ui-input w-full px-4 py-3 text-sm font-medium"
                />
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
