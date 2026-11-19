import { Request, Response } from 'express';
import { prisma, db } from '../../config/database';
import { CommercialPricingService } from '../commercial/commercial.pricing.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const portal = (req.query.portal || req.query.portal_id || '') as string;
    const status = (req.query.status || 'active') as string;
    const category = (req.query.category || '') as string;
    const search = ((req.query.search || req.query.q || '') as string).toLowerCase();
    const featured = req.query.featured === 'true';

    if (!db.isConnected()) {
      // Return comprehensive mock catalog filtered by portal, status, and category
      const mockCatalog = [
        // RETAIL PORTAL (portal_id: 'retail')
        {
          id: "ret-01",
          portal_id: "retail",
          is_published: true,
          status: "active",
          isFeatured: true,
          name: "Acoustix Pro Wireless ANC Earbuds (অ্যাকোস্টিক্স নয়েজ ক্যানসেলিং ইয়ারবাডস)",
          title: "Acoustix Pro Wireless ANC Earbuds",
          description: "Active Noise Cancelling (ANC), 30-hour battery life, Bluetooth 5.3 deep bass.",
          price: 1899,
          originalPrice: 2499,
          discount: 24,
          images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=400&fit=crop",
          category: "electronics",
          stock: 42,
          moq: 1,
          isPKStore: false,
          sellerId: "seller-tech-01",
          vendor: {
            store_name: "গ্যাজেট বাইট (GadgetByte BD)",
            verified_badge: true,
            rating: 4.9,
            review_count: 186,
            location: "মতিঝিল, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "ret-02",
          portal_id: "retail",
          is_published: true,
          status: "active",
          isFeatured: true,
          name: "Dhaka Handloom Traditional Jamdani Saree (হাতে বোনা ঢাকাই জামদানি)",
          title: "Dhaka Handloom Traditional Jamdani Saree",
          description: "100% pure cotton thread floral geometric motifs woven by generational artisans.",
          price: 6800,
          originalPrice: 8500,
          discount: 20,
          images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=400&fit=crop",
          category: "fashion",
          stock: 12,
          moq: 1,
          isPKStore: false,
          sellerId: "seller-fashion-01",
          vendor: {
            store_name: "ঐতিহ্য উইভার্স (Heritage Weavers)",
            verified_badge: true,
            rating: 4.8,
            review_count: 94,
            location: "সোনারগাঁও, নারায়ণগঞ্জ"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "ret-03",
          portal_id: "retail",
          is_published: true,
          status: "active",
          isFeatured: false,
          name: "Smart AMOLED Fitness Tracker Watch (অ্যামোলেড ফিটনেস ট্র্যাকার)",
          title: "Smart AMOLED Fitness Tracker Watch",
          description: "Heart rate, SpO2 sensor, sleep monitoring, IP68 waterproof curved display.",
          price: 2450,
          originalPrice: 3200,
          discount: 23,
          images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=400&fit=crop",
          category: "electronics",
          stock: 28,
          moq: 1,
          isPKStore: false,
          sellerId: "seller-tech-01",
          vendor: {
            store_name: "স্মার্টটেক বিডি (SmartTech BD)",
            verified_badge: true,
            rating: 4.7,
            review_count: 112,
            location: "পান্থপথ, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "ret-04",
          portal_id: "retail",
          is_published: true,
          status: "active",
          isFeatured: false,
          name: "Pure Mustard Cold Pressed Oil 2L (ঘানি ভাঙা খাঁটি সরিষার তেল)",
          title: "Pure Mustard Cold Pressed Oil 2L",
          description: "100% natural, unadulterated cold pressed mustard oil directly from mustard mills.",
          price: 640,
          originalPrice: 750,
          discount: 15,
          images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=400&fit=crop",
          category: "grocery",
          stock: 65,
          moq: 1,
          isPKStore: false,
          sellerId: "seller-grocer-01",
          vendor: {
            store_name: "খাঁটি এগ্রো অর্গানিক (Khati Agro)",
            verified_badge: true,
            rating: 4.9,
            review_count: 230,
            location: "নাটোর, রাজশাহী"
          },
          createdAt: new Date().toISOString()
        },

        // PHARMACY PORTAL (portal_id: 'pharmacy')
        {
          id: "pharm-01",
          portal_id: "pharmacy",
          is_published: true,
          status: "active",
          isFeatured: true,
          express_delivery: true,
          requires_prescription: false,
          name: "Paracetamol 500mg Fast Relief (প্যারাসিটামল ৫০০মিগ্রা ফাস্ট রিলিফ)",
          title: "Paracetamol 500mg Fast Relief (১০ পাতা বক্স)",
          description: "Rapid absorption fever and pain relief medication from DGDA licensed manufacturer.",
          price: 120,
          originalPrice: 150,
          discount: 20,
          images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop",
          category: "medicines",
          stock: 150,
          moq: 1,
          isPKStore: false,
          sellerId: "pharm-vendor-01",
          vendor: {
            store_name: "লাইফকেয়ার মডেল ফার্মেসি (LifeCare Pharma)",
            verified_badge: true,
            rating: 4.9,
            review_count: 420,
            location: "ধানমন্ডি, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "pharm-02",
          portal_id: "pharmacy",
          is_published: true,
          status: "active",
          isFeatured: true,
          express_delivery: true,
          requires_prescription: true,
          name: "Blood Pressure & Diabetes Regular Care Pack (প্রেসক্রিপশন মেডিসিন প্যাক)",
          title: "Hypertension Regular Care Pack (প্রেসক্রিপশন প্রয়োজন)",
          description: "Chronic care prescription medicine pack with verified batch and temperature-controlled storage.",
          price: 850,
          originalPrice: 980,
          discount: 13,
          images: ["https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=400&fit=crop",
          category: "prescription",
          stock: 60,
          moq: 1,
          isPKStore: false,
          sellerId: "pharm-vendor-01",
          vendor: {
            store_name: "লাইফকেয়ার মডেল ফার্মেসি (LifeCare Pharma)",
            verified_badge: true,
            rating: 4.9,
            review_count: 420,
            location: "ধানমন্ডি, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "pharm-03",
          portal_id: "pharmacy",
          is_published: true,
          status: "active",
          isFeatured: false,
          express_delivery: true,
          requires_prescription: false,
          name: "Digital Upper Arm Blood Pressure Monitor (ডিজিটাল প্রেসার মাপার মেশিন)",
          title: "Digital Upper Arm Blood Pressure Monitor",
          description: "Clinical accuracy with LCD backlight, dual user memory, and irregular heartbeat alert.",
          price: 2150,
          originalPrice: 2800,
          discount: 23,
          images: ["https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&h=400&fit=crop",
          category: "healthcare_devices",
          stock: 35,
          moq: 1,
          isPKStore: false,
          sellerId: "pharm-vendor-02",
          vendor: {
            store_name: "মেডিস্টোর বিডি (MediStore BD)",
            verified_badge: true,
            rating: 4.8,
            review_count: 89,
            location: "শাহবাগ, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "pharm-04",
          portal_id: "pharmacy",
          is_published: true,
          status: "active",
          isFeatured: false,
          express_delivery: true,
          requires_prescription: false,
          name: "First Aid Family Emergency Medical Kit (ফ্যামিলি ফার্স্ট এইড কিট)",
          title: "First Aid Family Emergency Medical Kit",
          description: "Complete 45-piece medical emergency kit including antiseptic, bandage, burn cream, and gauze.",
          price: 750,
          originalPrice: 950,
          discount: 21,
          images: ["https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&h=400&fit=crop",
          category: "first_aid",
          stock: 90,
          moq: 1,
          isPKStore: false,
          sellerId: "pharm-vendor-02",
          vendor: {
            store_name: "মেডিস্টোর বিডি (MediStore BD)",
            verified_badge: true,
            rating: 4.8,
            review_count: 89,
            location: "শাহবাগ, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },

        // GROCERY PORTAL (portal_id: 'grocery')
        {
          id: "groc-01",
          portal_id: "grocery",
          is_published: true,
          status: "active",
          isFeatured: true,
          express_delivery: true,
          name: "Sundarbans Raw Wild Honey 500g (সুন্দরবনের খাঁটি খলিশা মধু)",
          title: "Sundarbans Raw Wild Honey 500g",
          description: "Directly harvested by forest mawalis of Sundarbans. 100% pure lab-tested natural nectar.",
          price: 750,
          originalPrice: 950,
          discount: 21,
          images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=400&fit=crop",
          category: "organic_foods",
          stock: 45,
          moq: 1,
          isPKStore: false,
          sellerId: "groc-vendor-01",
          vendor: {
            store_name: "সুন্দরবন ডিরেক্ট ফ্রেশ (Sundarban Direct)",
            verified_badge: true,
            rating: 4.9,
            review_count: 210,
            location: "খুলনা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "groc-02",
          portal_id: "grocery",
          is_published: true,
          status: "active",
          isFeatured: true,
          express_delivery: true,
          name: "Premium Miniket Daily Rice 25kg (প্রিমিয়াম স্পেশাল মিনিকেট চাল)",
          title: "Premium Miniket Daily Rice 25kg",
          description: "Long grain, naturally aged, dust-free cleaned Miniket rice for everyday family meals.",
          price: 1850,
          originalPrice: 2100,
          discount: 12,
          images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=400&fit=crop",
          category: "staples",
          stock: 120,
          moq: 1,
          isPKStore: false,
          sellerId: "groc-vendor-02",
          vendor: {
            store_name: "ঢাকা গ্রোসারি আড়ত (Dhaka Grocery Arat)",
            verified_badge: true,
            rating: 4.8,
            review_count: 340,
            location: "কারওয়ান বাজার, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "groc-03",
          portal_id: "grocery",
          is_published: true,
          status: "active",
          isFeatured: false,
          express_delivery: true,
          name: "Pure Aromatic Desi Ghee 500g (গাওয়া খাঁটি ঘি)",
          title: "Pure Aromatic Desi Ghee 500g",
          description: "Traditional bilona churned pure cow milk ghee with authentic golden granular texture.",
          price: 900,
          originalPrice: 1100,
          discount: 18,
          images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=400&fit=crop",
          category: "dairy",
          stock: 38,
          moq: 1,
          isPKStore: false,
          sellerId: "groc-vendor-01",
          vendor: {
            store_name: "খাঁটি এগ্রো ডেইরি (Khati Agro Dairy)",
            verified_badge: true,
            rating: 4.9,
            review_count: 145,
            location: "পাবনা"
          },
          createdAt: new Date().toISOString()
        },

        // WHOLESALE B2B PORTAL (portal_id: 'wholesale')
        {
          id: "b2b-01",
          portal_id: "wholesale",
          is_published: true,
          status: "active",
          isFeatured: true,
          name: "Wholesale Combed Cotton Polo Lot (৫০ পিস প্রিমিয়াম পোলো টি-শার্ট বান্ডিল)",
          title: "Wholesale Combed Cotton Polo Lot (50 pcs)",
          description: "Export quality 220 GSM 100% combed cotton pique polo shirts in mixed standard sizes.",
          price: 7500,
          originalPrice: 10000,
          discount: 25,
          images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=400&fit=crop",
          category: "wholesale_garments",
          stock: 450,
          moq: 10,
          isPKStore: false,
          sellerId: "b2b-vendor-01",
          vendor: {
            store_name: "ইসলামপুর কটন ফেব্রিক্স (Islampur Cotton)",
            verified_badge: true,
            rating: 4.9,
            review_count: 512,
            location: "ইসলামপুর, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "b2b-02",
          portal_id: "wholesale",
          is_published: true,
          status: "active",
          isFeatured: true,
          name: "Factory Direct Leather Formal Shoes (২০ জোড়া এক্সপোর্ট লট)",
          title: "Factory Direct Leather Formal Shoes (20 Pairs)",
          description: "Full grain genuine crust leather formal footwear wholesale carton for retail shops.",
          price: 18000,
          originalPrice: 24000,
          discount: 25,
          images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=400&fit=crop",
          category: "wholesale_footwear",
          stock: 80,
          moq: 20,
          isPKStore: false,
          sellerId: "b2b-vendor-02",
          vendor: {
            store_name: "হাজারীবাগ লেদার কমপ্লেক্স (Hazaribagh Leather)",
            verified_badge: true,
            rating: 4.8,
            review_count: 270,
            location: "হাজারীবাগ, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },

        // PK SHOP OFFICIAL (portal_id: 'pk-shop')
        {
          id: "pk-01",
          portal_id: "pk-shop",
          is_published: true,
          status: "active",
          isFeatured: true,
          name: "Royal Rajshahi Pure Silk Sari (রাজশাহী ঐতিহ্যবাহী খাঁটি সিল্ক শাড়ি)",
          title: "Royal Rajshahi Pure Silk Sari",
          description: "Certified pure silk certified by Bangladesh Sericulture Board. Authentic zari border work.",
          price: 8500,
          originalPrice: 12000,
          discount: 29,
          images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=400&fit=crop",
          category: "luxury_apparel",
          stock: 12,
          moq: 1,
          isPKStore: true,
          sellerId: "pk-official-store",
          vendor: {
            store_name: "পিকে স্টোর অফিসিয়াল (PK Store Official)",
            verified_badge: true,
            rating: 5.0,
            review_count: 620,
            location: "গুলশান ২, ঢাকা"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "pk-02",
          portal_id: "pk-shop",
          is_published: true,
          status: "active",
          isFeatured: true,
          name: "Handcrafted Top-Grain Leather Executive Wallet (এক্সিকিউটিভ লেদার ওয়ালেট)",
          title: "Handcrafted Top-Grain Leather Executive Wallet",
          description: "Hand-stitched genuine leather wallet with RFID shield, metallic zipper coin pouch.",
          price: 2499,
          originalPrice: 3500,
          discount: 28,
          images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop"],
          image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop",
          category: "leather_goods",
          stock: 35,
          moq: 1,
          isPKStore: true,
          sellerId: "pk-official-store",
          vendor: {
            store_name: "পিকে স্টোর অফিসিয়াল (PK Store Official)",
            verified_badge: true,
            rating: 5.0,
            review_count: 620,
            location: "গুলশান ২, ঢাকা"
          },
          createdAt: new Date().toISOString()
        }
      ];

      // Filter catalog
      let filtered = [...mockCatalog];

      if (portal && portal !== 'all') {
        const pNorm = portal.toLowerCase();
        filtered = filtered.filter(p => {
          return p.portal_id.toLowerCase() === pNorm || 
                 p.category.toLowerCase().includes(pNorm) ||
                 (pNorm === 'b2c' && p.portal_id === 'retail') ||
                 (pNorm === 'b2b' && p.portal_id === 'wholesale') ||
                 (pNorm === 'pk-store' && p.portal_id === 'pk-shop');
        });
      }

      if (status && status !== 'all') {
        filtered = filtered.filter(p => p.status === status && p.is_published === true);
      }

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }

      if (featured) {
        filtered = filtered.filter(p => p.isFeatured === true);
      }

      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search) ||
          p.vendor.store_name.toLowerCase().includes(search)
        );
      }

      return res.json(filtered);
    }

    // Database query with Prisma
    const whereClause: any = {};
    if (status === 'active') {
      whereClause.stock = { gt: 0 };
    }
    if (category && category !== 'all') {
      whereClause.category = { contains: category, mode: 'insensitive' };
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        vendor: true
      }
    });

    const formatted = products.map(p => ({
      ...p,
      name: p.title,
      portal_id: p.category || 'retail',
      is_published: true,
      status: p.stock > 0 ? 'active' : 'out_of_stock',
      discount: p.originalPrice ? Math.round(((Number(p.originalPrice) - Number(p.price)) / Number(p.originalPrice)) * 100) : 0,
      vendor: {
        store_name: p.vendor?.shopName || 'Paikar Mart ভেরিফায়েড শপ',
        verified_badge: p.vendor?.isVerified ?? true,
        rating: 4.8,
        review_count: 40,
        location: p.vendor?.location || 'ঢাকা'
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const addProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      name, 
      title, 
      description, 
      price, 
      originalPrice, 
      images, 
      image,
      isPKStore, 
      category, 
      stock, 
      portal_id, 
      portal,
      isFeatured 
    } = req.body;
    
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resolvedPortalId = portal_id || portal || 'retail';

    const allowedSellerRoles = [
      'seller', 'retail_seller', 'wholesale_seller', 'factory_seller', 'factory', 'rural', 'wholesale', 
      'exporter', 'importer', 'brand_seller', 'b2b_seller', 'food_seller', 'grocery_seller', 'rural_seller', 
      'nearby_shop', 'service_provider', 'digital_seller', 'business', 'admin', 'super_admin'
    ];

    const isAuthorized = allowedSellerRoles.includes(user.role) || user.isSeller;

    if (!isAuthorized) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Forbidden: Only registered sellers, vendors, or admins have product posting rights.'
      });
    }

    const calculatedDiscount = originalPrice && price && Number(originalPrice) > Number(price)
      ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
      : 0;

    if (!db.isConnected()) {
      return res.status(201).json({
        id: `prod-${Date.now()}`,
        name: name || title,
        title: title || name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount: calculatedDiscount,
        images: images || (image ? [image] : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"]),
        image: image || (images && images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        isPKStore: Boolean(isPKStore),
        category: category || 'general',
        stock: Number(stock) || 10,
        portal_id: resolvedPortalId,
        is_published: true,
        status: 'active',
        isFeatured: user.role === 'admin' ? Boolean(isFeatured) : false,
        sellerId: user.id
      });
    }

    // Live database path
    // Ensure vendor profile exists or link to user
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id }
    });

    const product = await prisma.product.create({
      data: {
        title: name || title,
        description: description || name || title || '',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        images: images || (image ? [image] : []),
        category: category || resolvedPortalId || 'retail',
        stock: Number(stock) || 0,
        sellerId: user.id,
        vendorId: vendorProfile?.id || null
      }
    });

    res.status(201).json({
      ...product,
      portal_id: resolvedPortalId,
      is_published: true,
      status: 'active'
    });
  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};


export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!db.isConnected()) {
      return res.json({
        id,
        ...updateData,
        message: 'Product updated successfully in dev mode'
      });
    }

    // 1. Fetch product to verify ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { vendor: true }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 2. Ownership Check
    const isOwner = existingProduct.sellerId === user.id || 
                    (existingProduct.vendor && existingProduct.vendor.userId === user.id);
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this product.' });
    }

    // 3. Perform update
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: updateData.name || updateData.title || undefined,
        description: updateData.description || undefined,
        price: updateData.price ? Number(updateData.price) : undefined,
        originalPrice: updateData.originalPrice ? Number(updateData.originalPrice) : undefined,
        category: updateData.category || undefined,
        stock: updateData.stock !== undefined ? Number(updateData.stock) : undefined,
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};


export const featureProductOnBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    const userRole = (req as any).user?.role || req.headers['x-user-role'] || 'seller';

    // Only Admin can feature product on portal banner
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only Administrators can feature products on the portal banner.'
      });
    }

    return res.json({
      id,
      isFeatured: Boolean(isFeatured),
      message: `Product banner status updated to ${Boolean(isFeatured) ? 'FEATURED' : 'STANDARD'}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to feature product' });
  }
};


export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!db.isConnected()) {
      return res.json({ message: 'Product deleted in dev mode' });
    }

    // 1. Fetch product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { vendor: true }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 2. Authorization
    const isOwner = existingProduct.sellerId === user.id || 
                    (existingProduct.vendor && existingProduct.vendor.userId === user.id);
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this product.' });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};


export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!db.isConnected()) {
      // Look up in dev list
      const defaultProduct = {
        id,
        name: "প্রিমিয়াম কোয়ালিটি প্রোডাক্ট",
        description: "অরিজিনাল গ্যারান্টিযুক্ত প্রিমিয়াম পণ্য। পাইকার মার্ট ভেরিফায়েড বিক্রেতা দ্বারা সরবরাহকৃত।",
        price: 2499,
        originalPrice: 3200,
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop"],
        category: "electronics",
        stock: 50,
        rating: 4.8,
        reviewsCount: 124,
        isPKStore: false,
        sellerId: "seller-01"
      };
      return res.json(defaultProduct);
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { vendor: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Fetch Product Detail Error:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

export const getProductSeller = async (req: Request, res: Response) => {
  try {
    return res.json({
      id: "seller-01",
      name: "মেসার্স আলম ব্রাদার্স ট্রেডার্স",
      rating: 4.9,
      reviewsCount: 380,
      joinedYear: "২০২২",
      location: "চকবাজার, ঢাকা",
      isVerified: true,
      badge: "টপ রেটেড হোলসেলার",
      responseRate: "৯৮%",
      totalProducts: 45
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seller details' });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;

    if (!db.isConnected()) {
      return res.json([
        {
          id: "rev-1",
          userName: "সাকিব আল হাসান",
          userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          rating: 5,
          comment: "প্রোডাক্ট কোয়ালিটি অনেক ভালো। ডেলিভারিও দ্রুত পেয়েছি। ধন্যবাদ পাইকার মার্ট।",
          createdAt: "২ দিন আগে"
        },
        {
          id: "rev-2",
          userName: "মাহমুদুল হাসান",
          userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
          rating: 4.5,
          comment: "প্যাকেজিং খুব শক্ত ছিল। পাইকারি দাম অনুযায়ী জিনিসটি উপযুক্ত।",
          createdAt: "৫ দিন আগে"
        }
      ]);
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get Product Reviews Error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const addProductReview = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const { rating, comment, userName, images } = req.body;
    
    const userId = req.headers['x-user-id'] as string || (req as any).user?.id || 'dev-user-id';

    if (!db.isConnected()) {
      // Restrict Product Review submission ONLY to users with Status = DELIVERED
      // In dev simulated mode, let's mock a delivered order for 'b2c-01', but NOT for 'b2c-02'.
      if (productId === 'b2c-02') {
        return res.status(403).json({
          error: 'Review Restricted',
          message: 'Review submission restricted. You can only submit reviews for products that have been successfully DELIVERED to your account.'
        });
      }

      return res.status(201).json({
        id: `rev-${Date.now()}`,
        userName: userName || "Anonymous Buyer",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        rating: rating || 5,
        comment: comment || "Excellent product!",
        createdAt: "Just now",
        verifiedBuyer: true
      });
    }

    // Real DB check:
    // Check if there is an order for this buyerId containing this productId with status = 'delivered'
    const deliveredOrder = await prisma.order.findFirst({
      where: {
        buyerId: userId,
        status: 'delivered',
        orderItems: {
          some: {
            productId: productId
          }
        }
      }
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        error: 'Review Restricted',
        message: 'Review submission restricted. You can only submit reviews for products that have been successfully DELIVERED to your account.'
      });
    }

    // Save review
    const review = await prisma.review.create({
      data: {
        userId,
        userName: userName || 'Anonymous Buyer',
        productId,
        rating: rating ? parseInt(rating) : 5,
        comment,
        images: images || [],
        verifiedBuyer: true
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Add Product Review Error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

export const getProductQnA = async (req: Request, res: Response) => {
  try {
    return res.json([
      {
        id: "q-1",
        question: "৫০ পিসের বেশি নিলে কি অতিরিক্ত ডিসকাউন্ট পাওয়া যাবে?",
        answer: "হ্যাঁ, ৫০ পিসের বেশি অর্ডারে স্পেশাল লট রেট পাবেন। মেসেজ করুন।",
        author: "আকরাম ট্রেডার্স"
      },
      {
        id: "q-2",
        question: "ঢাকার বাইরে কুরিয়ারে ক্যাশ অন ডেলিভারি দেওয়া যাবে?",
        answer: "হ্যাঁ, সুন্দরবন ও রেডেক্স কুরিয়ারে ক্যাশ অন ডেলিভারি এভেইলেবল।",
        author: "বিক্রেতা"
      }
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Q&A' });
  }
};

export const addQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    return res.status(201).json({
      id: `q-${Date.now()}`,
      question,
      message: 'প্রশ্নটি সফলভাবে পাঠানো হয়েছে। বিক্রেতা উত্তর দিলে জানানো হবে।'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit question' });
  }
};

export const getProductPricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.query;
    
    if (quantity) {
      const qty = parseInt(quantity as string, 10);
      const calc = await CommercialPricingService.calculateTieredPricing(id, qty);
      return res.json({ status: 'success', data: calc });
    }

    const tiers = await CommercialPricingService.getProductTiers(id);
    return res.json({ status: 'success', data: tiers });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch product pricing tiers' });
  }
};

