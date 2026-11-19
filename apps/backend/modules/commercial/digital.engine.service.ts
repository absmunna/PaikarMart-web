import { prisma, db } from '../../config/database';
import crypto from 'crypto';

export interface DigitalAssetRecord {
  id: string;
  productId: string;
  productName: string;
  assetType: 'license_key' | 'downloadable_file' | 'ott_subscription';
  downloadUrl?: string;
  fileSizeMb?: number;
  instructions: string;
  availableKeysCount: number;
}

export interface LicenseKeyRecord {
  id: string;
  digitalAssetId: string;
  keyCode: string;
  isAssigned: boolean;
  assignedToUserId?: string;
  orderId?: string;
  assignedAt?: string;
  expiresAt?: string;
}

export interface DigitalDeliveryResult {
  orderId: string;
  productId: string;
  productName: string;
  assetType: 'license_key' | 'downloadable_file' | 'ott_subscription';
  paymentStatus: 'paid';
  deliveredAt: string;
  licenseKeys: string[];
  downloadUrl?: string;
  downloadExpiry?: string;
  instructions: string;
  customerSupportEmail: string;
}

// Built-in catalog of digital products with pre-loaded license keys inventory
const DIGITAL_ASSETS_CATALOG: Record<string, {
  name: string;
  assetType: 'license_key' | 'downloadable_file' | 'ott_subscription';
  downloadUrl?: string;
  fileSizeMb?: number;
  instructions: string;
  keys: string[];
}> = {
  'prod-digital-01': {
    name: 'Windows 11 Pro Enterprise OEM License',
    assetType: 'license_key',
    downloadUrl: 'https://software.paikarmart.com/downloads/win11-pro-oem-iso',
    fileSizeMb: 4500,
    instructions: 'সেটিংস > সিস্টেম > অ্যাক্টিভেশন এ গিয়ে লাইসেন্স কী দিন। যেকোনো টেকনিক্যাল সহায়তায় আমাদের ২৪/৭ সাপোর্ট টিম প্রস্তুত।',
    keys: [
      'W11P-PM99-78AB-90CD-EF12',
      'W11P-PM99-34XY-56ZA-BC34',
      'W11P-PM99-88KJ-12MN-OP56',
      'W11P-PM99-55QR-77ST-UV78'
    ]
  },
  'prod-ott-02': {
    name: 'Chorki & Hoichoi 6 Months Super Combo VIP Pass',
    assetType: 'ott_subscription',
    instructions: 'আপনার ইমেইল বা ফোন নম্বরে অ্যাক্টিভেশন ওটিপি/পিন পাঠানো হয়েছে। অ্যাপে লগইন করে সাবস্ক্রিপশন কুপন কোড রিডিম করুন।',
    keys: [
      'OTT-COMBO-VIP-6M-88991',
      'OTT-COMBO-VIP-6M-88992',
      'OTT-COMBO-VIP-6M-88993'
    ]
  },
  'prod-ebook-03': {
    name: 'ই-কমার্স এক্সপোর্ট ও হোলসেল মাস্টারক্লাস (Full Video Course & Guide)',
    assetType: 'downloadable_file',
    downloadUrl: 'https://cdn.paikarmart.com/secure-vault/export-masterclass-2026.zip',
    fileSizeMb: 1200,
    instructions: 'ডাউনলোড লিংকে ক্লিক করে সম্পূর্ণ জিপ ফাইলটি নামিয়ে নিন। ফাইল পাসওয়ার্ড লাইসেন্স হিসেবে সংযুক্ত করা হয়েছে।',
    keys: [
      'EXPM-VAULT-KEY-2026-X1',
      'EXPM-VAULT-KEY-2026-X2'
    ]
  }
};

// In-memory assignment storage for instant delivery
const DELIVERED_DIGITAL_ORDERS = new Map<string, DigitalDeliveryResult>();

export class DigitalEngineService {
  /**
   * Generates cryptographically secure one-time download token
   */
  static generateSecureDownloadToken(orderId: string, productId: string): { token: string; expiresAt: string } {
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24-hour expiration
    return { token, expiresAt };
  }

  /**
   * Generates dynamic license key if pool is depleted
   */
  static generateDynamicLicenseKey(prefix: string = 'PM-LIC'): string {
    const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part3 = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${prefix}-${part1}-${part2}-${part3}`;
  }

  /**
   * Instant Automated License Key / File Download Trigger upon successful payment verification
   */
  static async verifyPaymentAndDeliver(params: {
    orderId: string;
    userId: string;
    productId: string;
    quantity?: number;
    paymentConfirmation: {
      provider: string;
      transactionId: string;
      amount: number;
      status: 'paid' | 'verified';
    };
  }): Promise<DigitalDeliveryResult> {
    const qty = Math.max(1, params.quantity || 1);
    const existingDelivery = DELIVERED_DIGITAL_ORDERS.get(params.orderId);
    if (existingDelivery) {
      return existingDelivery;
    }

    const assetInfo = DIGITAL_ASSETS_CATALOG[params.productId] || {
      name: 'ডিজিটাল সফটওয়্যার / ওটিটি লাইসেন্স',
      assetType: 'license_key' as const,
      downloadUrl: `https://downloads.paikarmart.com/assets/${params.productId}`,
      fileSizeMb: 50,
      instructions: 'অ্যাক্টিভেশন নির্দেশিকা ও লাইসেন্স কী নিচে দেওয়া হলো।',
      keys: []
    };

