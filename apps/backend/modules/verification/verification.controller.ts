import { Request, Response } from 'express';
import { prisma } from '../../config/database';

interface VerificationDoc {
  id: string;
  userId: string;
  userName: string;
  requestedRole: string;
  documentType: string;
  documentUrls: string[];
  nidNumber?: string;
  tradeLicenseNo?: string;
  drivingLicenseNo?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback if database connection is pending
const inMemoryVerifications: VerificationDoc[] = [
  {
    id: 'ver-demo-1',
    userId: 'user-demo-seller',
    userName: 'আব্দুল করিম (Karim Textiles)',
    requestedRole: 'seller',
    documentType: 'trade_license',
    documentUrls: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'],
    tradeLicenseNo: 'TR-DHK-2024-9841',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ver-demo-2',
    userId: 'user-demo-rider',
    userName: 'সাইফুল ইসলাম (Express Rider)',
    requestedRole: 'rider',
    documentType: 'driving_license',
    documentUrls: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'],
    drivingLicenseNo: 'DL-BRTA-7654321',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Submit document verification request
export const submitVerification = async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      userName,
      requestedRole, 
      documentType, 
      documentUrls, 
      nidNumber, 
      tradeLicenseNo, 
      drivingLicenseNo 
    } = req.body;

    if (!userId || !requestedRole || !documentType) {
      return res.status(400).json({ 
        error: 'userId, requestedRole, and documentType are required' 
      });
    }

    try {
      const created = await prisma.userVerification.create({
        data: {
          userId,
          requestedRole: requestedRole as any,
          documentType,
          documentUrls: Array.isArray(documentUrls) ? documentUrls : [],
          nidNumber,
          tradeLicenseNo,
          drivingLicenseNo,
          status: 'pending'
        }
      });
      return res.status(201).json({ success: true, verification: created });
    } catch {
      // In-memory fallback
      const newVer: VerificationDoc = {
        id: `ver-${Date.now()}`,
        userId,
        userName: userName || 'User',
        requestedRole,
        documentType,
        documentUrls: Array.isArray(documentUrls) ? documentUrls : [],
        nidNumber,
        tradeLicenseNo,
        drivingLicenseNo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryVerifications.unshift(newVer);
      return res.status(201).json({ success: true, verification: newVer });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Verification submission failed' });
  }
};

// Get current user's verification status
export const getUserVerificationStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    try {
      const records = await prisma.userVerification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return res.json({ verifications: records });
    } catch {
      const userRecords = inMemoryVerifications.filter(v => v.userId === userId);
      return res.json({ verifications: userRecords });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve verification records' });
  }
};

// Admin: list all pending verifications
export const getPendingVerifications = async (_req: Request, res: Response) => {
  try {
    try {
      const pending = await prisma.userVerification.findMany({
        where: { status: 'pending' },
        include: { user: true },
        orderBy: { createdAt: 'asc' }
      });
      return res.json({ verifications: pending });
    } catch {
      return res.json({ verifications: inMemoryVerifications.filter(v => v.status === 'pending') });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to list pending verifications' });
  }
};

// Admin: approve or reject verification
export const reviewVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // action: "approve" | "reject"

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ error: 'Action must be approve or reject' });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    try {
      const updated = await prisma.userVerification.update({
        where: { id },
        data: {
          status: newStatus,
          rejectionReason: action === 'reject' ? rejectionReason : null
        }
      });

      // If approved, promote user role
      if (action === 'approve') {
        await prisma.user.update({
          where: { id: updated.userId },
          data: { role: updated.requestedRole }
        });
      }

      return res.json({ success: true, verification: updated });
    } catch {
      const target = inMemoryVerifications.find(v => v.id === id);
      if (!target) {
        return res.status(404).json({ error: 'Verification record not found' });
      }
      target.status = newStatus;
      if (action === 'reject') target.rejectionReason = rejectionReason;
      return res.json({ success: true, verification: target });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to review verification' });
  }
};
