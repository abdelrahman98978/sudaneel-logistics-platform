// ============================================================
// Vercel Serverless Function: Public Environment Config
// Exposes ONLY safe public variables configured in Vercel.
// Sensitive server keys (Service Role, DB passwords) are NEVER exposed.
// ============================================================

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || 'https://burseblwjftyktxrmteh.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cnNlYmx3amZ0eWt0eHJtdGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDc5MjksImV4cCI6MjA5ODY4MzkyOX0.MDUdE5SORr_2n1HBiwITxKJ2Jitd0Mz6xNOzcA0wVjw',
    environment: process.env.NODE_ENV || 'production'
  });
};
