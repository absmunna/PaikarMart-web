import { Request, Response } from 'express';
import { prisma, db } from '../../config/database';

function sessionUserId(req: Request): string | undefined {
  return (req as any).user?.id;
}

function isAdmin(req: Request): boolean {
  const role = (req as any).user?.role;
  return role === 'admin' || role === 'super_admin';
}

const PRODUCT_FIELDS = [
  'title',
  'description',
  'price',
  'originalPrice',
  'categoryId',
  'category',
  'stock',
  'moq',
  'images',
  'tieredPrices',
  'vendorId',
] as const;

function pickProductInput(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const key of PRODUCT_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

// ── Products ──────────────────────────────────────────────────────────
export const listSellerProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = sessionUserId(req);
    if (!sellerId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    if (!db.isConnected()) {
      return res.json([]);
    }
    const products = await (prisma as any).product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (e) {
    console.warn('listSellerProducts error:', e);
    res.status(500).json({ error: 'Failed to list seller products' });
  }
};

export const createSellerProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = sessionUserId(req);
    if (!sellerId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    const input = pickProductInput(req.body || {});
    if (!input.title || input.price === undefined) {
      return res.status(400).json({ error: 'title and price are required' });
    }
    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Product was not created.' });
    }
    const product = await (prisma as any).product.create({
      data: { ...input, sellerId },
    });
    res.status(201).json(product);
  } catch (e) {
    console.warn('createSellerProduct error:', e);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateSellerProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = sessionUserId(req);
    if (!sellerId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    const { id } = req.params;
    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Product was not updated.' });
    }
    const existing = await (prisma as any).product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (!isAdmin(req) && existing.sellerId !== sellerId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this product' });
    }
    const updated = await (prisma as any).product.update({
      where: { id },
      data: pickProductInput(req.body || {}),
    });
    res.json(updated);
  } catch (e) {
    console.warn('updateSellerProduct error:', e);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteSellerProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = sessionUserId(req);
    if (!sellerId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    const { id } = req.params;
    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Product was not deleted.' });
    }
    const existing = await (prisma as any).product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (!isAdmin(req) && existing.sellerId !== sellerId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this product' });
    }
    await (prisma as any).product.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    console.warn('deleteSellerProduct error:', e);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// ── Orders ────────────────────────────────────────────────────────────
export const listSellerOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (!db.isConnected()) {
      return res.json([]);
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId } });
    const vendorId = vendorProfile?.id;

    const orders = await (prisma as any).order.findMany({
      where: {
        OR: [
          { sellerId: userId },
          ...(vendorId ? [{ vendorId }] : [])
        ]
      },
      include: { buyer: { select: { id: true, fullName: true, phone: true } }, orderItems: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) {
    console.warn('listSellerOrders fallback:', e);
    res.json([]);
  }
};

export const updateSellerOrderStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!db.isConnected()) {
      return res.json({ id, status, message: 'Status updated (dev mode)' });
    }

    const order = await (prisma as any).order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isSellerOwner = order.sellerId === userId || order.vendorId === userId;
    if (!isAdmin && !isSellerOwner) {
      return res.status(403).json({ error: 'Forbidden: You do not own this order' });
    }

    const updated = await (prisma as any).order.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (e: any) {
    console.warn('updateSellerOrderStatus fallback:', e);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// ── Verification ──────────────────────────────────────────────────────

// Helper to log admin actions
const createAuditLog = async (adminId: string, action: string, vendorId: string, details: string) => {
  try {
    if (db.isConnected()) {
      await (prisma as any).auditLog?.create({
        data: {
          adminId,
          action,
          targetId: vendorId,
          details,
          timestamp: new Date()
        }
      });
    }
    console.log(`[AUDIT LOG] Admin: ${adminId}, Action: ${action}, Vendor: ${vendorId}, Details: ${details}`);
  } catch (e) {
    console.error('Audit log failed:', e);
  }
};

export const submitSellerVerification = async (req: Request, res: Response) => {
  try {
    const sellerId = sessionUserId(req);
    if (!sellerId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Verification was not submitted.' });
    }
    const { documents, businessName, tradeLicense, nid } = req.body || {};
    const result = await (prisma as any).sellerVerification?.create({
      data: { documents, businessName, tradeLicense, nid, sellerId, status: 'pending' },
    });
    res.status(201).json(result || { message: 'Submitted', sellerId });
  } catch (e) {
    console.warn('submitSellerVerification error:', e);
    res.status(500).json({ error: 'Failed to submit verification' });
  }
};

// ── Pending Vendors Management (Admin Approval API) ───────────────────
export interface PendingVendorApplication {
  id: string;
  storeName: string;
  vendorName: string;
  phone: string;
  email: string;
  role: string;
  tradeLicenseNo: string;
  nidNumber: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export let pendingVendorsList: PendingVendorApplication[] = [
  {
    id: 'pv-01',
    storeName: 'সিল্ক সিটি ফ্যাশন হাউস (Rajshahi Silk)',
    vendorName: 'মোহাম্মদ তারেক রহমান',
    phone: '01711-892341',
    email: 'tarek.silk@gmail.com',
    role: 'Wholesale Manufacturer',
    tradeLicenseNo: 'TRAD/DSCC/092144/2024',
    nidNumber: '1989269410023412',
    category: 'Fashion & Textile',
    status: 'pending',
    submittedAt: '২০২৪-১০-০৯, ১০:৩০ AM'
  },
  {
    id: 'pv-02',
    storeName: 'মেঘনা অর্গানিক এগ্রো ফার্মস',
    vendorName: 'আব্দুল করিম পাটোয়ারী',
    phone: '01823-456789',
    email: 'karim.meghna@gmail.com',
    role: 'Rural Producer / Supplier',
    tradeLicenseNo: 'TRAD/CC/2023/11890',
    nidNumber: '1984261102938475',
    category: 'Agriculture & Groceries',
    status: 'pending',
    submittedAt: '২০২৪-১০-১০, ০২:১৫ PM'
  },
  {
    id: 'pv-03',
    storeName: 'চায়না টেক ইলেক্ট্রনিক্স হাব',
    vendorName: 'জহিরুল ইসলাম',
    phone: '01912-334455',
    email: 'zahir.tech@yahoo.com',
    role: 'Importer / Wholesaler',
    tradeLicenseNo: 'TRAD/DNCC/081293/2023',
    nidNumber: '1992261993029182',
    category: 'Consumer Electronics',
    status: 'pending',
    submittedAt: '২০২৪-১০-১০, ০৪:৫০ PM'
  }
];

export const getPendingVendors = async (req: Request, res: Response) => {
  try {
    if (db.isConnected()) {
      try {
        const dbVendors = await (prisma as any).vendorProfile.findMany({
          where: { isVerified: false },
          include: { user: true }
        });
        if (dbVendors && dbVendors.length > 0) {
          const mapped: PendingVendorApplication[] = dbVendors.map((v: any) => ({
            id: v.id,
            storeName: v.shopName || 'নতুন স্টোর',
            vendorName: v.user?.fullName || 'সেলার',
            phone: v.user?.phone || '০১৭০০-০০০০০০',
            email: v.user?.email || '',
            role: 'Registered Seller',
            tradeLicenseNo: v.tradeLicense || 'TRAD/2024/N-A',
            nidNumber: v.nidNumber || 'NID-N-A',
            category: 'General Merchant',
            status: 'pending',
            submittedAt: v.createdAt ? new Date(v.createdAt).toLocaleDateString('bn-BD') : 'আজ'
          }));
          return res.json(mapped);
        }
      } catch (err) {
        console.warn('Database vendorProfile query fallback:', err);
      }
    }

    const { status } = req.query;
    if (status && typeof status === 'string') {
      return res.json(pendingVendorsList.filter(v => v.status === status));
    }
    res.json(pendingVendorsList);
  } catch (error) {
    console.error('getPendingVendors error:', error);
    res.status(500).json({ error: 'Failed to fetch pending vendors' });
  }
};

export const approveVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id || 'admin-system';
    if (db.isConnected()) {
      try {
        await (prisma as any).vendorProfile.update({
          where: { id },
          data: { isVerified: true }
        });
      } catch (err) {
        console.warn('DB approve vendor fallback:', err);
      }
    }
    
    await createAuditLog(adminId, 'APPROVE_VENDOR', id, 'Vendor registration request approved');

    const target = pendingVendorsList.find(v => v.id === id);
    if (target) {
      target.status = 'approved';
      target.reviewedAt = new Date().toISOString();
      return res.json({ success: true, message: 'ভেন্ডর অনুমোদন সম্পন্ন হয়েছে!', vendor: target });
    }

    res.json({ success: true, message: 'Vendor approved (dev fallback)', id, status: 'approved' });
  } catch (error) {
    console.error('approveVendor error:', error);
    res.status(500).json({ error: 'Failed to approve vendor' });
  }
};

export const rejectVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};
    const adminId = (req as any).user?.id || 'admin-system';
    
    if (db.isConnected()) {
      try {
        await (prisma as any).vendorProfile.update({
          where: { id },
          data: { isVerified: false }
        });
      } catch (err) {
        console.warn('DB reject vendor fallback:', err);
      }
    }

    await createAuditLog(adminId, 'REJECT_VENDOR', id, `Vendor application rejected. Reason: ${reason || 'No reason provided'}`);

    const target = pendingVendorsList.find(v => v.id === id);
    if (target) {
      target.status = 'rejected';
      target.reviewedAt = new Date().toISOString();
      target.notes = reason || 'অসম্পূর্ণ কাগজপত্র বা তথ্যের অমিল';
      return res.json({ success: true, message: 'ভেন্ডর আবেদন বাতিল করা হয়েছে', vendor: target, reason });
    }

    res.json({ success: true, message: 'Vendor rejected (dev fallback)', id, status: 'rejected', reason });
  } catch (error) {
    console.error('rejectVendor error:', error);
    res.status(500).json({ error: 'Failed to reject vendor' });
  }
};

