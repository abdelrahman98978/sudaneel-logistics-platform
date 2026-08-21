const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envVars = [
  {
    key: 'SUPABASE_URL',
    value: 'https://burseblwjftyktxrmteh.supabase.co',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cnNlYmx3amZ0eWt0eHJtdGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDc5MjksImV4cCI6MjA5ODY4MzkyOX0.MDUdE5SORr_2n1HBiwITxKJ2Jitd0Mz6xNOzcA0wVjw',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NODE_ENV',
    value: 'production',
    target: ['production']
  }
];

console.log('====================================================');
console.log('🚀 Sudanil Logistics — Vercel Environment Variables Sync');
console.log('====================================================\n');

console.log('📋 Variables to upload to Vercel:');
envVars.forEach(v => {
  console.log(`  ✓ ${v.key} (${v.target.join(', ')})`);
});

console.log('\n💡 To upload via Vercel CLI, run:');
envVars.forEach(v => {
  console.log(`  npx vercel env add ${v.key} production`);
});

console.log('\n🔗 Or configure directly in Vercel Dashboard:');
console.log('  https://vercel.com/dashboard -> Project -> Settings -> Environment Variables\n');
