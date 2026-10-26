import { useAdminGovernanceStore, AuditLog, ModerationItem, RiskMetric } from './adminGovernanceStore';

const MOCK_MODERATION: ModerationItem[] = [
  { id: 'mod-1', type: 'post', reason: 'Spam / Repetitive Content', flaggedBy: 'Auto-Sentinel', timestamp: new Date().toISOString(), status: 'pending', contentPreview: 'Buy cheap coins now at...' },
  { id: 'mod-2', type: 'product', reason: 'Unverified Medicine', flaggedBy: 'Gov-Bot', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'pending', contentPreview: 'Special Herbal Cure for...' },
  { id: 'mod-3', type: 'user', reason: 'Unusual Payout Spike', flaggedBy: 'Risk-Engine', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'escalated', contentPreview: 'User ID: u-9921 (Vendor)' },
];

const MOCK_RISK: RiskMetric[] = [
  { id: 'r1', title: 'Spam Probability', score: 18, trend: 'down', description: 'Monitoring social feed bot interactions.' },
  { id: 'r2', title: 'Fraud Pattern', score: 42, trend: 'up', description: 'Multiple accounts linked to same IP in checkout.' },
  { id: 'r3', title: 'Payment Anomaly', score: 5, trend: 'stable', description: 'High volume refund requests in electronics.' },
];

export const adminGovernanceService = {
  init: () => {
    const store = useAdminGovernanceStore.getState();
    store.setLoading(true);
    
    // Simulate initial sequence
    setTimeout(() => {
      store.setModerationQueue(MOCK_MODERATION);
      store.setRiskMetrics(MOCK_RISK);
      store.setLoading(false);
      
      adminGovernanceService.logAction('system', 'GOVERNANCE_BOOT', 'Admin Dashboard Cluster', 'info');
    }, 500);
  },

  initEventListeners: () => {
    if (typeof window === 'undefined') return;

    window.addEventListener('VIOLATION_DETECTED', (e: any) => {
      const { type, reason, target } = e.detail;
      const store = useAdminGovernanceStore.getState();
      
      const newLog: AuditLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        actor: 'Auto-Sentinel',
        action: 'VIOLATION_SIGNAL',
        target,
        severity: 'warning'
      };
      
      store.addLog(newLog);
      
      const newItem: ModerationItem = {
        id: `mod-${Date.now()}`,
        type,
        reason,
        flaggedBy: 'Auto-Sentinel',
        timestamp: new Date().toISOString(),
        status: 'pending',
        contentPreview: `Target: ${target}`
      };
      
      store.setModerationQueue([newItem, ...store.moderationQueue]);
    });

    window.addEventListener('SYSTEM_ALERT', (e: any) => {
        const { message, severity } = e.detail;
        adminGovernanceService.logAction('CORE_PROBE', 'ALERT_EMITTED', message, severity);
    });
  },

  logAction: (actor: string, action: string, target: string, severity: 'info' | 'warning' | 'critical') => {
    const store = useAdminGovernanceStore.getState();
    store.addLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      actor,
      action,
      target,
      severity
    });
  },

  resolveModeration: (id: string, decision: 'approve' | 'reject' | 'suspend') => {
    const store = useAdminGovernanceStore.getState();
    store.updateModerationStatus(id, 'resolved');
    adminGovernanceService.logAction('Admin/Moderator', `MOD_DECISION_${decision.toUpperCase()}`, `Item: ${id}`, 'info');
  }
};
