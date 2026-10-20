import { Request, Response } from 'express';
import { prisma, db } from '../../config/database';

export interface AdminFeatureFlag {
  key: string;
  label: string;
  description: string;
  category: 'commerce' | 'social' | 'finance' | 'security';
  enabled: boolean;
  rolloutPercentage: number;
  allowedRoles: string[];
  updatedAt: string;
  updatedBy: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: 'info' | 'warning' | 'critical';
  details?: string;
}

export interface AdminEscrowRecord {
  id: string;
  orderId: string;
  buyer: string;
  vendor: string;
  buyerPhone: string;
  vendorPhone: string;
  amount: number;
  status: 'held' | 'released' | 'disputed' | 'refunded';
  disputeReason?: string;
  createdAt: string;
  releaseAt: string;
  timeRemaining: string;
}

export interface AdminModerationRecord {
  id: string;
  type: 'post' | 'bid' | 'product' | 'user';
  targetId: string;
  authorName: string;
  authorPhone?: string;
  reason: string;
  flaggedBy: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed' | 'suspended';
  contentPreview: string;
  riskScore: number;
}

// In-Memory state for resilient offline/development operations
let memoryFlags: AdminFeatureFlag[] = [
  {
    key: 'social_bidding_reverse_auction',
    label: 'Social Reverse-Auction Bids (রিভার্স অকশন বিডিং)',
    description: 'Allows buyers to broadcast demand RFQs on social feed and verified merchants to place competitive price quotes.',
    category: 'social',
    enabled: true,
    rolloutPercentage: 100,
    allowedRoles: ['all'],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    key: 'escrow_automatic_48h_release',
    label: 'Automated 48h Escrow Settlement (স্বয়ংক্রিয় এসক্রো রিলিজ)',
    description: 'Auto-disburses locked escrow funds to seller wallet 48 hours post-delivery verification if no dispute ticket is active.',
    category: 'finance',
    enabled: true,
    rolloutPercentage: 100,
    allowedRoles: ['admin', 'super_admin'],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    key: 'ai_content_sentinel',
    label: 'AI Content Sentinel Moderation (কনটেন্ট ফিল্টারিং)',
    description: 'Automated heuristic scanner flagging counterfeit medicines, abusive language, and abnormal price surges in real time.',
    category: 'security',
    enabled: true,
    rolloutPercentage: 100,
    allowedRoles: ['all'],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    key: 'pk_cash_coin_multiplier',
    label: 'PK Cash Cashback Booster (ক্যাশব্যাক ২x বুস্টার)',
    description: 'Double PK Coin reward earnings on purchases made through PK Curated Store.',
    category: 'commerce',
    enabled: false,
    rolloutPercentage: 50,
    allowedRoles: ['buyer', 'vip'],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    key: 'cod_high_risk_zones',
    label: 'COD in High-Risk Delivery Zones (ক্যাশ অন ডেলিভারি)',
    description: 'Enables Cash-on-Delivery payment option in areas with high courier return rates without requiring prepayment token.',
    category: 'finance',
    enabled: false,
    rolloutPercentage: 20,
    allowedRoles: ['all'],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    key: 'instant_vendor_onboarding',
    label: 'Instant Vendor Provisional Shop (ভেন্ডর প্রোভিশনাল অনুমোদন)',
    description: 'Allows merchants with verified National ID (NID) to immediately list up to 5 items while trade license verification is pending.',
    category: 'commerce',
    enabled: true,
    rolloutPercentage: 100,
    allowedRoles: ['seller'],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  }
];

let memoryAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actor: 'admin@paikarmart.com',
    action: 'VENDOR_APPROVAL',
    target: 'সিল্ক সিটি ফ্যাশন হাউস (Rajshahi Silk)',
    severity: 'info',
    details: 'Trade license TRAD/DSCC/092144/2024 and NID validated'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    actor: 'system',
    action: 'AUTO_SENTINEL_FLAG',
    target: 'Post ID: post-demand-892',
    severity: 'warning',
    details: 'Keyword match: unverified medical formulation'
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actor: 'finance@paikarmart.com',
    action: 'ESCROW_RELEASE',
    target: 'Order #ORD-78192 (৳ 45,000)',
    severity: 'info',
    details: '48h buyer inspection expired with 0 dispute tickets'
  }
];

let memoryEscrows: AdminEscrowRecord[] = [
  {
    id: 'esc-001',
    orderId: 'ORD-78291',
    buyer: 'কবির আহমেদ (Chittagong Retail)',
    vendor: 'মেসার্স রহমান টেক্সটাইল মিলস',
    buyerPhone: '01712-349811',
    vendorPhone: '01923-456789',
    amount: 145000,
    status: 'held',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    releaseAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    timeRemaining: '২২ ঘণ্টা বাকি (Auto-Release)'
  },
  {
    id: 'esc-002',
    orderId: 'ORD-78284',
    buyer: 'সোহেল ট্রেডার্স (Khulna)',
    vendor: 'ঢাকা গ্যাজেট অ্যান্ড কম্পিউটার পাইকারি',
    buyerPhone: '01811-998877',
    vendorPhone: '01755-112233',
    amount: 88500,
    status: 'disputed',
    disputeReason: 'প্যাকেটে ৫টি ইউনিট ভাঙা অবস্থায় ডেলিভারি হয়েছে। ছবি সংযুক্ত।',
    createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    releaseAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    timeRemaining: 'তদন্তাধীন (Under Arbitration)'
  },
  {
    id: 'esc-003',
    orderId: 'ORD-78192',
    buyer: 'তানভীর হাসান (Bogura)',
    vendor: 'মেঘনা অর্গানিক এগ্রো ফার্মস',
    buyerPhone: '01911-332211',
    vendorPhone: '01823-456789',
    amount: 45000,
    status: 'released',
    createdAt: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    releaseAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    timeRemaining: 'রিলিজ সম্পন্ন (Credited)'
  },
  {
    id: 'esc-004',
    orderId: 'ORD-78150',
    buyer: 'জাকির স্টোর (Sylhet)',
    vendor: 'চায়না টেক ইলেক্ট্রনিক্স হাব',
    buyerPhone: '01611-445566',
    vendorPhone: '01912-334455',
    amount: 62000,
    status: 'held',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    releaseAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    timeRemaining: '৩৬ ঘণ্টা বাকি'
  }
];

let memoryModeration: AdminModerationRecord[] = [
  {
    id: 'mod-1',
    type: 'post',
    targetId: 'post-soc-spam-1',
    authorName: 'CryptoTraderBD_99',
    authorPhone: '01900-112233',
    reason: 'Spam / Financial Scam URL in caption',
    flaggedBy: 'AI Content Sentinel',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'pending',
    contentPreview: 'ঘরে বসে প্রতিদিন ৫০০০ টাকা আয় করুন! টেলিগ্রামে জয়েন করুন: t.me/fake_link...',
    riskScore: 94
  },
  {
    id: 'mod-2',
    type: 'bid',
    targetId: 'bid-suspicious-44',
    authorName: 'র‍্যাপিড সাপ্লাইয়ার্স',
    authorPhone: '01700-445566',
    reason: 'Abnormal Bid Price Discrepancy (-85% below market floor)',
    flaggedBy: 'RFQ Price Anomaly Engine',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    status: 'pending',
    contentPreview: 'Demand: ১০০ পিস স্যামসাং প্যানেল। মার্কেট রেট: ৳ ১২,০০০/পিস। বিড প্রস্তাব: ৳ ১,৮০০/পিস।',
    riskScore: 82
  },
  {
    id: 'mod-3',
    type: 'product',
    targetId: 'prod-fake-med-12',
    authorName: 'হার্বাল ডিস্ট্রিবিউশন হাব',
    authorPhone: '01800-778899',
    reason: 'Unregistered Ayurvedic Formulation without DGDA license',
    flaggedBy: 'Compliance Classifier',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    contentPreview: 'ম্যাজিকাল ভেষজ ক্যাপসুল - ৩ দিনে ডায়াবেটিস শতভাগ নিরাময় গ্যারান্টি!',
    riskScore: 98
  }
];

