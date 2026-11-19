import { Router, type IRouter } from "express";
import {
  db,
  expandProduct,
  genId,
  generateASIN,
  calculateBuyBox,
  type MasterProduct,
  type SellerOffer,
} from "@backend/api/lib/db";

const router: IRouter = Router();

router.get("/products", (req, res) => {
  const { q, categoryId, vendorId, type, sort, limit } = req.query as Record<
    string,
    string
  >;
  let items = [...db.products];
  if (categoryId) {
    const cleanId = categoryId.replace(/^c/, "");
    items = items.filter((p) => {
      const pCleanId = p.categoryId?.replace(/^c/, "");
      return pCleanId === cleanId || p.categoryId === categoryId;
    });
  }
  if (vendorId) items = items.filter((p) => p.vendorId === vendorId);
  if (type) items = items.filter((p) => p.type === type);
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(needle)),
    );
  }
  switch (sort) {
    case "newest":
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "price_asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    default:
      items.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  if (limit) items = items.slice(0, Number(limit));
  res.json(items.map(expandProduct));
});

router.get("/products/trending", (_req, res) => {
  const items = [...db.products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6)
    .map(expandProduct);
  res.json(items);
});

router.get("/products/:id", (req, res) => {
  const p = db.products.find((x) => x.id === req.params["id"]);
  if (!p) return res.status(404).json({ error: "not_found" });
  res.json(expandProduct(p));
});

router.post("/products", (req, res) => {
  const { title, description, price, type, categoryId, images, stock, tags } =
    req.body ?? {};
  if (!title || !categoryId) return res.status(400).json({ error: "invalid" });
  const p = {
    id: genId("p"),
    title,
    description: description ?? "",
    price: Number(price) || 0,
    currency: "BDT",
    images: images ?? [],
    stock: Number(stock) || 0,
    vendorId: db.vendors[0]?.id ?? "v1",
    categoryId,
    rating: 0,
    reviewCount: 0,
    type: type ?? "retail",
    location: db.currentUser.location,
    tags: tags ?? [],
    createdAt: new Date().toISOString(),
  };
  db.products.unshift(p);
  const c = db.categories.find((x) => x.id === categoryId);
  if (c) c.productCount++;
  res.status(201).json(expandProduct(p));
});

// ----------------------------------------------------
// AMAZON-STYLE MASTER CATALOG & MULTI-SELLER OFFER APIS
// ----------------------------------------------------

/**
 * List / search master products with active seller offer counts & price ranges
 */
router.get("/catalog/master", (req, res) => {
  const { q, categoryId } = req.query as Record<string, string>;
  let items = [...db.masterProducts];

  if (categoryId) {
    items = items.filter((mp) => mp.categoryId === categoryId);
  }

  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (mp) =>
        mp.title.toLowerCase().includes(needle) ||
        mp.asin.toLowerCase().includes(needle) ||
        (mp.upcOrEan && mp.upcOrEan.toLowerCase().includes(needle)) ||
        mp.brand.toLowerCase().includes(needle)
    );
  }

  const catalogWithStats = items.map((mp) => {
    const buyBoxResult = calculateBuyBox(mp.asin);
    const offers = buyBoxResult?.offers || [];
    const activeOffers = offers.filter((o) => o.isActive && o.stock > 0);
    const prices = activeOffers.map((o) => o.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    return {
      ...mp,
      totalSellers: offers.length,
      activeSellers: activeOffers.length,
      buyBoxWinner: buyBoxResult?.winner || null,
      priceRange: minPrice !== null ? { min: minPrice, max: maxPrice } : null,
    };
  });

  res.json(catalogWithStats);
});

/**
 * Get single Master Product by ASIN or ID with all seller offers & Buy Box winner
 */
router.get("/catalog/master/:asinOrId", (req, res) => {
  const { asinOrId } = req.params;
  const mp = db.masterProducts.find(
    (x) => x.asin === asinOrId || x.id === asinOrId
  );

  if (!mp) {
    return res.status(404).json({ error: "master_product_not_found" });
  }

  const buyBoxResult = calculateBuyBox(mp.asin);
  const offers = buyBoxResult?.offers || [];
  const activeOffers = offers.filter((o) => o.isActive && o.stock > 0);
  const prices = activeOffers.map((o) => o.price);

  res.json({
    masterProduct: mp,
    asin: mp.asin,
    buyBox: {
      winner: buyBoxResult?.winner || null,
      totalOffers: offers.length,
      activeOffersCount: activeOffers.length,
      lowestLandedPrice:
        activeOffers.length > 0
          ? Math.min(...activeOffers.map((o) => o.price + o.shippingFee))
          : null,
      priceSpread: {
        lowest: prices.length > 0 ? Math.min(...prices) : null,
        highest: prices.length > 0 ? Math.max(...prices) : null,
      },
    },
    offers: offers, // sorted with buy box winner first, then lowest landed price
  });
});

/**
 * Create a new Master Product catalog item with auto-generated unique ASIN
 */
router.post("/catalog/master", (req, res) => {
  const {
    title,
    brand,
    categoryId,
    description,
    specifications,
    canonicalImages,
    upcOrEan,
    defaultMoq,
  } = req.body ?? {};

  if (!title || !description) {
    return res.status(400).json({ error: "title_and_description_required" });
  }

  // Automatic unique ASIN generation
  const asin = generateASIN("PMIN");

  const newMaster: MasterProduct = {
    id: genId("mp"),
    asin,
    upcOrEan: upcOrEan || undefined,
    title,
    brand: brand || "Generic",
    categoryId: categoryId || "c1",
    description,
    specifications: specifications || {},
    canonicalImages: canonicalImages || [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
    ],
    defaultMoq: Number(defaultMoq) || 1,
    createdAt: new Date().toISOString(),
  };

  db.masterProducts.unshift(newMaster);

  res.status(201).json({
    message: "Master catalog product created successfully with unique ASIN",
    masterProduct: newMaster,
    asin: newMaster.asin,
  });
});

