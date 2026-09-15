const { execSync } = require('child_process');

const envs = [
  ['TELEGRAM_BOT_TOKEN', '8912381404:AAEeBcYPlRaB-AVIWGn2Mf7g92jumc7e8Uo'],
  ['VITE_WEBAPP_URL', 'https://fairytale-crossroads.vercel.app'],
  ['SUPABASE_URL', 'https://okfyxjigazcjzatdqlut.supabase.co'],
  ['SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZnl4amlnYXpjanphdGRxbHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NjQ0NDIsImV4cCI6MjEwNTA0MDQ0Mn0.QbAcT4XkWZ8tRiV5yuzs8R_4itxHbPBEivcp_RhDijM'],
  ['SUPABASE_SERVICE_ROLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZnl4amlnYXpjanphdGRxbHV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTQ2NDQ0MiwiZXhwIjoyMTA1MDQwNDQyfQ.79wfA4cSKV2C2OwnFKAtBSccWWc4drvXQMBqc77rB9o'],
  ['TELEGRAM_WEBHOOK_SECRET', 'super_secret_webhook_key_here']
];

for (const [key, val] of envs) {
  try {
    console.log('Adding', key);
    execSync('npx vercel env add ' + key + ' production --scope sergeynez00-6010s-projects --force', {
      input: val,
      stdio: ['pipe', 'inherit', 'inherit']
    });
  } catch (e) {
    console.error('Error adding', key, e.message);
  }
}
