import { z } from 'zod';
import { demoMode } from '@/lib/config';
import { fail, ok } from '@/lib/api/respond';
import { getAuthContext } from '@/lib/auth/server';

const eventSchema = z.object({
  eventType: z.string().trim().min(2).max(50),
  status: z.string().optional(),
  title: z.string().trim().min(2).max(255),
  description: z.string().max(2000).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid event', 422);
  if (demoMode) return ok({ id: `demo-event-${Date.now()}`, shipmentId: id, ...parsed.data }, 201);
  const { supabase, user } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Shipment service is not configured', 503);
  if (!user) return fail('UNAUTHENTICATED', 'Authentication is required', 401);
  const { data, error } = await supabase.from('shipment_events').insert({
    shipment_id: id,
    event_type: parsed.data.eventType,
    status: parsed.data.status,
    title: parsed.data.title,
    description: parsed.data.description,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    created_by: user.id,
  }).select('*').single();
  if (error) return fail('DATABASE_ERROR', 'Unable to record shipment event', 500);
  return ok(data, 201);
}