/**
 * Link seller inventory to an existing Master Product (Create or Update Seller Offer)
 */
router.post("/catalog/master/:asin/offers", (req, res) => {
  const { asin } = req.params;
  const {
    sellerSku,
    price,
    originalPrice,
    stock,
    minOrderQty,
    fulfillmentType,
    shippingFee,
    freeShippingAbove,
    dispatchTimeDays,
    condition,
    warranty,
    sellerId,
    sellerName,
    sellerLocation,
  } = req.body ?? {};

  const mp = db.masterProducts.find(
    (x) => x.asin === asin || x.id === asin
  );

  if (!mp) {
    return res.status(404).json({ error: "master_product_not_found" });
  }

  if (!price || stock === undefined || !sellerSku) {
    return res.status(400).json({ error: "price_stock_and_sellerSku_required" });
  }

  const resolvedSellerId = sellerId || db.vendors[0]?.id || "v1";
  const vendor = db.vendors.find((v) => v.id === resolvedSellerId) || db.vendors[0];

  // Check if seller already has an offer for this master product
  const existingIndex = db.sellerOffers.findIndex(
    (o) => (o.masterProductId === mp.id || o.asin === mp.asin) && o.sellerId === resolvedSellerId
  );

  const offerData: SellerOffer = {
    id: existingIndex >= 0 ? db.sellerOffers[existingIndex].id : genId("off"),
    masterProductId: mp.id,
    asin: mp.asin,
    sellerId: resolvedSellerId,
    sellerName: sellerName || vendor?.name || "Merchant Seller",
    sellerRating: vendor?.rating || 4.8,
    sellerReviewCount: vendor?.followers ? Math.floor(vendor.followers / 10) : 50,
    sellerLocation: sellerLocation || vendor?.location || "Dhaka, Bangladesh",
    sellerVerified: vendor?.verified ?? true,
    sellerSku: String(sellerSku).trim(),
    condition: condition || "New",
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
    stock: Number(stock),
    minOrderQty: Number(minOrderQty) || 1,
    fulfillmentType: fulfillmentType === "paikar_express" ? "paikar_express" : "seller_fulfilled",
    shippingFee: Number(shippingFee) || 0,
    freeShippingAbove: freeShippingAbove ? Number(freeShippingAbove) : undefined,
    dispatchTimeDays: Number(dispatchTimeDays) || 1,
    warranty: warranty || "7 Days Replacement Warranty",
    isBuyBoxWinner: false,
    isActive: true,
    updatedAt: new Date().toISOString(),
    createdAt: existingIndex >= 0 ? db.sellerOffers[existingIndex].createdAt : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    db.sellerOffers[existingIndex] = offerData;
  } else {
    db.sellerOffers.push(offerData);
  }

  // Real-time Buy Box recalculation
  const buyBox = calculateBuyBox(mp.asin);

  res.status(201).json({
    message: existingIndex >= 0 ? "Inventory offer updated in real-time" : "Inventory linked to master ASIN successfully",
    offer: offerData,
    wonBuyBox: buyBox?.winner?.id === offerData.id,
    currentBuyBoxWinner: buyBox?.winner,
    allOffers: buyBox?.offers || [],
  });
});

/**
 * Real-time update of seller inventory offer (Pricing, Stock, Shipping)
 */
router.patch("/catalog/offers/:offerId", (req, res) => {
  const { offerId } = req.params;
  const { price, stock, shippingFee, dispatchTimeDays, isActive, condition } = req.body ?? {};

  const offer = db.sellerOffers.find((o) => o.id === offerId);
  if (!offer) {
    return res.status(404).json({ error: "offer_not_found" });
  }

  if (price !== undefined) offer.price = Number(price);
  if (stock !== undefined) offer.stock = Number(stock);
  if (shippingFee !== undefined) offer.shippingFee = Number(shippingFee);
  if (dispatchTimeDays !== undefined) offer.dispatchTimeDays = Number(dispatchTimeDays);
  if (isActive !== undefined) offer.isActive = Boolean(isActive);
  if (condition !== undefined) offer.condition = condition;
  offer.updatedAt = new Date().toISOString();

  // Instant Buy Box recalculation
  const buyBox = calculateBuyBox(offer.asin);

  res.json({
    message: "Offer updated in real-time",
    offer,
    isBuyBoxWinner: offer.isBuyBoxWinner,
    buyBoxWinner: buyBox?.winner,
    allOffers: buyBox?.offers || [],
  });
});

/**
 * Buy Box Competitive Price Check
 */
router.get("/catalog/offers/buybox-check/:asin", (req, res) => {
  const { asin } = req.params;
  const buyBox = calculateBuyBox(asin);
  if (!buyBox) return res.status(404).json({ error: "asin_not_found" });

  const winner = buyBox.winner;
  res.json({
    asin,
    winner,
    winningPrice: winner?.price ?? null,
    winningLandedPrice: winner ? winner.price + winner.shippingFee : null,
    recommendation: winner
      ? `To compete for the Buy Box, match or beat landed price ৳${winner.price + winner.shippingFee}`
      : "No active offers currently competing. List now to win the Buy Box automatically!",
  });
});

export default router;
