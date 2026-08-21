// ============================================================
// Vercel Serverless Function: Public Environment Config
// Exposes ONLY safe public variables configured in Vercel.
// Sensitive server keys (Service Role, DB passwords) are NEVER exposed.
// SECURITY: No fallback keys. All values come from Vercel env vars.
// ============================================================

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(503).json({
      error: 'Environment variables not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Dashboard.',
      SUPABASE_URL: supabaseUrl ? '✓ Set' : '✗ Missing',
      SUPABASE_ANON_KEY: supabaseAnonKey ? '✓ Set' : '✗ Missing'
    });
  }

  res.status(200).json({
    SUPABASE_URL: supabaseUrl,
    SUPABASE_ANON_KEY: supabaseAnonKey,
    environment: process.env.NODE_ENV || 'production'
  });
};
