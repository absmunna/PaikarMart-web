import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { prisma, db } from '../../config/database';
import {
  generateUniquePmin,
  recalculateBuyBox,
  sanitizeImageUrls,
  isSellerRole,
  pickBuyBoxWinner,
} from './catalog.service';

function dbOffline(res: Response) {
  return res.status(503).json({
    error: 'Catalog service is temporarily unavailable because the database is offline.',
  });
}

/** POST /api/v1/catalog/masters — create canonical master product (seller) */
export async function createMaster(req: AuthenticatedRequest, res: Response) {
  try {
    if (!db.isConnected()) return dbOffline(res);

    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !isSellerRole(user.role, user.isSeller)) {
      return res.status(403).json({ error: 'Only sellers can create catalog masters.' });
    }

    const {
      title,
      titleBn,
      brand,
      category,
      categoryId,
      description,
      canonicalImages,
      specifications,
      variantOptions,
      barcode,
      pmin: clientPmin,
    } = req.body || {};

    if (typeof title !== 'string' || title.trim().length < 2) {
      return res.status(400).json({ error: 'title is required (min 2 chars).' });
    }
    if (typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ error: 'category is required.' });
    }

    let pmin: string;
    if (typeof clientPmin === 'string' && /^PMIN-B[A-Z0-9]{8,16}$/i.test(clientPmin.trim())) {
      const taken = await prisma.masterProduct.findUnique({ where: { pmin: clientPmin.trim().toUpperCase() } });
      if (taken) return res.status(409).json({ error: 'PMIN already exists.' });
      pmin = clientPmin.trim().toUpperCase();
    } else {
      pmin = await generateUniquePmin();
    }

    if (barcode && typeof barcode === 'string') {
      const takenBarcode = await prisma.masterProduct.findUnique({ where: { barcode: barcode.trim() } });
      if (takenBarcode) return res.status(409).json({ error: 'Barcode already registered.' });
    }

    const master = await prisma.masterProduct.create({
      data: {
        pmin,
        barcode: typeof barcode === 'string' && barcode.trim() ? barcode.trim() : null,
        title: title.trim().slice(0, 300),
        titleBn: typeof titleBn === 'string' ? titleBn.trim().slice(0, 300) : null,
        brand: typeof brand === 'string' && brand.trim() ? brand.trim().slice(0, 120) : 'Generic',
        category: category.trim().slice(0, 120),
        categoryId: typeof categoryId === 'string' ? categoryId : null,
        description: typeof description === 'string' ? description.slice(0, 5000) : null,
        canonicalImages: sanitizeImageUrls(canonicalImages),
        specifications: specifications && typeof specifications === 'object' ? specifications : undefined,
        variantOptions: variantOptions && typeof variantOptions === 'object' ? variantOptions : undefined,
        createdById: userId,
      },
    });

    return res.status(201).json({ ok: true, master });
  } catch (err: any) {
    console.error('createMaster:', err);
    if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
      return res.status(503).json({
        error: 'Master catalog tables not applied yet. Run the add_master_catalog migration on Supabase.',
      });
    }
    return res.status(500).json({ error: 'Failed to create master product.' });
  }
}

