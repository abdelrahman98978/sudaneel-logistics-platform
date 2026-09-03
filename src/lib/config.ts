const truthy = new Set(['1', 'true', 'yes', 'on']);

export const demoMode = truthy.has(
  String(process.env.NEXT_PUBLIC_DEMO_MODE ?? process.env.DEMO_MODE ?? '').toLowerCase()
);

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '',
};

export const hasSupabaseConfig = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

export function serverEnv(name: string): string | null {
  return process.env[name] || null;
}
