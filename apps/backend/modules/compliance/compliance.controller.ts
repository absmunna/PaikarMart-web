import { Request, Response } from 'express';
import { prisma } from '../../config/database';

// Predefined Global & Bangladesh Compliance Fallbacks for Dev Mode (No Database Active)
let fallbackCategoryConfigs = [
  {
    id: "ctg-wholesale",
    slug: "wholesale",
    name: "Wholesale (B2B Bulk)",
    nameBn: "পাইকারি বাজার (B2B)",
    defaultCommission: 5.00, // 5% commission
    paymentReleaseRule: "delivery_plus_3days", // Holding order funds in Escrow until 3 days after receipt
    deliveryBy: "seller", // Wholesale seller arranges logistics
    moqEnabled: true,
    returnWindowDays: 14, // 14 days refund window for corporate buyer assurance
    requiresKyc: true,
    isActive: true
  },
  {
    id: "ctg-retail",
    slug: "retail",
    name: "Retail Marketplace",
    nameBn: "খুচরা মার্কেটপ্লেস (B2C)",
    defaultCommission: 10.00, // 10% standard commission
    paymentReleaseRule: "delivery_plus_7days", // Released after 7 days return interval
    deliveryBy: "platform", // Paikar Mart standard logistics/delivery boy
    moqEnabled: false,
    returnWindowDays: 7, // Standard 7 day consumer return window
    requiresKyc: true,
    isActive: true
  },
  {
    id: "ctg-digital",
    slug: "digital",
    name: "Digital Goods & Subscriptions",
    nameBn: "ডিজিটাল পণ্য ও লাইসেন্স",
    defaultCommission: 15.00, // 15% digital marketplace fee
    paymentReleaseRule: "instant", // No escrow delay once successfully downloaded/delivered
    deliveryBy: "platform", // Automated link generation
    moqEnabled: false,
    returnWindowDays: 0, // No return available for software files
    requiresKyc: true,
    isActive: true
  },
  {
    id: "ctg-service",
    slug: "service",
    name: "Milestone Freelance & Gigs",
    nameBn: "ফ্রিল্যান্সিং ও গিগস সেবা",
    defaultCommission: 8.00, // 8% commission
    paymentReleaseRule: "milestone_approved", // Fund released based on milestones defined by buyer & freelancer
    deliveryBy: "seller",
    moqEnabled: false,
    returnWindowDays: 3,
    requiresKyc: true,
    isActive: true
  },
  {
    id: "ctg-nearby",
    slug: "nearby",
    name: "Nearby Shops (Location)",
    nameBn: "নিকটস্থ দোকান ও রিটেইল",
    defaultCommission: 3.00, // Very low local marketplace commission to support small physical shops
    paymentReleaseRule: "instant_on_pickup", // Released as soon as QR scanner confirms pickup or delivery
    deliveryBy: "customer_pickup", // Delivered by shop or customer pickup
    moqEnabled: false,
    returnWindowDays: 2,
    requiresKyc: true,
    isActive: true
  }
];

let fallbackSellerProfiles: any[] = [
  {
    id: "sp-demo",
    userId: "usr-seller",
    storeName: "Dhaka Wholesale Trading",
    storeLogo: null,
    storeBanner: null,
    sellerType: "wholesale",
    nidNumber: "1994265673234",
    tradeLicenseNo: "TR-2026-87989",
    businessPhone: "+8801700000000",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Keraniganj",
    addressDetails: "East Aganagar, Wholesale garments lane 2",
    verificationStatus: "approved",
    verificationBadge: "gold",
    moderatorNote: "Verified Trade License with Keraniganj trade authorities.",
    commissionRate: 5.0,
    rawDocuments: [],
    createdAt: new Date()
  }
];

let fallbackComplaints: any[] = [];
let fallbackRefundSLAs: any[] = [];

// ==========================================
// 1. PRODUCT CATEGORY COMPLIANCE CONFIGS
// ==========================================
export const getCategoryConfigs = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(fallbackCategoryConfigs);
    }
    const configs = await (prisma as any).productCategoryConfig.findMany({
      where: { isActive: true }
    });
    res.json(configs);
  } catch (error) {
    console.error('Fetch Category Configs error:', error);
    res.status(500).json({ error: 'Failed to retrieve ecommerce category guidelines.' });
  }
};

export const updateCategoryConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { defaultCommission, paymentReleaseRule, returnWindowDays, requiresKyc } = req.body;

    if (!process.env.DATABASE_URL) {
      fallbackCategoryConfigs = fallbackCategoryConfigs.map(c => 
        c.id === id ? { ...c, defaultCommission: Number(defaultCommission), paymentReleaseRule, returnWindowDays: Number(returnWindowDays), requiresKyc: !!requiresKyc } : c
      );
      return res.json({ message: 'Category configuration updated in dev mode fallback.', config: fallbackCategoryConfigs.find(c => c.id === id) });
    }

    const updated = await (prisma as any).productCategoryConfig.update({
      where: { id },
      data: {
        defaultCommission,
        paymentReleaseRule,
        returnWindowDays: returnWindowDays ? Number(returnWindowDays) : undefined,
        requiresKyc: requiresKyc !== undefined ? !!requiresKyc : undefined
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Category Config error:', error);
    res.status(500).json({ error: 'Error modifying merchant portal category policy.' });
  }
};

// ==========================================
// 2. SELLER DIRECTIVE VERIFICATION (KYC)
// ==========================================
export const getSellerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'usr-seller';

    if (!process.env.DATABASE_URL) {
      const profile = fallbackSellerProfiles.find(p => p.userId === userId);
      return res.json(profile || null);
    }

    const profile = await (prisma as any).sellerProfile.findUnique({
      where: { userId }
    });

    res.json(profile);
  } catch (error) {
    console.error('Get Seller Profile error:', error);
    res.status(500).json({ error: 'Failed to load seller KYC details.' });
  }
};