export const getAdminMetrics = async (req: Request, res: Response) => {
  try {
    let totalUsers = 1845;
    let pendingVendors = 3;
    let heldEscrowAmount = 295500;
    let disputedEscrowAmount = 88500;
    let totalGMV = 3450000;
    let platformProfit = 172500; // ~5% take-rate

    if (db.isConnected()) {
      try {
        const [userCount, orderSum, pendingKyc] = await Promise.all([
          prisma.user.count(),
          prisma.order.aggregate({ _sum: { totalAmount: true, platformProfit: true } }),
          prisma.userVerification.count({ where: { status: 'pending' } })
        ]);
        if (userCount > 0) totalUsers = userCount;
        if (orderSum._sum.totalAmount) totalGMV = Number(orderSum._sum.totalAmount);
        if (orderSum._sum.platformProfit) platformProfit = Number(orderSum._sum.platformProfit);
        if (pendingKyc > 0) pendingVendors = pendingKyc;
      } catch (err) {
        console.warn('DB query in getAdminMetrics fallback:', err);
      }
    }

    const pendingModerationCount = memoryModeration.filter(m => m.status === 'pending').length;
    const activeEscrowCount = memoryEscrows.filter(e => e.status === 'held').length;

    res.json({
      status: 'success',
      metrics: {
        totalUsers,
        totalGMV,
        platformProfit,
        heldEscrowAmount,
        disputedEscrowAmount,
        pendingVendors,
        activeEscrowCount,
        pendingModerationCount,
        systemHealth: {
          apiLatencyMs: 38,
          dbStatus: db.isConnected() ? 'connected' : 'mock_resilient_mode',
          dbPoolUtilization: '18%',
          uptime: '99.98%',
          gitCommit: 'main@8e4f1a2',
          activeSessions: 412
        }
      }
    });
  } catch (error: any) {
    console.error('getAdminMetrics error:', error);
    res.status(500).json({ error: 'Failed to fetch admin metrics', details: error.message });
  }
};

export const getAdminEscrows = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'success',
      escrows: memoryEscrows
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch escrows', details: error.message });
  }
};

export const releaseAdminEscrow = async (req: Request, res: Response) => {
  try {
    const { escrowId } = req.params;
    const actor = (req as any).user?.email || (req as any).user?.id || 'admin@paikarmart.com';

    const index = memoryEscrows.findIndex(e => e.id === escrowId || e.orderId === escrowId);
    if (index === -1) {
      return res.status(404).json({ error: 'Escrow item not found' });
    }

    memoryEscrows[index].status = 'released';
    memoryEscrows[index].timeRemaining = 'রিলিজ সম্পন্ন (Manually Released by Admin)';

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action: 'ESCROW_MANUAL_RELEASE',
      target: `Escrow ${escrowId} for Order ${memoryEscrows[index].orderId}`,
      severity: 'info',
      details: `Disbursed ৳ ${memoryEscrows[index].amount.toLocaleString()} to ${memoryEscrows[index].vendor}`
    };
    memoryAuditLogs.unshift(newLog);

    res.json({
      status: 'success',
      message: `Escrow for Order ${memoryEscrows[index].orderId} successfully released to vendor wallet.`,
      escrow: memoryEscrows[index]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to release escrow', details: error.message });
  }
};

export const refundAdminEscrow = async (req: Request, res: Response) => {
  try {
    const { escrowId } = req.params;
    const { reason } = req.body;
    const actor = (req as any).user?.email || (req as any).user?.id || 'admin@paikarmart.com';

    const index = memoryEscrows.findIndex(e => e.id === escrowId || e.orderId === escrowId);
    if (index === -1) {
      return res.status(404).json({ error: 'Escrow item not found' });
    }

    memoryEscrows[index].status = 'refunded';
    memoryEscrows[index].timeRemaining = 'ক্রেতাকে রিফান্ড সম্পন্ন (Refunded to Buyer)';

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action: 'ESCROW_DISPUTE_REFUND',
      target: `Escrow ${escrowId} for Order ${memoryEscrows[index].orderId}`,
      severity: 'warning',
      details: `Refunded ৳ ${memoryEscrows[index].amount.toLocaleString()} to buyer ${memoryEscrows[index].buyer}. Reason: ${reason || 'Admin arbitration resolution'}`
    };
    memoryAuditLogs.unshift(newLog);

    res.json({
      status: 'success',
      message: `Escrow for Order ${memoryEscrows[index].orderId} refunded to buyer successfully.`,
      escrow: memoryEscrows[index]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to refund escrow', details: error.message });
  }
};

export const getAdminModerationQueue = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'success',
      queue: memoryModeration
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch moderation queue', details: error.message });
  }
};

