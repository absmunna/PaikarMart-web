import { Router } from 'express';

const router = Router();

router.get('/:orderId', (req, res) => {
    const { orderId } = req.params;
    
    // Mock tracking data
    const trackingInfo = {
        id: 'PKG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        orderId,
        status: 'SHIPPED',
        productName: 'HP Victus 15 Gaming Laptop',
        productImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
        sellerName: 'Global Tech Dhaka',
        totalAmount: 114500,
        eta: '25 mins',
        distanceRemaining: '4.2 KM',
        agent: {
          id: 'AGT-007',
          name: 'Rana Ahmed',
          avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
          phone: '+8801700000000',
          rating: 4.9,
          currentLat: 23.7509,
          currentLng: 90.3935
        },
        timeline: [
          { 
            status: 'ORDER_PLACED', 
            label: 'Order Placed', 
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), 
            isCompleted: true,
            message: 'System initialization complete.'
          },
          { 
            status: 'ORDER_CONFIRMED', 
            label: 'Order Confirmed', 
            timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), 
            isCompleted: true,
            message: 'Seller confirmed inventory availability.'
          },
          { 
            status: 'PACKING', 
            label: 'Packing', 
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), 
            isCompleted: true,
            message: 'Item verified and secured for transit.'
          },
          { 
            status: 'SHIPPED', 
            label: 'Shipped', 
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), 
            isCompleted: true,
            message: 'Package handed over to PaikarLogistics Dhaka Hub.'
          },
          { 
            status: 'OUT_FOR_DELIVERY', 
            label: 'Out for Delivery', 
            timestamp: '-', 
            isCompleted: false,
            message: 'Agent setting route to destination.'
          }
        ]
    };
    
    res.json({
        status: 'success',
        data: trackingInfo
    });
});

export const deliveryRoutes = router;
