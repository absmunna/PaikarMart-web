import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export const getProducts = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      // Return mock products catalog in dev mode
      const mockProducts = [
        // PK Shop (isPKStore: true)
        {
          id: "pk-01",
          name: "Premium Crafted Leather Wallet",
          description: "Hand-stitched genuine leather wallet with RFID blocking and multiple card slots. Pure elegance.",
          price: 2499,
          originalPrice: 3500,
          images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop"],
          category: "accessories",
          stock: 25,
          isPKStore: true,
          sellerId: "dev-seller-id",
          createdAt: new Date().toISOString()
        },
        {
          id: "pk-02",
          name: "Royal Rajshahi Silk Sari",
          description: "Premium pure silk sari from Rajshahi, traditional motifs woven with metallic zari borders.",
          price: 8500,
          originalPrice: 12000,
          images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=400&fit=crop"],
          category: "fashion",
          stock: 12,
          isPKStore: true,
          sellerId: "dev-seller-id",
          createdAt: new Date().toISOString()
        },
        // B2C Retail Products (isPKStore: false, category !== 'wholesale')
        {
          id: "b2c-01",
          name: "Acoustix Pro Wireless Earbuds",
          description: "Active Noise Cancelling (ANC), 30-hour playback time, Bluetooth 5.3, splash proof.",
          price: 1899,
          originalPrice: 2499,
          images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=400&fit=crop"],
          category: "electronics",
          stock: 50,
          isPKStore: false,
          sellerId: "dev-seller-id",
          createdAt: new Date().toISOString()
        },
        {
          id: "b2c-02",
          name: "NeoFit Smart Watch Series X",
          description: "Heart rate monitor, blood oxygen tracker, built-in GPS, multi-sport mode, AMOLED screen.",
          price: 3200,
          originalPrice: 4500,
          images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=400&fit=crop"],
          category: "electronics",
          stock: 30,
          isPKStore: false,
          sellerId: "dev-seller-id",
          createdAt: new Date().toISOString()
        },
        // B2B Wholesale Products (isPKStore: false, category === 'wholesale')
        {
          id: "b2b-05",
          name: "Wholesale Cotton Polo Shirts (Pack of 50)",
          description: "100% combed cotton pique fabric, retail quality polo shirts in mixed sizes and colors.",
          price: 7500,
          originalPrice: 10000,
          images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=400&fit=crop"],
          category: "wholesale",
          stock: 200,
          isPKStore: false,
          sellerId: "dev-seller-id",
          createdAt: new Date().toISOString()
        },
        {
          id: "b2b-06",
          name: "Factory Direct Leather Footwear (20 Pairs)",
          description: "Genuine export quality formal leather shoes. Assorted sizes 40-44, wholesale lot.",
          price: 18000,
          originalPrice: 24000,
          images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=400&fit=crop"],
          category: "wholesale",
          stock: 80,
          isPKStore: false,
          sellerId: "dev-seller-id",
          createdAt: new Date().toISOString()
        }
      ];
      return res.json(mockProducts);
    }

    const products = await prisma.product.findMany();
    res.json(products.map(p => ({
      ...p,
      title: p.name,
      name: p.name
    })));
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, title, description, price, originalPrice, images, isPKStore, category, stock } = req.body;
    const productName = (name || title || 'Untitled Product').trim();
    
    // In a real application, you would attach the sellerId from the logged-in user's token.
    // Assuming 'dev-seller-id' as a fallback seller id.
    const sellerId = req.headers['x-user-id'] as string || 'dev-seller-id';

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({
        id: `prod-${Date.now()}`,
        name: productName,
        title: productName,
        description: description || productName,
        price: Number(price) || 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        images: images || [],
        isPKStore: !!isPKStore,
        category: category || 'general',
        stock: Number(stock) || 0,
        sellerId
      });
    }

    // Ensure the dummy seller user exists or link to one.
    // For demo robustness, if no robust user, handle gracefully.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo-seller@paikarmart.com',
          name: 'Demo Seller',
          password: 'hashedpassword',
          role: 'seller'
        }
      });
    }

    const product = await prisma.product.create({
      data: {
        name: productName,
        description: description || productName,
        price: Number(price) || 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        images: images || [],
        isPKStore: !!isPKStore,
        category: category || null,
        stock: Number(stock) || 0,
        sellerId: user.id
      }
    });

    res.status(201).json({
      ...product,
      title: product.name,
      name: product.name
    });
  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      return res.json({ message: 'Product deleted in dev mode' });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
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
      include: { seller: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      ...product,
      title: product.name,
      name: product.name,
      seller: product.seller ? {
        ...product.seller,
        fullName: product.seller.name
      } : undefined
    });
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
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

