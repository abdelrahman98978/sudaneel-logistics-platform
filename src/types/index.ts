// ============================================================
// Sudaneel Logistics Intelligence Platform — Core Types
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'operations_manager'
  | 'dispatcher'
  | 'fleet_manager'
  | 'finance_manager'
  | 'carrier_admin'
  | 'driver'
  | 'shipper_customer';

export type Language = 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';

export type ShipmentStatus =
  | 'draft'
  | 'quote_requested'
  | 'quoted'
  | 'confirmed'
  | 'awaiting_carrier'
  | 'carrier_assigned'
  | 'driver_assigned'
  | 'en_route_pickup'
  | 'at_pickup'
  | 'loading'
  | 'in_transit'
  | 'delayed'
  | 'at_destination'
  | 'unloading'
  | 'delivered'
  | 'pod_verified'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type CargoType =
  | 'general'
  | 'fragile'
  | 'dangerous'
  | 'perishable'
  | 'liquid'
  | 'bulk'
  | 'container'
  | 'heavy_machinery'
  | 'pharmaceuticals';

export type VehicleType =
  | 'truck_heavy'
  | 'truck_medium'
  | 'pickup'
  | 'van'
  | 'flatbed'
  | 'reefer'
  | 'tanker'
  | 'container_40ft'
  | 'trailer';

export type VehicleStatus =
  | 'available'
  | 'assigned'
  | 'loading'
  | 'in_transit'
  | 'maintenance'
  | 'offline'
  | 'returning_empty';

export type DriverStatus = 'available' | 'on_trip' | 'offline' | 'on_break' | 'suspended';

export interface LocationPoint {
  city: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  contactName?: string;
  contactPhone?: string;
}

export interface ShipmentItem {
  id: string;
  description: string;
  quantity: number;
  weightKg: number;
  volumeM3?: number;
  declaredValue?: number;
  hsCode?: string;
}

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  status: ShipmentStatus;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  location?: string;
  lat?: number;
  lng?: number;
  actor?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerNameAr: string;
  customerId: string;
  status: ShipmentStatus;
  cargoType: CargoType;
  cargoDescription: string;
  totalWeightKg: number;
  totalVolumeM3: number;
  origin: LocationPoint;
  destination: LocationPoint;
  pickupDate: string;
  deliveryDate: string;
  requiredVehicleType: VehicleType;
  carrierId?: string;
  carrierName?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  currentLat?: number;
  currentLng?: number;
  price: number;
  currency: string;
  distanceKm: number;
  estimatedEta: string;
  etaConfidence: number; // 0 - 100%
  priority: 'normal' | 'express' | 'critical';
  isFragile: boolean;
  isTempControlled: boolean;
  targetTemp?: number;
  hasInsurance: boolean;
  podOtp?: string;
  podPhotoUrl?: string;
  podSignatureUrl?: string;
  podVerifiedAt?: string;
  events: ShipmentEvent[];
  backhaulMatched?: boolean;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  carrierId: string;
  carrierName: string;
  type: VehicleType;
  makeModel: string;
  year: number;
  capacityTons: number;
  status: VehicleStatus;
  driverId?: string;
  driverName?: string;
  currentLat: number;
  currentLng: number;
  currentCity: string;
  heading: number;
  speedKmh: number;
  fuelLevelPercent: number;
  mileageKm: number;
  nextMaintenanceKm: number;
  isReturningEmpty?: boolean;
  emptyReturnOrigin?: string;
  emptyReturnDestination?: string;
}

export interface Carrier {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  city: string;
  fleetCount: number;
  activeTrips: number;
  trustScore: number; // 0 - 100
  onTimeDeliveryRate: number; // %
  cancellationRate: number; // %
  damageRate: number; // %
  totalTrips: number;
  isVerified: boolean;
  ratingCategory: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

export interface Driver {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  carrierId?: string;
  carrierName?: string;
  licenseNumber: string;
  licenseExpiry: string;
  trustScore: number;
  status: DriverStatus;
  rating: number;
  totalTrips: number;
  onTimeRate: number;
  currentVehiclePlate?: string;
  currentLocation?: string;
  currentLat?: number;
  currentLng?: number;
  walletBalance: number;
}

export interface BackhaulOpportunity {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  carrierName: string;
  currentCity: string;
  targetCity: string;
  availableCapacityTons: number;
  availableDate: string;
  detourDistanceKm: number;
  backhaulScore: number; // 0 - 100
  discountPercent: number; // e.g. 25% cheaper for customer
  expectedProfitIncrease: number; // For carrier
  compatibleShipmentIds: string[];
}

export interface Incident {
  id: string;
  incidentNumber: string;
  shipmentId?: string;
  trackingNumber?: string;
  driverName?: string;
  vehiclePlate?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type:
    | 'accident'
    | 'breakdown'
    | 'security_checkpoint'
    | 'route_blocked'
    | 'temperature_alert'
    | 'delay'
    | 'theft_suspect';
  titleAr: string;
  titleEn: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  status: 'open' | 'investigating' | 'rescue_dispatched' | 'resolved' | 'closed';
  createdAt: string;
  rescueVehicleAssigned?: string;
  rescueEta?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'settlement' | 'fee' | 'payout';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  descriptionAr: string;
  descriptionEn: string;
  referenceShipment?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  shipmentId: string;
  trackingNumber: string;
  customerName: string;
  customerNameAr: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidAt?: string;
}
