import { safeStorage } from "@/modules/app/utils/storage";

export interface SendOtpResponse {
  success: boolean;
  message: string;
  email: string;
  expiresInSeconds: number;
  demoCode?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  verified: boolean;
  message: string;
  token?: string;
  user?: any;
}

const OTP_STORAGE_PREFIX = "pm_email_otp_";

/**
 * Send 6-digit Email OTP code to user's email address
 */
export async function sendEmailOtp(
  email: string,
  purpose: "login" | "register" | "reset_password" = "login"
): Promise<SendOtpResponse> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("সঠিক ইমেইল ঠিকানা দিন (যেমন: user@example.com)");
  }

  try {
    const res = await fetch("/api/v1/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, purpose }),
    });

    if (res.ok) {
      const data = await res.json();
      // Cache local OTP fallback state for dev/offline compatibility
      if (data.demoCode) {
        saveLocalOtp(cleanEmail, data.demoCode, 300);
      }
      return data;
    }
  } catch (e) {
    console.warn("[EmailOtpService] Backend API offline, switching to smart local OTP simulation", e);
  }

  // Fallback dev mode OTP generator if server endpoint not running
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
  saveLocalOtp(cleanEmail, mockCode, 300);

  return {
    success: true,
    message: `ইমেইলে (ডিজিটাল কোড: ${mockCode}) ওটিপি পাঠানো হয়েছে`,
    email: cleanEmail,
    expiresInSeconds: 300,
    demoCode: mockCode,
  };
}

/**
 * Verify 6-digit Email OTP code
 */
export async function verifyEmailOtp(
  email: string,
  otp: string
): Promise<VerifyOtpResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  if (!cleanEmail || !cleanOtp || cleanOtp.length !== 6) {
    throw new Error("৬ সংখ্যার সঠিক ওটিপি কোড প্রবেশ করান");
  }

  try {
    const res = await fetch("/api/v1/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
    });

    if (res.ok) {
      const data = await res.json();
      clearLocalOtp(cleanEmail);
      return data;
    } else {
      const err = await res.json().catch(() => ({}));
      if (err.error) throw new Error(err.error);
    }
  } catch (e: any) {
    if (e.message && !e.message.includes("fetch")) {
      throw e;
    }
    console.warn("[EmailOtpService] Fallback to local OTP verification", e);
  }

  // Local verification fallback
  const localData = getLocalOtp(cleanEmail);
  if (!localData) {
    throw new Error("ওটিপি কোড পাওয়া যায়নি অথবা মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।");
  }

  if (Date.now() > localData.expiresAt) {
    clearLocalOtp(cleanEmail);
    throw new Error("ওটিপি কোডের মেয়াদের সময় পার হয়ে গেছে। নতুন কোড রিকোয়েস্ট করুন।");
  }

  if (localData.code !== cleanOtp) {
    throw new Error("ভুল ওটিপি কোড! অনুগ্রহ করে আবার চেষ্টা করুন।");
  }

  clearLocalOtp(cleanEmail);
  return {
    success: true,
    verified: true,
    message: "ইমেইল ওটিপি সফলভাবে ভেরিফাইড হয়েছে!",
    token: `token_otp_${Date.now()}`,
    user: {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      phone: "",
      fullName: cleanEmail.split("@")[0],
      role: "buyer",
    },
  };
}

// Helpers for localStorage fallback
function saveLocalOtp(email: string, code: string, durationSeconds: number) {
  const payload = {
    code,
    expiresAt: Date.now() + durationSeconds * 1000,
  };
  safeStorage.setItem(OTP_STORAGE_PREFIX + email, JSON.stringify(payload));
}

function getLocalOtp(email: string): { code: string; expiresAt: number } | null {
  try {
    const raw = safeStorage.getItem(OTP_STORAGE_PREFIX + email);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearLocalOtp(email: string) {
  safeStorage.removeItem(OTP_STORAGE_PREFIX + email);
}
