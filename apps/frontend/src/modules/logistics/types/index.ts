export type ShipmentStatus = 
  | 'PENDING'
  | 'COURIER_PICKED_UP'
  | 'AT_SORTING_CENTER'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CASH_COLLECTED'
  | 'CASH_DEPOSITED'
  | 'RETURNED'
  | 'FAILED'
  | 'RIDER_ASSIGNED'
  | 'RIDER_ARRIVED'
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'LOADING'
  | 'UNLOADING';

export type LogisticsCategory = 
  | 'RIDE' 
  | 'DELIVERY' 
  | 'TRANSPORT' 
  | 'EMERGENCY' 
  | 'RENTAL';

export type VehicleType = 
  | 'bike' 
  | 'car_economy' 
  | 'car_premium' 
  | 'micro' 
  | 'suv' 
  | 'pickup' 
  | 'truck_1ton' 
  | 'truck_3ton' 
  | 'truck_5ton' 
  | 'truck_10ton'
  | 'covered_van'
  | 'ambulance'
  | 'bicycle';

export interface TrackingCheckpoint {
  id: string;
  status: ShipmentStatus;
  message: string;
  location: string;
  time: string;
}

export interface RiderInfo {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: VehicleType;
  rating: number;
  tripsCount: number;
  currentLocation?: { lat: number; lng: number };
}

export interface Shipment {
  id: string;
  orderId: string;
  category: LogisticsCategory;
  serviceType: string; // e.g., 'Food', 'Bike Ride', 'Truck Booking'
  courierName?: string;
  trackingNumber: string;
  status: ShipmentStatus;
  checkpoints: TrackingCheckpoint[];
  rider?: RiderInfo;
  estimatedDelivery: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  paymentMethod: string;
}

export interface LogisticsState {
  shipments: Record<string, Shipment>; // Keyed by orderId or trackingNumber
  isLoading: boolean;
  error: string | null;
}

export interface LogisticsActions {
  fetchShipment: (orderId: string) => Promise<void>;
  updateShipmentStatus: (orderId: string, status: ShipmentStatus, message: string, location: string) => void;
}
