import type { Shipment } from '@/types';
import type { PublicTrackingSnapshot } from './types';
import { mockShipments } from '@/lib/mock-data';

export function publicTrackingSnapshot(shipment: Shipment): PublicTrackingSnapshot {
  return {
    trackingNumber: shipment.trackingNumber,
    status: shipment.status,
    originCity: shipment.origin.city,
    destinationCity: shipment.destination.city,
    eta: shipment.estimatedEta || null,
    lastUpdatedAt: shipment.events.at(-1)?.timestamp ?? shipment.pickupDate,
    milestones: shipment.events.slice(-8).map((event) => ({
      status: event.status,
      title: event.titleEn,
      location: event.location ?? null,
      occurredAt: event.timestamp,
    })),
  };
}

export function findDemoShipment(trackingNumber: string) {
  return mockShipments.find((shipment) => shipment.trackingNumber.toLowerCase() === trackingNumber.toLowerCase());
}
