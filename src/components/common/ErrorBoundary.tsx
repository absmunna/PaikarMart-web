import * as React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  public handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f111a] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#141624] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                দুঃখিত, কিছু সমস্যা হয়েছে!
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                অ্যাপ্লিকেশনে সাময়িক ত্রুটি দেখা দিয়েছে। পৃষ্ঠাটি রিফ্রেশ করুন অথবা হোম পেজে ফিরে যান।
              </p>
              {this.state.error && (
                <div className="p-3 bg-black/40 rounded-xl text-[11px] text-rose-300 font-mono text-left overflow-x-auto max-h-28 border border-white/5">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
              >
                <RefreshCw className="w-4 h-4" /> রিফ্রেশ করুন
              </button>
              <a
                href="/"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" /> হোম পেজ
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