export const createOrUpdateSellerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'usr-seller';
    const { storeName, sellerType, nidNumber, tradeLicenseNo, businessPhone, division, district, upazila, addressDetails } = req.body;

    if (!process.env.DATABASE_URL) {
      const existingIdx = fallbackSellerProfiles.findIndex(p => p.userId === userId);
      const newProfile = {
        id: existingIdx >= 0 ? fallbackSellerProfiles[existingIdx].id : `sp-${Date.now()}`,
        userId,
        storeName: storeName || 'My Paikar Merchant Store',
        sellerType: sellerType || 'retail',
        nidNumber,
        tradeLicenseNo,
        businessPhone,
        division,
        district,
        upazila,
        addressDetails,
        verificationStatus: 'pending',
        verificationBadge: 'bronze',
        moderatorNote: 'Submitted in dev mode. Awaiting operator validation.',
        commissionRate: sellerType === 'wholesale' ? 5.0 : 10.0,
        rawDocuments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (existingIdx >= 0) {
        fallbackSellerProfiles[existingIdx] = newProfile;
      } else {
        fallbackSellerProfiles.push(newProfile);
      }

      return res.status(201).json({
        message: 'Seller verification profile submitted/updated (dev mode).',
        profile: newProfile
      });
    }

    const payload = {
      storeName,
      sellerType: sellerType || 'retail',
      nidNumber,
      tradeLicenseNo,
      businessPhone,
      division,
      district,
      upazila,
      addressDetails,
      verificationStatus: 'pending',
      verificationBadge: 'bronze'
    };

    const profile = await (prisma as any).sellerProfile.upsert({
      where: { userId },
      update: payload,
      create: {
        userId,
        ...payload
      }
    });

    res.status(201).json({
      message: 'Seller verification application registered under review.',
      profile
    });
  } catch (error) {
    console.error('Create/Update Seller Profile error:', error);
    res.status(500).json({ error: 'Error dispatching KYC onboarding request.' });
  }
};

// ==========================================
// 3. REFUND SLA & ESCROW HOLD SYSTEM
// ==========================================
export const submitRefundRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'usr-buyer';
    const { orderId, sellerId, reason, amount } = req.body;

    // SLA Deadline under Bangladesh compliance rules (typically max 7-10 days to resolve)
    const slaDays = 7;
    const slaDeadline = new Date();
    slaDeadline.setDate(slaDeadline.getDate() + slaDays);

    if (!process.env.DATABASE_URL) {
      const newSLA = {
        id: `sla-${Date.now()}`,
        orderId,
        userId,
        sellerId,
        reason,
        amount: Number(amount || 0),
        escrowStatus: 'held',
        slaDeadline,
        currentStatus: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      fallbackRefundSLAs.push(newSLA);
      return res.status(201).json({
        message: 'Refund/Return SLA initiated. Escrow payout held.',
        refund: newSLA
      });
    }

    const refund = await (prisma as any).refundSLA.create({
      data: {
        orderId,
        userId,
        sellerId,
        reason,
        amount: Number(amount),
        escrowStatus: 'held',
        slaDeadline,
        currentStatus: 'submitted'
      }
    });

    // Also upgrade the order status to dispute / refund raised
    await (prisma.order as any).update({
      where: { id: orderId },
      data: {
        paymentStatus: 'holding_escrow',
        disputeStatus: 'raised'
      }
    });

    res.status(201).json({
      message: 'Refund ticket issued. Commission and seller balance successfully held in Escrow.',
      refund
    });
  } catch (error) {
    console.error('Refund SLA Generation error:', error);
    res.status(500).json({ error: 'Failed to issue refund escrow reservation.' });
  }
};

export const getRefundTickets = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(fallbackRefundSLAs);
    }
    const tickets = await (prisma as any).refundSLA.findMany();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load return SLAs' });
  }
};

// ==========================================
// 4. CONSUMER COMPLAINT & E-CAB REGISTRY
// ==========================================
export const fileComplaint = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'usr-buyer';
    const { targetSellerId, orderId, subject, description } = req.body;

    if (!process.env.DATABASE_URL) {
      const newComplaint = {
        id: `cpl-${Date.now()}`,
        userId,
        targetSellerId,
        orderId,
        subject,
        description,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      fallbackComplaints.push(newComplaint);
      return res.status(201).json({
        message: 'Consumer court complaint logged successfully.',
        complaint: newComplaint
      });
    }

    const complaint = await (prisma as any).complaint.create({
      data: {
        userId,
        targetSellerId,
        orderId,
        subject,
        description,
        status: 'pending'
      }
    });

    res.status(201).json({
      message: 'Complaint filed in official consumer assurance queue.',
      complaint
    });
  } catch (error) {
    console.error('File complaint error:', error);
    res.status(500).json({ error: 'Could not log consumer complaint.' });
  }
};

export const getComplaints = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(fallbackComplaints);
    }
    const complaints = await (prisma as any).complaint.findMany({
      include: {
        user: {
          select: { fullName: true, email: true }
        }
      }
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active compliance complaints' });
  }
};
