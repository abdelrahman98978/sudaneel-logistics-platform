import { z } from 'zod';
import { demoMode } from '@/lib/config';
import { mockShipments } from '@/lib/mock-data';
import { fail, ok } from '@/lib/api/respond';
import { getAuthContext } from '@/lib/auth/server';

const idSchema = z.string().uuid().or(z.string().regex(/^shp-[a-z0-9-]+$/));
const patchSchema = z.object({
  status: z.string().optional(),
  carrierId: z.string().uuid().nullable().optional(),
  driverId: z.string().uuid().nullable().optional(),
  vehicleId: z.string().uuid().nullable().optional(),
  referenceNumber: z.string().max(50).nullable().optional(),
}).refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return fail('INVALID_ID', 'Invalid shipment id', 400);
  if (demoMode) {
    const shipment = mockShipments.find((item) => item.id === id);
    return shipment ? ok(shipment) : fail('NOT_FOUND', 'Shipment was not found', 404);
  }
  const { supabase, user } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Shipment service is not configured', 503);
  if (!user) return fail('UNAUTHENTICATED', 'Authentication is required', 401);
  const { data, error } = await supabase.from('shipments').select('*').eq('id', id).maybeSingle();
  if (error) return fail('DATABASE_ERROR', 'Unable to load shipment', 500);
  return data ? ok(data) : fail('NOT_FOUND', 'Shipment was not found', 404);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return fail('INVALID_ID', 'Invalid shipment id', 400);
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid update', 422);
  if (demoMode) return ok({ id, ...parsed.data, mode: 'demo' });
  const { supabase, user } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Shipment service is not configured', 503);
  if (!user) return fail('UNAUTHENTICATED', 'Authentication is required', 401);
  const { data, error } = await supabase.from('shipments').update({
    status: parsed.data.status,
    carrier_id: parsed.data.carrierId,
    driver_id: parsed.data.driverId,
    vehicle_id: parsed.data.vehicleId,
    reference_number: parsed.data.referenceNumber,
    status_changed_at: parsed.data.status ? new Date().toISOString() : undefined,
  }).eq('id', id).select('*').single();
  if (error) return fail('DATABASE_ERROR', 'Unable to update shipment', 500);
  return ok(data);
}
