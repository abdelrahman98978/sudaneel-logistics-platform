// ============================================================
// Sudaneel Smart Pricing Engine (Master Plan Section 17)
// Calculates customer price, minimum profitable floor, market range,
// carrier payout, and Sudaneel margin across 12 operational parameters.
// ============================================================

import { CargoType, VehicleType } from '@/types';

export interface PricingBreakdown {
  baseTransport: number;
  distanceCharge: number;
  vehicleFactor: number;
  weightCharge: number;
  fuelAdjustment: number;
  routeRiskFactor: number;
  insuranceFee: number;
  customsClearanceFee: number;
  storageWarehousingFee: number;
  handlingLoading: number;
  platformMargin: number;
  backhaulDiscount: number;
  subtotal: number;
  vatTax: number;
  total: number;
  currency: string;

  // Master Plan Section 17 Internal Visibility
  recommendedPrice: number;
  minimumProfitableFloor: number;
  marketRange: { low: number; high: number };
  carrierPayout: number;
  sudaneelMarginAmount: number;
  sudaneelMarginPercent: number;
  co2SavingsKg: number;
}

export function calculateSmartPrice(params: {
  distanceKm: number;
  weightKg: number;
  cargoType: CargoType;
  vehicleType: VehicleType;
  isFragile?: boolean;
  isTempControlled?: boolean;
  hasInsurance?: boolean;
  includeCustomsClearance?: boolean;
  storageDays?: number;
  isBackhaulApplicable?: boolean;
  priority?: 'normal' | 'express' | 'critical';
}): PricingBreakdown {
  const {
    distanceKm,
    weightKg,
    cargoType,
    vehicleType,
    isFragile = false,
    isTempControlled = false,
    hasInsurance = true,
    includeCustomsClearance = false,
    storageDays = 0,
    isBackhaulApplicable = false,
    priority = 'normal',
  } = params;

  // 1. Base starting transport fee
  const baseTransport = 180000;

  // 2. Rate per kilometer (SDG / km based on vehicle specifications)
  let ratePerKm = 2400;
  if (vehicleType === 'truck_heavy') ratePerKm = 3200;
  if (vehicleType === 'reefer') ratePerKm = 4500;
  if (vehicleType === 'tanker') ratePerKm = 4000;
  if (vehicleType === 'flatbed') ratePerKm = 3400;
  if (vehicleType === 'pickup') ratePerKm = 1400;

  const distanceCharge = Math.round(distanceKm * ratePerKm);

  // 3. Weight surcharge (above 10 Metric Tons)
  const tonWeight = weightKg / 1000;
  const weightCharge = tonWeight > 10 ? Math.round((tonWeight - 10) * 45000) : 0;

  // 4. Fuel volatility buffer (12% of distance)
  const fuelAdjustment = Math.round(distanceCharge * 0.12);

  // 5. Route Risk & Security Corridor Factor (Red Sea mountains & desert corridors)
  const routeRiskFactor = Math.round(distanceCharge * 0.08);

  // 6. Fragile & Active Cold Chain Temperature Handling
  let handlingLoading = 95000;
  if (isFragile) handlingLoading += 80000;
  if (isTempControlled) handlingLoading += 160000;

  // 7. Cargo Insurance Protection (3.5% of transit value)
  const insuranceFee = hasInsurance ? Math.round((distanceCharge + baseTransport) * 0.035) : 0;

  // 8. Customs Clearance Assistance at Port Sudan or Land Border
  const customsClearanceFee = includeCustomsClearance ? 250000 : 0;

  // 9. Short-term Buffer Storage (e.g. at Free Zone)
  const storageWarehousingFee = storageDays > 0 ? Math.round(storageDays * 45000 * Math.max(1, tonWeight / 5)) : 0;

  // 10. Priority Multiplier
  let priorityMultiplier = 1.0;
  if (priority === 'express') priorityMultiplier = 1.2;
  if (priority === 'critical') priorityMultiplier = 1.4;

  // Subtotal before margin & discounts
  const rawCost =
    (baseTransport +
      distanceCharge +
      weightCharge +
      fuelAdjustment +
      routeRiskFactor +
      handlingLoading +
      insuranceFee +
      customsClearanceFee +
      storageWarehousingFee) *
    priorityMultiplier;

  // 11. Platform Margin (12% default)
  const platformMargin = Math.round(rawCost * 0.12);

  // 12. Backhaul Empty-Truck Optimization Discount (up to 24% customer savings)
  const backhaulDiscount = isBackhaulApplicable ? Math.round(rawCost * 0.24) : 0;

  const subtotal = Math.round(rawCost + platformMargin - backhaulDiscount);
  const vatTax = 0; // Tax-exempt sovereign corridor logistics
  const total = subtotal + vatTax;

  // Carrier payout (Carrier gets base + distance + fuel + weight + handling - platform fee)
  const carrierPayout = Math.round(
    (baseTransport + distanceCharge + weightCharge + fuelAdjustment + handlingLoading) * 0.88
  );

  // Sudaneel platform margin
  const sudaneelMarginAmount = Math.max(0, total - carrierPayout - insuranceFee - customsClearanceFee);
  const sudaneelMarginPercent = Math.round((sudaneelMarginAmount / total) * 100);

  // Minimum profitable floor (Break-even threshold)
  const minimumProfitableFloor = Math.round(carrierPayout * 1.06 + insuranceFee);

  // Market Range Benchmarks
  const marketRange = {
    low: Math.round(total * 0.88),
    high: Math.round(total * 1.25),
  };

  // Carbon Emission Savings (0.82 kg CO2 per empty-km avoided)
  const co2SavingsKg = isBackhaulApplicable ? Math.round(distanceKm * 0.82) : 0;

  return {
    baseTransport,
    distanceCharge,
    vehicleFactor: ratePerKm,
    weightCharge,
    fuelAdjustment,
    routeRiskFactor,
    insuranceFee,
    customsClearanceFee,
    storageWarehousingFee,
    handlingLoading,
    platformMargin,
    backhaulDiscount,
    subtotal,
    vatTax,
    total,
    currency: 'SDG',

    // Section 17 Internal Metrics
    recommendedPrice: total,
    minimumProfitableFloor,
    marketRange,
    carrierPayout,
    sudaneelMarginAmount,
    sudaneelMarginPercent,
    co2SavingsKg,
  };
}
