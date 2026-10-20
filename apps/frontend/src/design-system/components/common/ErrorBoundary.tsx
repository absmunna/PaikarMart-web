import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Copy, Check, RotateCcw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    console.error('Unhandled runtime error captured by ErrorBoundary:', error, errorInfo);
  }

  public resetErrorBoundary = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    this.resetErrorBoundary();
    window.location.href = '/';
  };

  private handleCopyError = (): void => {
    const { error, errorInfo } = this.state;
    const textToCopy = `Error: ${error?.message || 'Unknown error'}\n\nStack:\n${error?.stack || ''}\n\nComponent Stack:\n${errorInfo?.componentStack || ''}`;
    
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      });
    }
  };

  private toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render(): ReactNode {
    const { hasError, error, errorInfo, showDetails, copied } = this.state;
    const { children, fallback, fallbackRender } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback;
      }

      if (fallbackRender) {
        return fallbackRender({
          error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      return (
        <div className="min-h-screen w-full bg-[var(--pm-bg)] text-[var(--pm-text)] flex items-center justify-center p-4 sm:p-6 select-none">
          <div className="w-full max-w-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Warning Icon Banner */}
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
            </div>

            {/* Error Message & Editorial Intro */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-rose-400">
                সিস্টেম ত্রুটি (Runtime Error)
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                দুঃখিত, অপ্রত্যাশিত একটি সমস্যা হয়েছে
              </h1>
              <p className="text-xs sm:text-sm text-[var(--pm-text-muted)] leading-relaxed max-w-md mx-auto">
                পৃষ্ঠাটি লোড করার সময় অ্যাপ্লিকেশনে একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। নিচে দেওয়া বাটনগুলোর মাধ্যমে আবার চেষ্টা করতে পারেন।
              </p>
            </div>

            {/* Summary Message Snippet */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-left">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                এরর মেসেজ:
              </div>
              <p className="text-xs font-mono text-rose-300 break-words leading-snug">
                {error.message || 'Unknown runtime error occurred.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={this.resetErrorBoundary}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-[var(--pm-accent)]/20 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>আবার চেষ্টা করুন</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-white/10 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>হোমে যান</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-white/5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>রিলোড</span>
              </button>
            </div>

            {/* Collapsible Technical Diagnostics */}
            <div className="pt-2 border-t border-[var(--pm-border)]/60">
              <button
                type="button"
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between py-1 text-[11px] font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <span>কারিগরি বিবরণ (Technical Diagnostics)</span>
                {showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showDetails && (
                <div className="mt-2.5 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Component Stack Trace
                    </span>
                    <button
                      type="button"
                      onClick={this.handleCopyError}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-3 bg-black/60 rounded-xl text-[10px] font-mono text-zinc-400 overflow-x-auto max-h-40 leading-relaxed border border-white/5">
                    {error.stack || errorInfo?.componentStack || 'No stack trace available.'}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
