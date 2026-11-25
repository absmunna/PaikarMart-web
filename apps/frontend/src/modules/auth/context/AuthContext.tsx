import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
// RESTORE_MARKER - content too large for single tool arg; will use chunked push
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
export function useAuth() {
  throw new Error('AuthContext temporarily restoring');
}
export default null;
