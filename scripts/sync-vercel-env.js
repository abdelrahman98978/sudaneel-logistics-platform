const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ============================================================
// SECURITY: This script does NOT contain any API keys.
// It reads from .env.local (which is git-ignored) and uploads
// to Vercel environment variables via the CLI.
// ============================================================

const envFilePath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('====================================================');
console.log('🚀 Sudanil Logistics — Vercel Environment Variables Sync');
console.log('====================================================\n');

// Read from .env.local or prompt user
let envContent = '';
if (fs.existsSync(envFilePath)) {
  envContent = fs.readFileSync(envFilePath, 'utf8');
} else {
  console.log('⚠️  No .env.local file found.');
  console.log('📝 Create one based on .env.example and add your real keys:');
  console.log(`   cp ${envExamplePath} ${envFilePath}\n`);
  console.log('Then re-run this script.\n');
  process.exit(1);
}

// Parse env vars (skip comments and empty lines)
const envVars = envContent
  .split('\n')
  .filter(line => line.trim() && !line.startsWith('#') && line.includes('='))
  .map(line => {
    const eqIndex = line.indexOf('=');
    return {
      key: line.substring(0, eqIndex).trim(),
      value: line.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
    };
  })
  .filter(v => v.key && v.value && !v.key.startsWith('VERCEL_'));

if (envVars.length === 0) {
  console.log('⚠️  No environment variables found in .env.local');
  process.exit(1);
}

console.log('📋 Variables found in .env.local:');
envVars.forEach(v => {
  const masked = v.value.length > 10 ? v.value.substring(0, 6) + '...' + v.value.slice(-4) : '***';
  console.log(`  ✓ ${v.key} = ${masked}`);
});

console.log('\n💡 To upload each variable to Vercel, run:');
envVars.forEach(v => {
  console.log(`  echo "${v.value}" | npx vercel env add ${v.key} production`);
});

console.log('\n🔗 Or configure directly in Vercel Dashboard:');
console.log('  https://vercel.com/dashboard -> Project -> Settings -> Environment Variables\n');
