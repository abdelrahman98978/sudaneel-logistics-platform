import { demoMode, hasSupabaseConfig, serverEnv } from '@/lib/config';
import { fail, ok } from '@/lib/api/respond';

export async function GET() {
  if (!demoMode && !hasSupabaseConfig) {
    return fail('BACKEND_NOT_CONFIGURED', 'Backend configuration is incomplete', 503);
  }
  return ok({
    status: 'ok',
    demoMode,
    integrations: {
      supabase: hasSupabaseConfig ? 'configured' : 'not_configured',
      odoo: serverEnv('ODOO_URL') ? 'configured' : 'not_configured',
    },
    timestamp: new Date().toISOString(),
  });
}