/** POST /api/v1/catalog/offers — attach or upsert seller offer on a master */
export async function upsertOffer(req: AuthenticatedRequest, res: Response) {
  try {
    if (!db.isConnected()) return dbOffline(res);

    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendorProfile: true },
    });
    if (!user || !isSellerRole(user.role, user.isSeller)) {
      return res.status(403).json({ error: 'Only sellers can attach offers.' });
    }

    const {
      masterProductId,
      pmin,
      price,
      originalPrice,
      stock,
      moq,
      tradeMode,
      wholesaleTiers,
      sellerPhotos,
      deliveryEta,
      location,
      condition,
      fulfillmentType,
      shippingFee,
      isActive,
    } = req.body || {};

    if (price === undefined || Number(price) < 0) {
      return res.status(400).json({ error: 'Valid price is required.' });
    }

    let master =
      typeof masterProductId === 'string'
        ? await prisma.masterProduct.findUnique({ where: { id: masterProductId } })
        : null;

    if (!master && typeof pmin === 'string') {
      master = await prisma.masterProduct.findUnique({ where: { pmin: pmin.trim().toUpperCase() } });
    }

    if (!master) {
      return res.status(404).json({ error: 'Master product not found. Create master first or pass valid pmin.' });
    }

    const stockNum = stock === undefined ? 0 : Math.max(0, Math.floor(Number(stock)));
    const moqNum = moq === undefined ? 1 : Math.max(1, Math.floor(Number(moq)));

    const offer = await prisma.sellerOffer.upsert({
      where: {
        masterProductId_sellerId: {
          masterProductId: master.id,
          sellerId: userId,
        },
      },
      create: {
        masterProductId: master.id,
        sellerId: userId,
        vendorId: user.vendorProfile?.id ?? null,
        pmin: master.pmin,
        price: Number(price),
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : null,
        stock: stockNum,
        moq: moqNum,
        tradeMode: tradeMode === 'wholesale' ? 'wholesale' : 'retail',
        wholesaleTiers: wholesaleTiers && typeof wholesaleTiers === 'object' ? wholesaleTiers : undefined,
        sellerPhotos: sanitizeImageUrls(sellerPhotos, 8),
        deliveryEta: typeof deliveryEta === 'string' ? deliveryEta.slice(0, 80) : null,
        location: typeof location === 'string' ? location.slice(0, 120) : user.vendorProfile?.location ?? null,
        condition: typeof condition === 'string' ? condition.slice(0, 40) : 'New',
        fulfillmentType: typeof fulfillmentType === 'string' ? fulfillmentType.slice(0, 40) : 'seller_fulfilled',
        shippingFee: shippingFee !== undefined ? Math.max(0, Number(shippingFee)) : 0,
        isActive: isActive === false ? false : true,
      },
      update: {
        price: Number(price),
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : undefined,
        stock: stockNum,
        moq: moqNum,
        tradeMode: tradeMode === 'wholesale' ? 'wholesale' : tradeMode === 'retail' ? 'retail' : undefined,
        wholesaleTiers: wholesaleTiers && typeof wholesaleTiers === 'object' ? wholesaleTiers : undefined,
        sellerPhotos: sellerPhotos !== undefined ? sanitizeImageUrls(sellerPhotos, 8) : undefined,
        deliveryEta: typeof deliveryEta === 'string' ? deliveryEta.slice(0, 80) : undefined,
        location: typeof location === 'string' ? location.slice(0, 120) : undefined,
        condition: typeof condition === 'string' ? condition.slice(0, 40) : undefined,
        fulfillmentType: typeof fulfillmentType === 'string' ? fulfillmentType.slice(0, 40) : undefined,
        shippingFee: shippingFee !== undefined ? Math.max(0, Number(shippingFee)) : undefined,
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
        vendorId: user.vendorProfile?.id ?? undefined,
      },
    });

    const winnerId = await recalculateBuyBox(master.id);

    return res.status(201).json({
      ok: true,
      offer,
      buyBoxWinnerId: winnerId,
      master: { id: master.id, pmin: master.pmin, title: master.title },
    });
  } catch (err: any) {
    console.error('upsertOffer:', err);
    if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
      return res.status(503).json({
        error: 'Master catalog tables not applied yet. Run the add_master_catalog migration on Supabase.',
      });
    }
    return res.status(500).json({ error: 'Failed to save seller offer.' });
  }
}

/** GET /api/v1/catalog/pmin/:pmin — public master + offers + buy-box */
export async function getByPmin(req: AuthenticatedRequest, res: Response) {
  try {
    if (!db.isConnected()) return dbOffline(res);

    const pmin = String(req.params.pmin || '').trim().toUpperCase();
    if (!pmin) return res.status(400).json({ error: 'pmin is required.' });

    const master = await prisma.masterProduct.findUnique({
      where: { pmin },
      include: {
        offers: {
          where: { isActive: true },
          orderBy: [{ isBuyBoxWinner: 'desc' }, { price: 'asc' }],
          include: {
            seller: { select: { id: true, name: true, fullName: true, handle: true, avatarUrl: true } },
            vendor: { select: { id: true, shopName: true, location: true, isVerified: true } },
          },
        },
      },
    });

    if (!master) return res.status(404).json({ error: 'Catalog item not found.' });

    const winner = pickBuyBoxWinner(master.offers as any[]);

    return res.json({
      ok: true,
      master: {
        id: master.id,
        pmin: master.pmin,
        title: master.title,
        titleBn: master.titleBn,
        brand: master.brand,
        category: master.category,
        description: master.description,
        canonicalImages: master.canonicalImages,
        specifications: master.specifications,
        isVerified: master.isVerified,
      },
      offers: master.offers.map((o: any) => ({
        id: o.id,
        price: o.price,
        originalPrice: o.originalPrice,
        stock: o.stock,
        moq: o.moq,
        tradeMode: o.tradeMode,
        wholesaleTiers: o.wholesaleTiers,
        shippingFee: o.shippingFee,
        deliveryEta: o.deliveryEta,
        location: o.location,
        condition: o.condition,
        isBuyBoxWinner: o.isBuyBoxWinner,
        seller: o.seller,
        vendor: o.vendor,
      })),
      buyBox: winner
        ? {
            offerId: winner.id,
            price: winner.price,
            stock: winner.stock,
            sellerId: winner.sellerId,
          }
        : null,
      offerCount: master.offers.length,
    });
  } catch (err: any) {
    console.error('getByPmin:', err);
    if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
      return res.status(503).json({
        error: 'Master catalog tables not applied yet. Run the add_master_catalog migration on Supabase.',
      });
    }
    return res.status(500).json({ error: 'Failed to load catalog item.' });
  }
}

