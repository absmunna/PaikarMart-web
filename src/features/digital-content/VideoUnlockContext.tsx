import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { safeStorage } from "@/modules/app/utils/storage";

export interface UnlockEntry {
  videoId?: string;
  packageId?: string;
  unlockedAt: string;
}

interface VideoUnlockCtx {
  unlocks: UnlockEntry[];
  hasVideoUnlocked: (videoId: string) => boolean;
  hasPackageUnlocked: (packageId: string) => boolean;
  unlockVideo: (videoId: string) => void;
  unlockPackage: (packageId: string) => void;
}

const STORAGE_KEY = "pm.unlocks.v1";
const VideoUnlockContext = createContext<VideoUnlockCtx | null>(null);

function readStored(): UnlockEntry[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UnlockEntry[]) : [];
  } catch {
    return [];
  }
}

export function VideoUnlockProvider({ children }: { children: ReactNode }) {
  const [unlocks, setUnlocks] = useState<UnlockEntry[]>(() => readStored());

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(unlocks));
  }, [unlocks]);

  const hasVideoUnlocked = useCallback((id: string) => unlocks.some((u) => u.videoId === id), [unlocks]);
  const hasPackageUnlocked = useCallback((id: string) => unlocks.some((u) => u.packageId === id), [unlocks]);

  const unlockVideo = useCallback((id: string) => {
    setUnlocks((prev) => (prev.some((u) => u.videoId === id) ? prev : [{ videoId: id, unlockedAt: new Date().toISOString() }, ...prev]));
  }, []);

  const unlockPackage = useCallback((id: string) => {
    setUnlocks((prev) => (prev.some((u) => u.packageId === id) ? prev : [{ packageId: id, unlockedAt: new Date().toISOString() }, ...prev]));
  }, []);

  const value = useMemo<VideoUnlockCtx>(() => ({
    unlocks, hasVideoUnlocked, hasPackageUnlocked, unlockVideo, unlockPackage,
  }), [unlocks, hasVideoUnlocked, hasPackageUnlocked, unlockVideo, unlockPackage]);

  return <VideoUnlockContext.Provider value={value}>{children}</VideoUnlockContext.Provider>;
}

export function useVideoUnlock() {
  const ctx = useContext(VideoUnlockContext);
  if (!ctx) throw new Error("useVideoUnlock must be used inside <VideoUnlockProvider>");
  return ctx;
}
