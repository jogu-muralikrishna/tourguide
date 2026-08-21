import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full bg-[#0A0A0E] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(212,175,55,0.25)] text-center space-y-6">
            
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono uppercase tracking-wider font-semibold">
                System Recovery Control
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-3">
                TOURGUIDE AI Session Error
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                An unexpected application state occurred. You can safely reload the page or reset cached session state below.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-left font-mono text-xs text-rose-300 overflow-x-auto max-h-32">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-1">Diagnostic Output:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Clear Cache & Reset</span>
              </button>
            </div>

            <div className="text-[11px] text-zinc-500 font-mono">
              TOURGUIDE AI • Highway Travel System • Protected State
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
