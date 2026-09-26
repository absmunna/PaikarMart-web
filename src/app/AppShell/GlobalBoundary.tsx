import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[GlobalBoundary] Caught boundary event:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--pm-bg)] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-10 rounded-[40px] bg-[var(--pm-surface)]/50 border border-white/5 backdrop-blur-2xl">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">
              System Anomaly Detected
            </h1>
            
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight leading-relaxed mb-10">
              The application encountered a critical integration failure. 
              Real-time synchronization has been suspended to prevent data corruption.
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={this.handleRetry}
                className="w-full h-14 bg-cyan-400 rounded-2xl flex items-center justify-center gap-3 text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-400/20"
              >
                <RefreshCw className="w-5 h-5" />
                Initialize Recovery
              </button>
              
              <button 
                onClick={this.handleGoHome}
                className="w-full h-14 bg-white/5 rounded-2xl flex items-center justify-center gap-3 text-zinc-500 font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <Home className="w-5 h-5" />
                Return to Command
              </button>
            </div>

            {import.meta.env.MODE !== 'production' && this.state.error && (
              <div className="mt-8 p-4 bg-black/40 rounded-2xl text-[10px] text-zinc-600 font-mono text-left overflow-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