/** GET /api/v1/catalog/search?q=&category=&limit= */
export async function searchCatalog(req: AuthenticatedRequest, res: Response) {
  try {
    if (!db.isConnected()) return dbOffline(res);

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '20'), 10) || 20));

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { titleBn: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { pmin: { contains: q.toUpperCase(), mode: 'insensitive' } },
      ];
    }
    if (category) where.category = { equals: category, mode: 'insensitive' };

    const items = await prisma.masterProduct.findMany({
      where,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        offers: {
          where: { isActive: true, isBuyBoxWinner: true },
          take: 1,
          select: { id: true, price: true, stock: true, shippingFee: true },
        },
        _count: { select: { offers: true } },
      },
    });

    return res.json({
      ok: true,
      items: items.map((m: any) => ({
        id: m.id,
        pmin: m.pmin,
        title: m.title,
        titleBn: m.titleBn,
        brand: m.brand,
        category: m.category,
        image: m.canonicalImages?.[0] || null,
        buyBoxPrice: m.offers[0]?.price ?? null,
        offerCount: m._count.offers,
        isVerified: m.isVerified,
      })),
      count: items.length,
    });
  } catch (err: any) {
    console.error('searchCatalog:', err);
    if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
      return res.status(503).json({
        error: 'Master catalog tables not applied yet. Run the add_master_catalog migration on Supabase.',
      });
    }
    return res.status(500).json({ error: 'Catalog search failed.' });
  }
}

/** POST /api/v1/catalog/pmin/:pmin/buy-box — force recalc */
export async function recalcBuyBox(req: AuthenticatedRequest, res: Response) {
  try {
    if (!db.isConnected()) return dbOffline(res);

    const pmin = String(req.params.pmin || '').trim().toUpperCase();
    const master = await prisma.masterProduct.findUnique({ where: { pmin } });
    if (!master) return res.status(404).json({ error: 'Not found.' });

    const winnerId = await recalculateBuyBox(master.id);
    return res.json({ ok: true, pmin, buyBoxWinnerId: winnerId });
  } catch (err: any) {
    console.error('recalcBuyBox:', err);
    return res.status(500).json({ error: 'Buy-box recalculation failed.' });
  }
}

/** PATCH /api/v1/catalog/offers/:id — owner update */
export async function patchOffer(req: AuthenticatedRequest, res: Response) {
  try {
    if (!db.isConnected()) return dbOffline(res);

    const userId = req.user!.id;
    const id = String(req.params.id || '');
    const existing = await prisma.sellerOffer.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Offer not found.' });
    if (existing.sellerId !== userId && !['admin', 'super_admin'].includes((req.user?.role || '').toLowerCase())) {
      return res.status(403).json({ error: 'Not your offer.' });
    }

    const {
      price,
      originalPrice,
      stock,
      moq,
      tradeMode,
      wholesaleTiers,
      sellerPhotos,
      deliveryEta,
      location,
      condition,
      fulfillmentType,
      shippingFee,
      isActive,
    } = req.body || {};

    const data: any = {};
    if (price !== undefined) data.price = Number(price);
    if (originalPrice !== undefined) data.originalPrice = Number(originalPrice);
    if (stock !== undefined) data.stock = Math.max(0, Math.floor(Number(stock)));
    if (moq !== undefined) data.moq = Math.max(1, Math.floor(Number(moq)));
    if (tradeMode === 'wholesale' || tradeMode === 'retail') data.tradeMode = tradeMode;
    if (wholesaleTiers && typeof wholesaleTiers === 'object') data.wholesaleTiers = wholesaleTiers;
    if (sellerPhotos !== undefined) data.sellerPhotos = sanitizeImageUrls(sellerPhotos, 8);
    if (typeof deliveryEta === 'string') data.deliveryEta = deliveryEta.slice(0, 80);
    if (typeof location === 'string') data.location = location.slice(0, 120);
    if (typeof condition === 'string') data.condition = condition.slice(0, 40);
    if (typeof fulfillmentType === 'string') data.fulfillmentType = fulfillmentType.slice(0, 40);
    if (shippingFee !== undefined) data.shippingFee = Math.max(0, Number(shippingFee));
    if (typeof isActive === 'boolean') data.isActive = isActive;

    const offer = await prisma.sellerOffer.update({ where: { id }, data });
    const winnerId = await recalculateBuyBox(existing.masterProductId);

    return res.json({ ok: true, offer, buyBoxWinnerId: winnerId });
  } catch (err: any) {
    console.error('patchOffer:', err);
    return res.status(500).json({ error: 'Failed to update offer.' });
  }
}

/** GET /api/v1/catalog/my-offers — seller's own offers */
export async function myOffers(req: AuthenticatedRequest, res: Response) {
  try {
    if (!db.isConnected()) return dbOffline(res);

    const userId = req.user!.id;
    const offers = await prisma.sellerOffer.findMany({
      where: { sellerId: userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        masterProduct: {
          select: { id: true, pmin: true, title: true, brand: true, canonicalImages: true, category: true },
        },
      },
    });

    return res.json({ ok: true, offers });
  } catch (err: any) {
    console.error('myOffers:', err);
    if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
      return res.status(503).json({
        error: 'Master catalog tables not applied yet. Run the add_master_catalog migration on Supabase.',
      });
    }
    return res.status(500).json({ error: 'Failed to list offers.' });
  }
}
