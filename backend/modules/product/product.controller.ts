import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { eventBus } from '../../services/eventBus';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, type, portal, search } = req.query;

    if (!process.env.DATABASE_URL) {
      // Dev mode: return fallback products (simulating filtering if search parameter is present)
      const DEV_PRODUCTS = FALLBACK_PRODUCTS;
      let filtered = [...DEV_PRODUCTS];
      if (category) {
        filtered = filtered.filter((p: any) => p.category?.toLowerCase() === String(category).toLowerCase());
      }
      if (portal) {
        filtered = filtered.filter((p: any) => p.portal === portal);
      }
      if (search) {
        filtered = filtered.filter((p: any) => p.name.toLowerCase().includes(String(search).toLowerCase()));
      }
      return res.json(filtered);
    }

    const whereClause: any = { isActive: true };
    if (category) {
      whereClause.categoryId = String(category);
    }
    if (type) {
      whereClause.type = String(type);
    }
    if (portal === 'pk-shop' || portal === 'pk-store') {
      whereClause.isPKStore = true;
    } else if (portal === 'b2b') {
      whereClause.type = 'wholesale';
    }

    if (search) {
      whereClause.title = {
        contains: String(search),
        mode: 'insensitive'
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            fullName: true,
            shopName: true
          }
        },
        reviews: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Match store interface structure
    const mapped = products.map((p: any) => ({
      id: p.id,
      name: p.title,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : Number(p.price),
      description: p.description,
      images: p.images,
      image: p.images?.[0] || 'https://via.placeholder.com/300',
      stock: p.stock,
      minOrderQty: p.minOrderQty,
      unit: p.unit,
      portal: p.isPKStore ? 'pk-shop' : (p.type === 'wholesale' ? 'b2b' : 'b2c'),
      isPKShop: p.isPKStore,
      category: p.category?.name || 'General',
      vendor: {
        id: p.sellerId,
        name: p.seller?.shopName || p.seller?.fullName || 'Paikar Mart Partner'
      },
      rating: p.reviews && p.reviews.length > 0 
        ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
        : 4.5,
      reviews: p.reviews?.length || 0,
      createdAt: p.createdAt
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      const p = FALLBACK_PRODUCTS.find((prod: any) => prod.id === id);
      if (!p) return res.status(404).json({ error: 'Product not found' });
      return res.json(p);
    }

    const product = await (prisma as any).product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            fullName: true
          }
        },
        business: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const p = product as any;

    const mapped = {
      id: p.id,
      name: p.title,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : Number(p.price),
      description: p.description,
      images: p.images,
      image: p.images?.[0] || 'https://via.placeholder.com/300',
      stock: p.stock,
      minOrderQty: p.minOrderQty,
      unit: p.unit,
      portal: p.isPKStore ? 'pk-shop' : (p.type === 'wholesale' ? 'b2b' : 'b2c'),
      isPKShop: p.isPKStore,
      category: p.category?.name || 'General',
      vendor: {
        id: p.sellerId,
        name: p.business?.storeName || p.seller?.fullName || 'Paikar Mart Partner'
      },
      rating: p.reviews && p.reviews.length > 0 
        ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
        : 4.5,
      reviews: p.reviews?.length || 0,
      reviewsList: (p.reviews || []).map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: {
          name: r.user?.fullName || 'Customer',
          avatar: r.user?.avatarUrl
        }
      })),
      createdAt: p.createdAt
    };

    res.json(mapped);
  } catch (error) {
    console.error('Fetch Product Detail Error:', error);
    res.status(500).json({ error: 'Failed to fetch product detail' });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, images, isPKStore, category, stock, type, minOrderQty, unit } = req.body;
    const sellerId = req.headers['x-user-id'] as string || 'dev-seller-id';

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({
        id: `prod-${Date.now()}`,
        name,
        description,
        price,
        originalPrice,
        images: images || [],
        isPKStore: !!isPKStore,
        category: category || 'General',
        stock: stock || 100,
        type: type || 'retail',
        minOrderQty: minOrderQty || 1,
        unit: unit || 'pcs',
        sellerId
      });
    }

    let user = await prisma.user.findFirst({ where: { id: sellerId } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: "01700000001",
          email: 'demo-seller@paikarmart.com',
          fullName: 'Demo Seller',
          passwordHash: 'hashedpassword',
          role: 'seller',
          shopName: 'Super Trading BD'
        }
      });
    }

    const product = await prisma.product.create({
      data: {
        title: name,
        description: description || name,
        price,
        originalPrice,
        images: images || [],
        isPKStore: !!isPKStore,
        categoryId: category || null, 
        stock: stock || 10,
        type: type || 'retail',
        minOrderQty: minOrderQty || 1,
        unit: unit || 'pcs',
        sellerId: user.id
      }
    });

    // Emit event: PRODUCT_ADDED
    await eventBus.emitEvent('PRODUCT_ADDED', {
      productId: product.id,
      title: product.title,
      sellerId: product.sellerId
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, price, originalPrice, stock, minOrderQty, isActive, type } = req.body;

    if (!process.env.DATABASE_URL) {
      return res.json({ id, name, description, price, originalPrice, stock, minOrderQty, isActive, type, message: 'Updated in dev mode' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: name,
        description,
        price,
        originalPrice,
        stock,
        minOrderQty,
        isActive,
        type
      }
    });

    // Emit event: PRODUCT_UPDATED
    await eventBus.emitEvent('PRODUCT_UPDATED', {
      productId: updated.id,
      title: updated.title,
      stock: updated.stock
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

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

// Robust localized fallback products for dev mode
const FALLBACK_PRODUCTS = [
  {
    id: "p1",
    name: "Wireless Earbuds Pro (Active Noise Cancelling)",
    price: 2499,
    originalPrice: 3200,
    portal: "b2c",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?fit=crop&w=400&h=400&q=80"],
    rating: 4.5,
    reviews: 128,
    vendor: { id: "seller-1", name: "Dhaka Electronics" },
    description: "Premium Bluetooth TWS earbuds with deep bass and high fidelity voice quality."
  },
  {
    id: "p2",
    name: "Premium Cotton Panjabi for Men (Regular Fit)",
    price: 1450,
    originalPrice: 2200,
    portal: "b2c",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?fit=crop&w=400&h=400&q=80"],
    rating: 4.8,
    reviews: 84,
    vendor: { id: "seller-2", name: "Chittagong Fashion House" },
    description: "Authentic comfort and classic look for eid festivals and formal wear."
  },
  {
    id: "p3",
    name: "Fresh Padma Hilsa Fish (Sized 1.2kg - 1.5kg)",
    price: 1850,
    originalPrice: 2400,
    portal: "b2c",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?fit=crop&w=400&h=400&q=80"],
    rating: 4.9,
    reviews: 210,
    vendor: { id: "seller-3", name: "Sylhet Fresh Fish Outlet" },
    description: "Pure organic chemical-free fresh fish directly caught from the Padma river."
  },
  {
    id: "pk-polo",
    name: "PK Premium Signature Polo Shirt",
    price: 850,
    originalPrice: 1500,
    portal: "pk-store",
    coinCashback: 50,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?fit=crop&w=400&h=400&q=80"],
    rating: 4.9,
    reviews: 320,
    vendor: { id: "pk-store-ex", name: "PK Store Exclusive" },
    description: "Elite 100% combed cotton fabric with custom luxury stitch and buttons. Designed by PK designers."
  }
];

