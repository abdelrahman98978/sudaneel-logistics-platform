// ============================================================
// Sudaneel Logistics Intelligence Platform — Core Enterprise Types
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'operations_manager'
  | 'dispatcher'
  | 'fleet_manager'
  | 'warehouse_manager'
  | 'customs_officer'
  | 'customs_agent'
  | 'finance_manager'
  | 'support_agent'
  | 'driver'
  | 'carrier_admin'
  | 'corporate_customer'
  | 'individual_customer'
  | 'shipper_customer'
  | 'risk_auditor';

export type Language =
  | 'ar'
  | 'en'
  | 'fr'
  | 'zh'
  | 'tr'
  | 'ru'
  | 'de'
  | 'am'
  | 'sw'
  | 'ur'
  | 'hi'
  | 'it'
  | 'es'
  | 'fa';
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
  | 'returning_empty'
  | 'blocked';

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
  type: 'credit' | 'debit' | 'settlement' | 'fee' | 'payout' | 'escrow_lock' | 'escrow_release';
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

// ============================================================
// 1. WAREHOUSING & WMS TYPES
// ============================================================

export type StorageType = 'dry' | 'reefer' | 'bonded' | 'open_yard' | 'hazardous' | 'silo';

export interface Warehouse {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  address: string;
  totalAreaM2: number;
  availableAreaM2: number;
  storageType: StorageType;
  temperatureCelsius?: string;
  securityLevel: '24/7 CCTV & Guards' | 'Biometric Restricted' | 'Standard Gated';
  loadingDocksCount: number;
  ratePerM2Monthly: number;
  currency: string;
  isBondedCustoms: boolean;
  occupancyPercent: number;
  managerName: string;
  managerPhone: string;
  lat: number;
  lng: number;
}

export interface WarehouseItem {
  id: string;
  warehouseId: string;
  sku: string;
  name: string;
  nameAr: string;
  clientName: string;
  quantity: number;
  unit: string;
  batchNumber: string;
  expiryDate?: string;
  locationBin: string;
  status: 'in_stock' | 'allocated' | 'damaged' | 'in_transit';
}

export interface WarehouseReservation {
  id: string;
  warehouseId: string;
  warehouseName: string;
  clientName: string;
  reservedAreaM2: number;
  storageType: StorageType;
  startDate: string;
  endDate: string;
  monthlyCost: number;
  status: 'confirmed' | 'pending' | 'active' | 'expired';
}

// ============================================================
// 2. PORT SUDAN & CUSTOMS TYPES
// ============================================================

export type PortCustomsStatus = 'manifest_received' | 'under_inspection' | 'duty_assessed' | 'cleared' | 'demurrage_warning' | 'released';

export interface PortContainer {
  id: string;
  containerNumber: string;
  isoCode: '40HC' | '20GP' | '40RF' | '40OT';
  shippingLine: 'Maersk' | 'MSC' | 'CMA CGM' | 'Hapag-Lloyd' | 'Cosco';
  vesselName: string;
  voyageNumber: string;
  arrivalDate: string;
  freeDaysRemaining: number;
  demurrageRatePerDayUSD: number;
  demurrageAccruedUSD: number;
  customsStatus: PortCustomsStatus;
  consignee: string;
  cargoDescription: string;
  gateStatus: 'in_yard' | 'gate_in' | 'loading_truck' | 'gate_out';
  assignedTruckPlate?: string;
  assignedDriverPhone?: string;
  sealNumber: string;
}

// ============================================================
// 3. CROSS-BORDER LOGISTICS TYPES
// ============================================================

export interface BorderCrossing {
  id: string;
  name: string;
  nameAr: string;
  countryTo: 'Egypt' | 'Ethiopia' | 'Chad' | 'South Sudan' | 'Saudi Arabia';
  portOrBorderPost: string;
  averageClearanceHours: number;
  currentQueueTrucks: number;
  operatingStatus: 'normal' | 'congested' | 'restricted' | 'closed';
  customsAgentName: string;
  customsAgentPhone: string;
  requiredDocuments: string[];
  activeConvoysCount: number;
}

// ============================================================
// 4. CLAIMS & DISPUTES TYPES
// ============================================================

export type ClaimType = 'cargo_damage' | 'cargo_loss' | 'delay_compensation' | 'missing_quantity' | 'temp_violation';
export type ClaimStatus = 'open' | 'evidence_review' | 'carrier_investigation' | 'approved_payout' | 'rejected' | 'closed';

