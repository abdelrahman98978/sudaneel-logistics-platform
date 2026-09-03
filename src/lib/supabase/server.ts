import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { hasSupabaseConfig, supabaseConfig } from '@/lib/config';

export async function getSupabaseServerClient() {
  if (!hasSupabaseConfig) return null;
  const cookieStore = await cookies();
  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Cookie writes are unavailable from some Server Component contexts.
        }
      },
    },
  });
}
