import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SystemSeverity = 'info' | 'warning' | 'critical';

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: SystemSeverity;
  metadata?: any;
}

export interface ModerationItem {
  id: string;
  type: 'post' | 'product' | 'user' | 'service';
  reason: string;
  flaggedBy: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'escalated' | 'resolved';
  contentPreview: string;
}

export interface SystemHealth {
  apiLatency: number;
  throughput: number;
  dbLoad: number;
  errorRate: number;
  activeSessions: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface RiskMetric {
  id: string;
  title: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface AdminGovernanceState {
  health: SystemHealth;
  logs: AuditLog[];
  moderationQueue: ModerationItem[];
  riskMetrics: RiskMetric[];
  isLoading: boolean;
  
  setHealth: (health: SystemHealth) => void;
  addLog: (log: AuditLog) => void;
  setModerationQueue: (items: ModerationItem[]) => void;
  updateModerationStatus: (id: string, status: ModerationItem['status']) => void;
  setRiskMetrics: (metrics: RiskMetric[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminGovernanceStore = create<AdminGovernanceState>()(
  persist(
    (set) => ({
      health: {
        apiLatency: 45,
        throughput: 1200,
        dbLoad: 12,
        errorRate: 0.02,
        activeSessions: 450,
        status: 'healthy'
      },
      logs: [],
      moderationQueue: [],
      riskMetrics: [],
      isLoading: false,

      setHealth: (health) => set({ health }),
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 100) })),
      setModerationQueue: (items) => set({ moderationQueue: items }),
      updateModerationStatus: (id, status) => set((state) => ({
        moderationQueue: state.moderationQueue.map(item => item.id === id ? { ...item, status } : item)
      })),
      setRiskMetrics: (metrics) => set({ riskMetrics: metrics }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'pm-admin-governance-v1',
    }
  )
);
