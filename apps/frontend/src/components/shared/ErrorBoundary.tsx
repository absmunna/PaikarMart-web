import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--pm-danger-soft)] text-[var(--pm-danger)] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-[var(--pm-text)]">Something went wrong</h2>
            <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
              The application encountered an unexpected visual rendering error. Tap below to reload cleanly.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-left font-mono text-[10px] text-[var(--pm-danger)] overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
