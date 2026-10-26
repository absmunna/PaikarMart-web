/**
 * Lightweight client-side AI change logger.
 * Every UI change made by the admin/AI assistant is appended to a ring buffer
 * so the user can audit what was changed and roll back.
 *
 * Server-side log lives in `/ai-logs/CHANGELOG.md`.
 */
import { safeStorage } from "@/modules/app/utils/storage";

export interface AIChange {
  id: string;
  at: string;
  scope: "ui" | "config" | "registry" | "feature-flag" | "theme" | "profit-share";
  actor: "admin" | "ai" | "system";
  summary: string;
  details?: Record<string, unknown>;
};

const STORAGE_KEY = "pm.ai.changes.v1";
const MAX = 200;

export function logChange(change: Omit<AIChange, "id" | "at">) {
  if (typeof window === "undefined") return;
  const entry: AIChange = {
    id: `ch_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    ...change,
  };
  const list = readLog();
  list.unshift(entry);
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX)));
  window.dispatchEvent(new CustomEvent("pm:ai:logged", { detail: entry }));
}

export function readLog(): AIChange[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AIChange[]) : [];
  } catch {
    return [];
  }
}

export function clearLog() {
  safeStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("pm:ai:logged"));
}
