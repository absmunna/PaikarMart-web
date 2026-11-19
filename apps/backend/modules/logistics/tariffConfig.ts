export type LogisticsVehicleClass =
  | 'bike'
  | 'cng'
  | 'car'
  | 'ambulance'
  | 'parcel'
  | 'pickup'
  | 'truck'
  | 'rental_sedan'
  | 'rental_noah';

export type WeatherTrafficMode = 'normal' | 'rush_hour' | 'rainy';
export type DispatchScheduleType = 'now' | 'scheduled' | 'recurring';

export interface VehicleTariffRule {
  vehicleClass: LogisticsVehicleClass;
  label: string;
  labelBn: string;
  category: 'RIDE' | 'PARCEL' | 'FREIGHT' | 'RENTAL' | 'EMERGENCY';
  baseFareBdt: number;
  perKmBdt: number;
  hourlyRateBdt?: number;
  freeWeightKg: number;
  perExtraKgBdt: number;
  maxCapacityLabel: string;
  baseEtaMin: number;
}

export const VEHICLE_TARIFF_TABLE: Record<LogisticsVehicleClass, VehicleTariffRule> = {
  bike: {
    vehicleClass: 'bike',
    label: 'Express Moto Bike',
    labelBn: 'এক্সপ্রেস মোটরবাইক',
    category: 'RIDE',
    baseFareBdt: 50,
    perKmBdt: 15,
    freeWeightKg: 10,
    perExtraKgBdt: 10,
    maxCapacityLabel: '1 Passenger · Up to 10 kg',
    baseEtaMin: 5
  },
  cng: {
    vehicleClass: 'cng',
    label: 'City CNG Auto',
    labelBn: 'সিটি সিএনজি অটো',
    category: 'RIDE',
    baseFareBdt: 80,
    perKmBdt: 22,
    freeWeightKg: 25,
    perExtraKgBdt: 8,
    maxCapacityLabel: '3 Passengers',
    baseEtaMin: 7
  },
  car: {
    vehicleClass: 'car',
    label: 'AC Sedan Car',
    labelBn: 'এসি সেডান গাড়ি',
    category: 'RIDE',
    baseFareBdt: 140,
    perKmBdt: 34,
    freeWeightKg: 40,
    perExtraKgBdt: 8,
    maxCapacityLabel: '4 Passengers · Boot luggage',
    baseEtaMin: 9
  },
  ambulance: {
    vehicleClass: 'ambulance',
    label: '24/7 Priority Ambulance',
    labelBn: 'জরুরি অ্যাম্বুলেন্স (২৪/৭)',
    category: 'EMERGENCY',
    baseFareBdt: 650,
    perKmBdt: 45,
    freeWeightKg: 100,
    perExtraKgBdt: 0,
    maxCapacityLabel: 'Oxygen & Priority Dispatch',
    baseEtaMin: 8
  },
  parcel: {
    vehicleClass: 'parcel',
    label: 'Courier Express Box',
    labelBn: 'এক্সপ্রেস পার্সেল বক্স',
    category: 'PARCEL',
    baseFareBdt: 70,
    perKmBdt: 14,
    freeWeightKg: 5,
    perExtraKgBdt: 12,
    maxCapacityLabel: 'Up to 35 kg sealed parcel',
    baseEtaMin: 12
  },
  pickup: {
    vehicleClass: 'pickup',
    label: '1-Ton Commercial Pickup',
    labelBn: '১-টন কমার্শিয়াল পিকআপ',
    category: 'FREIGHT',
    baseFareBdt: 1200,
    perKmBdt: 62,
    hourlyRateBdt: 650,
    freeWeightKg: 500,
    perExtraKgBdt: 2,
    maxCapacityLabel: '1,000 – 1,500 kg cartons',
    baseEtaMin: 18
  },
  truck: {
    vehicleClass: 'truck',
    label: '3–5 Ton Covered Truck',
    labelBn: '৩–৫ টন কাভার্ড ট্রাক',
    category: 'FREIGHT',
    baseFareBdt: 3600,
    perKmBdt: 105,
    hourlyRateBdt: 1400,
    freeWeightKg: 2000,
    perExtraKgBdt: 1.5,
    maxCapacityLabel: 'Up to 5,000 kg B2B pallets',
    baseEtaMin: 30
  },
  rental_sedan: {
    vehicleClass: 'rental_sedan',
    label: 'Executive Sedan Rental',
    labelBn: 'সেডান গাড়ি ভাড়া (ঘণ্টা/দিন)',
    category: 'RENTAL',
    baseFareBdt: 900,
    perKmBdt: 24,
    hourlyRateBdt: 550,
    freeWeightKg: 50,
    perExtraKgBdt: 0,
    maxCapacityLabel: '4 Seats · Chauffeur included',
    baseEtaMin: 20
  },
  rental_noah: {
    vehicleClass: 'rental_noah',
    label: 'Noah Microbus XL Rental',
    labelBn: 'নোয়া মাইক্রোবাস ভাড়া',
    category: 'RENTAL',
    baseFareBdt: 1600,
    perKmBdt: 32,
    hourlyRateBdt: 850,
    freeWeightKg: 120,
    perExtraKgBdt: 0,
    maxCapacityLabel: '7–9 Seats · Corporate / Family',
    baseEtaMin: 25
  }
};

export const SURGE_MULTIPLIERS: Record<WeatherTrafficMode, number> = {
  normal: 1.0,
  rush_hour: 1.25,
  rainy: 1.35
};

export const MULTI_STOP_FEE_BDT = 55;
export const SCHEDULED_DISCOUNT_RATE = 0.05;
export const RECURRING_DISCOUNT_RATE = 0.08;

export const HYPERLOCAL_TARIFF_CONFIG = {
  defaultRadiusKm: 5,
  baseFeeBdt: 40,
  includedKm: 2,
  extraPerKmBdt: 12,
  minutesPerKm: 3.5,
  minTransitMinutes: 5
};