export const resolveAdminModeration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // 'dismiss' | 'delete' | 'suspend'
    const actor = (req as any).user?.email || (req as any).user?.id || 'moderator@paikarmart.com';

    const index = memoryModeration.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Moderation item not found' });
    }

    if (action === 'dismiss') {
      memoryModeration[index].status = 'dismissed';
    } else if (action === 'suspend') {
      memoryModeration[index].status = 'suspended';
    } else {
      memoryModeration[index].status = 'resolved';
    }

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action: `MODERATION_${action.toUpperCase()}`,
      target: `${memoryModeration[index].type.toUpperCase()}: ${memoryModeration[index].targetId}`,
      severity: action === 'suspend' ? 'critical' : 'info',
      details: `Action: ${action}. Author: ${memoryModeration[index].authorName}. Note: ${notes || 'Triage queue processed'}`
    };
    memoryAuditLogs.unshift(newLog);

    res.json({
      status: 'success',
      message: `Moderation task for ${id} processed successfully with action: ${action}`,
      item: memoryModeration[index]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to resolve moderation item', details: error.message });
  }
};

export const getAdminFeatureFlags = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'success',
      flags: memoryFlags
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch feature flags', details: error.message });
  }
};

export const updateAdminFeatureFlag = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { enabled, rolloutPercentage } = req.body;
    const actor = (req as any).user?.email || (req as any).user?.id || 'devops@paikarmart.com';

    const index = memoryFlags.findIndex(f => f.key === key);
    if (index === -1) {
      return res.status(404).json({ error: `Feature flag ${key} not found` });
    }

    if (typeof enabled === 'boolean') {
      memoryFlags[index].enabled = enabled;
    }
    if (typeof rolloutPercentage === 'number') {
      memoryFlags[index].rolloutPercentage = Math.max(0, Math.min(100, rolloutPercentage));
    }
    memoryFlags[index].updatedAt = new Date().toISOString();
    memoryFlags[index].updatedBy = actor;

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action: 'FEATURE_FLAG_TOGGLE',
      target: key,
      severity: 'warning',
      details: `Flag ${key} state updated: enabled=${memoryFlags[index].enabled}, rollout=${memoryFlags[index].rolloutPercentage}%`
    };
    memoryAuditLogs.unshift(newLog);

    res.json({
      status: 'success',
      message: `Feature flag ${key} updated successfully.`,
      flag: memoryFlags[index]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update feature flag', details: error.message });
  }
};

export const getAdminAuditLogs = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'success',
      logs: memoryAuditLogs
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch audit logs', details: error.message });
  }
};
