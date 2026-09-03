import { z } from 'zod';
import { demoMode } from '@/lib/config';
import { findDemoShipment, publicTrackingSnapshot } from '@/lib/api/demo-data';
import { fail, ok } from '@/lib/api/respond';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const trackingSchema = z.string().trim().min(4).max(32).regex(/^[A-Za-z0-9-]+$/);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;
  const parsed = trackingSchema.safeParse(trackingNumber);
  if (!parsed.success) return fail('INVALID_TRACKING_NUMBER', 'Invalid tracking number', 400);

  if (demoMode) {
    const shipment = findDemoShipment(parsed.data);
    return shipment
      ? ok(publicTrackingSnapshot(shipment))
      : fail('NOT_FOUND', 'Shipment was not found', 404);
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Tracking service is not configured', 503);

  const { data, error } = await supabase.rpc('public_tracking_snapshot', {
    p_tracking_number: parsed.data,
  });
  if (error || !data) return fail('NOT_FOUND', 'Shipment was not found', 404);
  return ok(data);
}
