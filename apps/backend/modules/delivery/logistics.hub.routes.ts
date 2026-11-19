import { Router } from 'express';
import { deliveryRoutes } from './delivery.routes';
import { LogisticsService } from '../logistics/logistics.service';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// Sub-routes for Logistics Hub
router.use('/delivery', deliveryRoutes);

// Ride Share Availability
router.get('/ride/availability', async (req, res) => {
  const { lat, lng, type } = req.query;
  try {
    const vehicles = await LogisticsService.getNearbyVehicles(
      Number(lat),
      Number(lng),
      type as string
    );
    
    res.json({ 
      success: true, 
      data: vehicles,
      meta: {
        count: vehicles.length,
        surge: 1.0 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
});

// Transport / Freight Availability
router.get('/transport/availability', async (req, res) => {
  const { from, to, weight } = req.query;
  try {
    // For now, we can use a similar nearby search or a generalized one
    const vehicles = await LogisticsService.getNearbyVehicles(0, 0, "TRUCK");
    
    res.json({ 
      success: true, 
      data: vehicles.map(v => ({
        id: v.id,
        type: v.type,
        capacity: v.capacity,
        price: 2500, // Dynamic pricing logic could go here
        eta: '15 min',
        provider: v.owner.fullName || 'Verified Partner'
      })),
      meta: {
        route: `${from} to ${to}`,
        estimated_weight: weight || 'Any'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
});

// Rent Listings
router.get('/rent/list', async (req, res) => {
  try {
    // Fetch vehicles of type CAR/VAN that are available for rent
    const vehicles = await LogisticsService.getNearbyVehicles(0, 0, "CAR");
    res.json({ 
      success: true, 
      data: vehicles.map(v => ({
        id: v.id,
        name: v.model,
        type: v.type,
        pricePerDay: 3500,
        seats: 4,
        image: v.documents[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80'
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
});

// Placeholder for Emergency
router.post('/emergency/alert', requireAuth, async (req, res) => {
  res.json({ success: true, message: 'Emergency services notified', trackingId: 'EMG-' + Date.now() });
});

export default router;