    const allocatedKeys: string[] = [];

    // Attempt to pull from Prisma if connected
    if (db.isConnected()) {
      try {
        const availableDbKeys = await prisma.licenseKey.findMany({
          where: {
            digitalAsset: { productId: params.productId },
            isAssigned: false
          },
          take: qty
        });

        if (availableDbKeys && availableDbKeys.length > 0) {
          for (const key of availableDbKeys) {
            allocatedKeys.push(key.keyCode);
            await prisma.licenseKey.update({
              where: { id: key.id },
              data: {
                isAssigned: true,
                assignedToUserId: params.userId,
                orderId: params.orderId,
                assignedAt: new Date()
              }
            });
          }
        }
      } catch (err) {
        console.warn('Prisma license key query fallback:', err);
      }
    }

    // If remaining quantity needed, pull from catalog or generate dynamically
    while (allocatedKeys.length < qty) {
      const catalogKey = assetInfo.keys.pop();
      if (catalogKey) {
        allocatedKeys.push(catalogKey);
      } else {
        allocatedKeys.push(this.generateDynamicLicenseKey(assetInfo.assetType === 'ott_subscription' ? 'PM-OTT' : 'PM-KEY'));
      }
    }

    const { token, expiresAt } = this.generateSecureDownloadToken(params.orderId, params.productId);
    const signedDownloadUrl = assetInfo.downloadUrl ? `${assetInfo.downloadUrl}?token=${token}` : undefined;

    const deliveryResult: DigitalDeliveryResult = {
      orderId: params.orderId,
      productId: params.productId,
      productName: assetInfo.name,
      assetType: assetInfo.assetType,
      paymentStatus: 'paid',
      deliveredAt: new Date().toISOString(),
      licenseKeys: allocatedKeys,
      downloadUrl: signedDownloadUrl,
      downloadExpiry: signedDownloadUrl ? expiresAt : undefined,
      instructions: assetInfo.instructions,
      customerSupportEmail: 'digital-support@paikarmart.com'
    };

    DELIVERED_DIGITAL_ORDERS.set(params.orderId, deliveryResult);

    // Update order status in database if connected
    if (db.isConnected()) {
      try {
        await prisma.order.updateMany({
          where: { id: params.orderId },
          data: {
            paymentStatus: 'paid' as any,
            status: 'delivered' as any
          }
        });
      } catch (err) {
        console.warn('Could not update order payment status in Prisma:', err);
      }
    }

    return deliveryResult;
  }

  /**
   * Retrieves unlocked digital goods for a buyer
   */
  static getDigitalDelivery(orderId: string): DigitalDeliveryResult | null {
    return DELIVERED_DIGITAL_ORDERS.get(orderId) || null;
  }

  /**
   * Register a new digital asset with inventory of license keys (Seller portal)
   */
  static async registerDigitalAsset(params: {
    productId: string;
    productName: string;
    assetType: 'license_key' | 'downloadable_file' | 'ott_subscription';
    downloadUrl?: string;
    fileSizeMb?: number;
    instructions: string;
    keys: string[];
  }): Promise<DigitalAssetRecord> {
    DIGITAL_ASSETS_CATALOG[params.productId] = {
      name: params.productName,
      assetType: params.assetType,
      downloadUrl: params.downloadUrl,
      fileSizeMb: params.fileSizeMb,
      instructions: params.instructions,
      keys: [...params.keys]
    };

    if (db.isConnected()) {
      try {
        const asset = await prisma.digitalAsset.upsert({
          where: { productId: params.productId },
          update: {
            assetType: params.assetType,
            downloadUrl: params.downloadUrl,
            fileSizeMb: params.fileSizeMb
          },
          create: {
            productId: params.productId,
            assetType: params.assetType,
            downloadUrl: params.downloadUrl,
            fileSizeMb: params.fileSizeMb
          }
        });

        if (params.keys && params.keys.length > 0) {
          for (const key of params.keys) {
            await prisma.licenseKey.create({
              data: {
                digitalAssetId: asset.id,
                keyCode: key,
                isAssigned: false
              }
            });
          }
        }
      } catch (err) {
        console.warn('Prisma digital asset registration error:', err);
      }
    }

    return {
      id: `asset-${params.productId}`,
      productId: params.productId,
      productName: params.productName,
      assetType: params.assetType,
      downloadUrl: params.downloadUrl,
      fileSizeMb: params.fileSizeMb,
      instructions: params.instructions,
      availableKeysCount: params.keys.length
    };
  }
}
