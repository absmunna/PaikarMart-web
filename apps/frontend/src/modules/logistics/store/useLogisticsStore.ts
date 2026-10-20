import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogisticsState, LogisticsActions, ShipmentStatus } from '../types';
import { toast } from 'sonner';

export const useLogisticsStore = create<LogisticsState & LogisticsActions>()(
  persist(
    (set, get) => ({
      shipments: {},
      isLoading: false,
      error: null,

      fetchShipment: async (orderId: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call to fetch tracking info
          await new Promise(resolve => setTimeout(resolve, 800));
          
          if (!get().shipments[orderId]) {
            // Create initial shipment if not exists
            const initialShipment = {
              id: `SHP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              orderId,
              category: 'DELIVERY' as const,
              serviceType: 'Parcel Delivery',
              courierName: 'PaikarForce Logistics',
              trackingNumber: `PK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
              status: 'PENDING' as ShipmentStatus,
              checkpoints: [
                {
                  id: 'cp1',
                  status: 'PENDING' as ShipmentStatus,
                  message: 'Order received and being prepared for pickup',
                  location: 'Seller Warehouse',
                  time: new Date().toISOString()
                }
              ],
              rider: {
                id: 'r1',
                name: 'Anisur Rahman',
                phone: '01712-XXXXXX',
                vehicleType: 'bike' as const,
                rating: 4.8,
                tripsCount: 1250,
                currentLocation: { lat: 23.8103, lng: 90.4125 }
              },
              estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              pickupLocation: 'Dhaka',
              dropLocation: 'Chittagong',
              fare: 150,
              paymentMethod: 'Wallet'
            };

            set((state) => ({
              shipments: { ...state.shipments, [orderId]: initialShipment }
            }));
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch shipment', isLoading: false });
        }
      },

      updateShipmentStatus: (orderId, status, message, location) => {
        set((state) => {
          const shipment = state.shipments[orderId];
          if (!shipment) return state;

          toast.success(`Shipment ${orderId} updated to ${status.toUpperCase()}`);

          const newCheckpoint = {
            id: `cp-${Date.now()}`,
            status,
            message,
            location,
            time: new Date().toISOString()
          };

          return {
            shipments: {
              ...state.shipments,
              [orderId]: {
                ...shipment,
                status,
                checkpoints: [newCheckpoint, ...shipment.checkpoints]
              }
            }
          };
        });
      }
    }),
    {
      name: 'paikar-logistics-storage',
    }
  )
);
