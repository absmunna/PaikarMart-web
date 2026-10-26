import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import GoogleSignInButton from "./GoogleSignInButton";

interface EmailLoginProps {
  onToggleMode: () => void;
}

export default function EmailLogin({ onToggleMode }: EmailLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email or password is incorrect");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <GoogleSignInButton />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0f111a] px-4 text-gray-500 font-bold tracking-widest">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl text-sm border border-rose-500/20 font-medium animate-shake">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF7A00] transition-colors" />
          </div>
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#141624] border border-white/5 rounded-2xl outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-[#FF7A00]/5 transition-all font-medium text-white placeholder:text-gray-600"
          />
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF7A00] transition-colors" />
          </div>
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#141624] border border-white/5 rounded-2xl outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-[#FF7A00]/5 transition-all font-medium text-white placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Link to="/auth/forgot-password" title="Forgot Password" className="text-sm font-bold text-gray-500 hover:text-[#FF7A00] transition-colors">
          Forgot password?
        </Link>
      </div>

      <button 
        type="submit" 
        disabled={loading || !email || !password}
        className="w-full bg-[#FF7A00] text-white rounded-2xl py-4 font-bold text-base hover:bg-[#e06b00] transition-all mt-2 shadow-xl shadow-[#FF7A00]/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Sign In
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="text-center mt-4">
        <p className="text-sm font-medium text-gray-500">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={onToggleMode}
            className="font-bold text-[#FF7A00] hover:text-[#e06b00] transition-colors"
          >
            Create one
          </button>
        </p>
      </div>
    </form>
  </div>
  );
}
