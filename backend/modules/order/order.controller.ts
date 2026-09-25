import { Request, Response } from 'express';
import { prisma } from '../../config/database';

const mockOrders = [
  {
    id: "ORD-78901",
    userId: "usr-demo",
    status: "processing",
    deliveryStatus: "shipped",
    items: [
      {
        id: "item-1",
        productId: "pk-01",
        name: "প্রিমিয়াম লেদার ওয়ালেট",
        quantity: 2,
        price: 2499,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop",
        seller: "রয়্যাল লেদার হাউজ (হাজারীবাগ)"
      }
    ],
    product: {
      id: "pk-01",
      name: "প্রিমিয়াম লেদার ওয়ালেট",
      price: 2499,
      images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop"]
    },
    totalAmount: 4998,
    deliveryFee: 120,
    discount: 200,
    netPayable: 4918,
    paymentMethod: "bKash Escrow (সুরক্ষিত)",
    paymentStatus: "paid",
    deliveryAddress: "রোড ৪, সেক্টর ৯, উত্তরা, ঢাকা - ১২৩০",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    eta: "আজ বিকেল ৫:৩০",
    rider: {
      name: "তানভীর হাসান",
      phone: "01712-345678",
      vehicle: "হোন্ডা সিবিআর ১৫০",
      rating: 4.9
    }
  },
  {
    id: "ORD-78902",
    userId: "usr-demo",
    status: "delivered",
    deliveryStatus: "delivered",
    items: [
      {
        id: "item-2",
        productId: "b2c-01",
        name: "একোস্টিক্স প্রো ওয়্যারলেস এয়ারবাডস",
        quantity: 1,
        price: 1899,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=400&fit=crop",
        seller: "টেক গ্যাজেট জোন"
      }
    ],
    product: {
      id: "b2c-01",
      name: "একোস্টিক্স প্রো ওয়্যারলেস এয়ারবাডস",
      price: 1899,
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=400&fit=crop"]
    },
    totalAmount: 1899,
    deliveryFee: 80,
    discount: 0,
    netPayable: 1979,
    paymentMethod: "ক্যাশ অন ডেলিভারি",
    paymentStatus: "paid",
    deliveryAddress: "বাড়ি ১২, রোড ৭, ধানমন্ডি, ঢাকা",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    eta: "ডেলিভারি সম্পন্ন"
  }
];

export const getOrders = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(mockOrders);
    }

    const orders = await prisma.order.findMany({
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      const match = mockOrders.find(o => o.id === id) || mockOrders[0];
      return res.json(match);
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!order) {
      const match = mockOrders.find(o => o.id === id);
      if (match) return res.json(match);
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch Order By ID Error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const match = mockOrders.find(o => o.id === id) || mockOrders[0];
    
    return res.json({
      orderId: id,
      status: match.status,
      deliveryStatus: match.deliveryStatus,
      eta: match.eta || '৩০-৪৫ মিনিট',
      currentLocation: 'মহাখালী বাস টার্মিনাল সিগন্যাল',
      rider: match.rider || {
        name: 'তানভীর হাসান',
        phone: '01712-345678',
        rating: 4.9
      },
      timeline: [
        { label: 'অর্ডার গ্রহণ করা হয়েছে', time: '১০:৩০ AM', completed: true },
        { label: 'প্যাকেজিং সম্পন্ন', time: '১১:১৫ AM', completed: true },
        { label: 'রাইডারের কাছে হস্তান্তর', time: '১১:৪৫ AM', completed: true },
        { label: 'গন্তব্যে রওনা হয়েছে', time: '১২:১০ PM', completed: true },
        { label: 'ডেলিভারি সম্পন্ন', time: 'আসন্ন', completed: match.status === 'delivered' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking details' });
  }
};

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { productId, items, totalAmount, deliveryAddress, paymentMethod } = req.body;
    const userId = req.headers['x-user-id'] as string || 'dev-user-id';

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId,
      productId: productId || (items?.[0]?.productId || 'pk-01'),
      status: 'pending',
      deliveryStatus: 'preparing',
      totalAmount: totalAmount || 2499,
      deliveryAddress: deliveryAddress || 'ঢাকা, বাংলাদেশ',
      paymentMethod: paymentMethod || 'bKash Escrow',
      createdAt: new Date().toISOString()
    };

    if (!process.env.DATABASE_URL) {
      mockOrders.unshift(newOrder as any);
      return res.status(201).json(newOrder);
    }

    let user = await prisma.user.findFirst();
    if (!user) {
       return res.status(401).json({ error: 'User must exist to place order' });
    }

    const order = await prisma.order.create({
      data: {
        productId: newOrder.productId,
        userId: user.id,
        status: 'pending'
      },
      include: {
        product: true
      }
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Add Order Error:', error);
    res.status(500).json({ error: 'Failed to add order' });
  }
};

export const reorder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      status: 'pending',
      message: 'পুনরায় অর্ডার সফলভাবে গৃহীত হয়েছে',
      originalOrderId: id
    };
    return res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!process.env.DATABASE_URL) {
      const match = mockOrders.find(o => o.id === id);
      if (match) match.status = status;
      return res.json({ message: 'Order updated in dev mode', id, status });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

