import { Router } from 'express';

const router = Router();

// Mock data generator helper
const generateMockShops = (lat: number, lng: number, category?: string) => {
    const shops = [
        {
          id: '1',
          name: 'Dhaka Wholesale Central',
          avatar: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop',
          coverImage: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&h=400&fit=crop',
          rating: 4.8,
          reviewCount: 1240,
          distance: 1.2,
          deliveryTime: '30-45 min',
          activeProductsCount: 450,
          isVerified: true,
          isOpen: true,
          category: 'Wholesale',
          lat: lat + 0.01,
          lng: lng + 0.01,
          address: '12/A, Dhanmondi, Dhaka'
        },
        {
          id: '2',
          name: 'Tech Haven Electronics',
          avatar: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&h=100&fit=crop',
          coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=400&fit=crop',
          rating: 4.5,
          reviewCount: 850,
          distance: 2.5,
          deliveryTime: '1-2 days',
          activeProductsCount: 1200,
          isVerified: true,
          isOpen: true,
          category: 'Electronics',
          lat: lat - 0.015,
          lng: lng + 0.02,
          address: 'Multiplan Center, Elephant Road'
        },
        {
          id: '3',
          name: 'Green Groceries Local',
          avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
          coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
          rating: 4.9,
          reviewCount: 3200,
          distance: 0.8,
          deliveryTime: '15-20 min',
          activeProductsCount: 150,
          isVerified: true,
          isOpen: true,
          category: 'Food',
          lat: lat + 0.005,
          lng: lng - 0.005,
          address: 'Karwan Bazar, Dhaka'
        }
    ];

    if (category) {
        return shops.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    return shops;
};

router.get('/', (req, res) => {
    const { lat, lng, radius, category } = req.query;
    
    // Default to Dhaka if no coords
    const latitude = lat ? parseFloat(lat as string) : 23.8103;
    const longitude = lng ? parseFloat(lng as string) : 90.4125;
    
    const shops = generateMockShops(latitude, longitude, category as string);
    
    res.json({
        status: 'success',
        data: shops,
        meta: {
            count: shops.length,
            radius: radius || 10
        }
    });
});

router.get('/feed', (req, res) => {
    const posts = [
        {
            id: 'p1',
            author: { name: 'Farhana Ahmed', isVerified: true, role: 'Resident' },
            content: 'Does anyone know if the local community center is open for badminton today? 🏸',
            type: 'update',
            location: 'Mirpur DOHS',
            timestamp: '2 hours ago',
            stats: { likes: 12, comments: 4, shares: 1 },
            tags: ['Sports', 'Community']
        },
        {
            id: 'p2',
            author: { name: 'Electrician Karim', isVerified: true, role: 'Service Provider' },
            content: 'Available for AC servicing and electrical repairs in Mirpur 10 area today. Fast response guaranteed! ⚡',
            type: 'update',
            location: 'Mirpur 10',
            timestamp: '4 hours ago',
            stats: { likes: 25, comments: 8, shares: 5 },
            tags: ['Service', 'Electrician']
        }
    ];
    res.json({ status: 'success', data: posts });
});

router.get('/services', (req, res) => {
    const services = [
        {
            id: 's1',
            name: 'Master Electrician',
            category: 'Electrical',
            provider: 'Karim Uddin',
            rating: 4.9,
            reviews: 156,
            price: 'From ৳200',
            availability: 'Available Now',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
            isVerified: true
        }
    ];
    res.json({ status: 'success', data: services });
});

router.get('/events', (req, res) => {
    const events = [
        {
            id: 'e1',
            title: 'Mirpur Community Cricket Tournament',
            date: 'July 15, 2026',
            time: '9:00 AM',
            location: 'Mirpur Stadium Grounds',
            organizer: 'Local Sports Club',
            attendees: 124,
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80',
            category: 'Sports'
        }
    ];
    res.json({ status: 'success', data: events });
});

export const nearbyRoutes = router;
