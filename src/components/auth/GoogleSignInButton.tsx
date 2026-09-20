import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully with Google!");
    } catch (error: any) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error("Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
            />
            <path
              fill="#FBBC05"
              d="M16.04 18.013c-1.09.618-2.347.987-3.64.987a7.063 7.063 0 0 1-5.23-2.23l-4.027 3.137C5.035 22.926 8.27 24 12 24c3.28 0 6.21-1.106 8.356-2.937l-4.316-3.05Z"
            />
            <path
              fill="#4285F4"
              d="M19.834 5.378C21.218 6.953 22 9.027 22 12c0 .644-.067 1.276-.189 1.884H12v-4.51h5.34a4.568 4.568 0 0 1-1.977 2.997l4.317 3.05c2.518-2.316 3.923-5.748 3.923-9.52 0-.34-.03-.675-.09-1.003L19.834 5.378Z"
            />
            <path
              fill="#34A853"
              d="M1.24 17.35 5.266 14.235a7.045 7.045 0 0 1 0-4.47L1.24 6.65a12.01 12.01 0 0 0 0 10.7Z"
            />
          </svg>
          <span className="text-sm">Continue with Google</span>
        </>
      )}
    </button>
  );
}