export interface Claim {
  id: string;
  claimNumber: string;
  shipmentId: string;
  trackingNumber: string;
  customerName: string;
  carrierName: string;
  claimType: ClaimType;
  amountRequested: number;
  currency: string;
  description: string;
  status: ClaimStatus;
  createdAt: string;
  evidencePhotosCount: number;
  compensationOffered?: number;
  resolutionNotes?: string;
}

// ============================================================
// 5. CRM & ENTERPRISE CONTRACTS TYPES
// ============================================================

export interface EnterpriseContract {
  id: string;
  contractNumber: string;
  customerName: string;
  customerNameAr: string;
  startDate: string;
  endDate: string;
  volumeTier: 'Tier 1 (500+ Tons/mo)' | 'Tier 2 (200+ Tons/mo)' | 'Tier 3 (50+ Tons/mo)';
  committedMonthlySpend: number;
  discountRatePercent: number;
  slaOnTimeTarget: number; // e.g. 98%
  currentSlaAchievement: number; // e.g. 97.8%
  status: 'active' | 'renewal_due' | 'pending_signature' | 'expired';
  designatedCorridors: string[];
  penaltyRatePercent: number;
}

export interface CrmOpportunity {
  id: string;
  opportunityCode: string;
  clientName: string;
  stage: 'lead' | 'qualification' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  expectedVolumeTons: number;
  estimatedAnnualValue: number;
  primaryCorridor: string;
  assignedSalesRep: string;
  probabilityPercent: number;
  nextFollowUpDate: string;
}

// ============================================================
// 6. AI CENTER & DIGITAL TWIN TYPES
// ============================================================

export interface DigitalTwinScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  parameterChanged: string;
  parameterValue: string;
  simulatedDemandChangePercent: number;
  simulatedFleetUtilization: number;
  simulatedEmptyKmPercent: number;
  simulatedProfitMarginChange: string;
  recommendationAr: string;
  recommendationEn: string;
}

export interface AnomalyAlert {
  id: string;
  type: 'fake_gps' | 'fuel_siphon' | 'route_deviation' | 'duplicate_pod' | 'speed_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  titleAr: string;
  titleEn: string;
  assetPlate: string;
  driverName: string;
  location: string;
  detectedAt: string;
  explanationAr: string;
  explanationEn: string;
  confidenceScore: number;
  status: 'pending_review' | 'confirmed_fraud' | 'false_alarm' | 'cleared';
}

// ============================================================
// 7. FREIGHT NEGOTIATION TYPES
// ============================================================

export interface NegotiationOffer {
  id: string;
  shipmentId: string;
  trackingNumber: string;
  carrierId: string;
  carrierName: string;
  carrierTrustScore: number;
  originalPrice: number;
  carrierOfferPrice: number;
  customerCounterPrice?: number;
  currentStatus: 'carrier_offered' | 'customer_countered' | 'accepted' | 'declined' | 'expired';
  savingsAmount: number;
  savingsPercent: number;
  expiresInMinutes: number;
  createdAt: string;
}

// ============================================================
// 8. BULK SHIPMENTS & REPORTING
// ============================================================

export interface BulkShipmentRow {
  rowId: number;
  pickupCity: string;
  destCity: string;
  cargoDesc: string;
  weightTons: number;
  vehicleType: VehicleType;
  pickupDate: string;
  priceEstimate: number;
  validationStatus: 'valid' | 'duplicate' | 'invalid_address' | 'weight_exceeded';
  errorMessage?: string;
}

// ============================================================
// 9. CUSTOMS WORKSPACE & DECLARATION TYPES (Master Plan Sec. 15)
// ============================================================

export interface CustomsDeclaration {
  id: string;
  declarationNumber: string;
  importerExporter: string;
  bolNumber: string;
  hsCode: string;
  cargoDescription: string;
  commercialInvoiceValue: number;
  originCountry: string;
  entryPort: string;
  calculatedDutyTax: number;
  permitsRequired: string[];
  permitsStatus: 'approved' | 'under_review' | 'missing';
  inspectionStatus: 'green_channel' | 'physical_inspection_pending' | 'inspection_completed' | 'hold';
  releaseStatus: 'draft' | 'submitted' | 'duty_paid' | 'released' | 'rejected';
  submittedAt: string;
  releasedAt?: string;
  officerNotes?: string;
}
