import { z } from 'zod';
import { demoMode } from '@/lib/config';
import { mockInvoices } from '@/lib/mock-data';
import { fail, ok } from '@/lib/api/respond';
import { getAuthContext } from '@/lib/auth/server';

const createInvoiceSchema = z.object({ customerId: z.string().uuid(), shipmentId: z.string().uuid().optional(), dueDate: z.string().optional(), subtotal: z.number().nonnegative(), taxAmount: z.number().nonnegative().default(0), currency: z.string().length(3).default('SDG') });

export async function GET() {
  if (demoMode) return ok(mockInvoices);
  const { supabase, user } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Invoice service is not configured', 503);
  if (!user) return fail('UNAUTHENTICATED', 'Authentication is required', 401);
  const { data, error } = await supabase.from('invoices').select('id, invoice_number, shipment_id, customer_id, status, issue_date, due_date, total, amount_paid, amount_due, currency, created_at').order('created_at', { ascending: false });
  if (error) return fail('DATABASE_ERROR', 'Unable to load invoices', 500);
  return ok(data ?? []);
}

export async function POST(request: Request) {
  const parsed = createInvoiceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid invoice', 422);
  if (demoMode) return ok({ ...parsed.data, status: 'draft', mode: 'demo' }, 201);
  const { supabase, user, profile } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Invoice service is not configured', 503);
  if (!user || !profile?.org_id) return fail('UNAUTHENTICATED', 'An organization profile is required', 401);
  const total = parsed.data.subtotal + parsed.data.taxAmount;
  const { data, error } = await supabase.from('invoices').insert({ org_id: profile.org_id, customer_id: parsed.data.customerId, shipment_id: parsed.data.shipmentId, due_date: parsed.data.dueDate, subtotal: parsed.data.subtotal, tax_amount: parsed.data.taxAmount, total, amount_due: total, currency: parsed.data.currency, created_by: user.id }).select('id, invoice_number, status, total, amount_due, currency, created_at').single();
  if (error) return fail('DATABASE_ERROR', 'Unable to create invoice', 500);
  return ok(data, 201);
}
