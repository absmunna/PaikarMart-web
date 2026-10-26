import { Request, Response } from 'express';
import { CommercialPricingService } from './commercial.pricing.service';
import { HyperlocalEngineService } from './hyperlocal.engine.service';
import { LogisticsAllocationService } from './logistics.allocation.service';
import { DigitalEngineService } from './digital.engine.service';

export class CommercialController {
  // ----------------------------------------------------
  // 1. B2C Retail & B2B Wholesale Logic (Tiered Pricing & MOQ)
  // ----------------------------------------------------
  static async calculateTieredPricing(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }

      const qty = parseInt(quantity || 1, 10);
      const result = await CommercialPricingService.calculateTieredPricing(productId, qty);

      if (!result.isMoqMet) {
        return res.status(400).json({
          status: 'error',
          error: 'MOQ_VIOLATION',
          message: `নূন্যতম অর্ডার পরিমাণ (MOQ) আবশ্যক: ${result.moq} টি। আপনার সিলেক্টেড পরিমাণ: ${qty} টি।`,
          data: result
        });
      }

      res.json({
        status: 'success',
        data: result
      });
    } catch (error: any) {
      console.error('Calculate Tiered Pricing Error:', error);
      res.status(500).json({ error: error.message || 'Failed to calculate pricing' });
    }
  }

  static async getProductTiers(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const tiers = await CommercialPricingService.getProductTiers(productId);
      res.json({
        status: 'success',
        data: tiers
      });
    } catch (error: any) {
      console.error('Get Product Tiers Error:', error);
      res.status(500).json({ error: error.message || 'Failed to get tiers' });
    }
  }

  static async validateCartMoq(req: Request, res: Response) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items array is required' });
      }

      const validation = await CommercialPricingService.validateCartItems(items);
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          error: 'MOQ_VALIDATION_FAILED',
          violations: validation.violations,
          data: validation
        });
      }

      res.json({
        status: 'success',
        data: validation
      });
    } catch (error: any) {
      console.error('Validate Cart MOQ Error:', error);
      res.status(500).json({ error: error.message || 'Cart validation failed' });
    }
  }

  // ----------------------------------------------------
  // 2. Hyperlocal / Nearby Stores Logic (Geofence & Instant ETA)
  // ----------------------------------------------------
  static async checkStoreGeofence(req: Request, res: Response) {
    try {
      const { storeId, latitude, longitude } = req.body;
      if (!storeId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'storeId, latitude, and longitude are required' });
      }

      const result = await HyperlocalEngineService.checkGeofence(storeId, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error: any) {
      console.error('Geofence check error:', error);
      res.status(500).json({ error: error.message || 'Geofence check failed' });
    }
  }

  static async getNearbyStores(req: Request, res: Response) {
    try {
      const { lat, lng, radius, category, storeType, openOnly } = req.query;

      const userLat = lat ? parseFloat(lat as string) : 23.8103;
      const userLng = lng ? parseFloat(lng as string) : 90.4125;
      const maxRadiusKm = radius ? parseFloat(radius as string) : 5.0; // 5km GPS Geofence default

      const result = await HyperlocalEngineService.getNearbyStores(
        { latitude: userLat, longitude: userLng },
        {
          maxRadiusKm,
          category: category as string,
          storeType: storeType as string,
          openOnly: openOnly === 'true'
        }
      );

      res.json({
        status: 'success',
        ...result
      });
    } catch (error: any) {
      console.error('Nearby stores error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch nearby stores' });
    }
  }

  static async toggleStoreStatus(req: Request, res: Response) {
    try {
      const { storeId } = req.params;
      const { isOpen } = req.body;

      if (isOpen === undefined) {
        return res.status(400).json({ error: 'isOpen boolean is required' });
      }

      const result = await HyperlocalEngineService.toggleStoreStatus(storeId, !!isOpen);
      res.json({
        status: 'success',
        data: result
      });
    } catch (error: any) {
      console.error('Toggle store status error:', error);
      res.status(500).json({ error: error.message || 'Failed to toggle status' });
    }
  }

  // ----------------------------------------------------
  // 3. Logistics & Service Providers (Instant vs Scheduled Slot & Rider Engine)
  // ----------------------------------------------------
  static async allocateRider(req: Request, res: Response) {
    try {
      const {
        orderId,
        storeId,
        pickupLat,
        pickupLng,
        deliveryLat,
        deliveryLng,
        dispatchType,
        scheduledSlot
      } = req.body;

      if (!orderId || pickupLat === undefined || pickupLng === undefined) {
        return res.status(400).json({ error: 'orderId, pickupLat, and pickupLng are required' });
      }

      const assignment = await LogisticsAllocationService.allocateRiderForOrder({
        orderId,
        storeId,
        pickupLat: parseFloat(pickupLat),
        pickupLng: parseFloat(pickupLng),
        deliveryLat: deliveryLat ? parseFloat(deliveryLat) : 23.8103,
        deliveryLng: deliveryLng ? parseFloat(deliveryLng) : 90.4125,
        dispatchType: dispatchType === 'scheduled' ? 'scheduled' : 'instant',
        scheduledSlot
      });

      res.status(201).json({
        status: 'success',
        data: assignment
      });
    } catch (error: any) {
      console.error('Rider allocation error:', error);
      res.status(500).json({ error: error.message || 'Rider allocation failed' });
    }
  }

  static async bookService(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string || (req as any).user?.id || 'dev-user-01';
      const {
        serviceType,
        dispatchType,
        scheduledTime,
        pickupAddress,
        pickupLat,
        pickupLng,
        deliveryAddress
      } = req.body;

      if (!serviceType || !pickupAddress) {
        return res.status(400).json({ error: 'serviceType and pickupAddress are required' });
      }

      const booking = await LogisticsAllocationService.bookService({
        userId,
        serviceType,
        dispatchType: dispatchType === 'scheduled' ? 'scheduled' : 'instant',
        scheduledTime,
        pickupAddress,
        pickupLat: pickupLat ? parseFloat(pickupLat) : 23.8103,
        pickupLng: pickupLng ? parseFloat(pickupLng) : 90.4125,
        deliveryAddress
      });

      res.status(201).json({
        status: 'success',
        data: booking
      });
    } catch (error: any) {
      console.error('Book service error:', error);
      res.status(500).json({ error: error.message || 'Service booking failed' });
    }
  }

  static async updateRiderStatus(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'status is required' });
      }

      const updated = await LogisticsAllocationService.updateRiderStatus(assignmentId, status);
      res.json({
        status: 'success',
        data: updated
      });
    } catch (error: any) {
      console.error('Update rider status error:', error);
      res.status(500).json({ error: error.message || 'Status update failed' });
    }
  }

  static async getAvailableRiders(req: Request, res: Response) {
    try {
      const { lat, lng, type, radius } = req.query;
      const userLat = lat ? parseFloat(lat as string) : 23.8103;
      const userLng = lng ? parseFloat(lng as string) : 90.4125;
      const maxRadius = radius ? parseFloat(radius as string) : 8.0;

      const riders = LogisticsAllocationService.findNearbyRiders(
        userLat,
        userLng,
        type as string,
        maxRadius
      );

      res.json({
        status: 'success',
        data: riders,
        count: riders.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to query riders' });
    }
  }

  // ----------------------------------------------------
  // 4. Digital Goods & OTT Content Engine (Instant Automated Delivery)
  // ----------------------------------------------------
  static async verifyAndDeliverDigital(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string || (req as any).user?.id || 'dev-buyer-01';
      const { orderId, productId, quantity, transactionId, amount, provider } = req.body;

      if (!orderId || !productId) {
        return res.status(400).json({ error: 'orderId and productId are required' });
      }

      const delivery = await DigitalEngineService.verifyPaymentAndDeliver({
        orderId,
        userId,
        productId,
        quantity: quantity ? parseInt(quantity, 10) : 1,
        paymentConfirmation: {
          provider: provider || 'bKash Escrow',
          transactionId: transactionId || `TXN-${Date.now().toString().slice(-8)}`,
          amount: amount || 1450,
          status: 'paid'
        }
      });

      res.status(200).json({
        status: 'success',
        message: 'পেমেন্ট সফলভাবে ভেরিফায়েড হয়েছে। ডিজিটাল লাইসেন্স কী ও ডাউনলোড অ্যাক্সেস সাথে সাথে আনলক করা হয়েছে।',
        data: delivery
      });
    } catch (error: any) {
      console.error('Digital delivery error:', error);
      res.status(500).json({ error: error.message || 'Digital delivery failed' });
    }
  }

  static async getDigitalDelivery(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const delivery = DigitalEngineService.getDigitalDelivery(orderId);

      if (!delivery) {
        // Fallback demo delivery for instant preview
        const demoDelivery = await DigitalEngineService.verifyPaymentAndDeliver({
          orderId,
          userId: 'dev-buyer-01',
          productId: 'prod-digital-01',
          quantity: 1,
          paymentConfirmation: {
            provider: 'bKash',
            transactionId: 'TXN-DEMO-PAID',
            amount: 1450,
            status: 'paid'
          }
        });
        return res.json({ status: 'success', data: demoDelivery });
      }

      res.json({
        status: 'success',
        data: delivery
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch digital delivery' });
    }
  }

  static async registerDigitalAsset(req: Request, res: Response) {
    try {
      const { productId, productName, assetType, downloadUrl, fileSizeMb, instructions, keys } = req.body;

      if (!productId || !productName || !assetType) {
        return res.status(400).json({ error: 'productId, productName, and assetType are required' });
      }

      const asset = await DigitalEngineService.registerDigitalAsset({
        productId,
        productName,
        assetType,
        downloadUrl,
        fileSizeMb,
        instructions: instructions || 'লাইসেন্স অ্যাক্টিভেশন নির্দেশনা।',
        keys: Array.isArray(keys) ? keys : []
      });

      res.status(201).json({
        status: 'success',
        data: asset
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to register digital asset' });
    }
  }

  // ----------------------------------------------------
  // 5. Six Commercial Portals Overview & Navigation Data
  // ----------------------------------------------------
  static async getCommercialPortalsHub(req: Request, res: Response) {
    const portals = [
      {
        id: 'b2c_retail',
        name: 'B2C রিটেল শপিং',
        subtitle: 'দেশসেরা ভেরিফাইড ব্র‍্যান্ড ও খুচরা মার্কেটপ্লেস',
        moqSupported: false,
        tieredPricingEnabled: true,
        instantDelivery: false,
        activeSellersCount: 4200,
        activeProductsCount: 89000,
        gradient: 'from-amber-500 to-orange-600'
      },
      {
        id: 'b2b_wholesale',
        name: 'B2B পাইকারি মহাজন হাব',
        subtitle: 'ফ্যাক্টরি ডিরেক্ট বাল্ক প্রাইসিং ও টায়ার্ড ডিসকাউন্ট (MOQ ভিত্তিক)',
        moqSupported: true,
        tieredPricingEnabled: true,
        instantDelivery: false,
        activeSellersCount: 1850,
        activeProductsCount: 34000,
        gradient: 'from-blue-600 to-indigo-700'
      },
      {
        id: 'hyperlocal_nearby',
        name: 'হাইপারলোকাল নিয়ারবাই স্টোর',
        subtitle: '৫ কিমি জিপিএস জিওফেন্সিং ও ১৫-৩০ মিনিটে ইনস্ট্যান্ট ডেলিভারি',
        moqSupported: false,
        tieredPricingEnabled: false,
        instantDelivery: true,
        activeSellersCount: 3100,
        activeProductsCount: 22000,
        gradient: 'from-emerald-500 to-teal-700'
      },
      {
        id: 'logistics_services',
        name: 'লজিস্টিকস ও টেকনিশিয়ান সার্ভিস',
        subtitle: 'ইনস্ট্যান্ট রাইডার ডিসপ্যাচ ও শিডিউল স্লট বুকিং ইঞ্জিন',
        moqSupported: false,
        tieredPricingEnabled: false,
        instantDelivery: true,
        activeSellersCount: 5600,
        activeProductsCount: 120,
        gradient: 'from-purple-600 to-pink-600'
      },
      {
        id: 'digital_ott',
        name: 'ডিজিটাল গুডস ও OTT কন্টেন্ট',
        subtitle: 'পেমেন্ট ভেরিফিকেশনে অটোমেটেড ইনস্ট্যান্ট লাইসেন্স ও ফাইল ডাউনলোড',
        moqSupported: false,
        tieredPricingEnabled: true,
        instantDelivery: true,
        activeSellersCount: 430,
        activeProductsCount: 2100,
        gradient: 'from-rose-500 to-red-600'
      },
      {
        id: 'export_import',
        name: 'এক্সপোর্ট ও ইম্পোর্ট হাব',
        subtitle: 'আন্তর্জাতিক বাল্ক ট্রেড, এলসি ও কাস্টমস ক্লিয়ারেন্স',
        moqSupported: true,
        tieredPricingEnabled: true,
        instantDelivery: false,
        activeSellersCount: 280,
        activeProductsCount: 4500,
        gradient: 'from-cyan-600 to-blue-800'
      }
    ];

    res.json({
      status: 'success',
      data: portals,
      totalPortals: portals.length
    });
  }
}
