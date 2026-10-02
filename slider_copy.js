const https = require('https');

const SUPABASE_URL = 'irfcboomptcucmudfudw.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZmNib29tcHRjdWNtdWRmdWR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg1NzU3NiwiZXhwIjoyMTA2NDMzNTc2fQ.GCqpXBCZr1vuEyikX3Os9hM0QSC2K2lxPROjcQnLQSI';

function request(path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL,
      path,
      method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // Get current settings
  const result = await request('/rest/v1/settings?select=key,value&key=eq.media_sliders', 'GET');
  const sliders = result[0].value;
  console.log('Current sliders count:', sliders.length);
  
  // Find bracelets home-cat entry
  const braceletEntry = sliders.find(s => s.targetPage === 'home-cat-bracelets');
  if (!braceletEntry) { console.log('No bracelets entry found'); return; }
  
  console.log('Found bracelets media count:', braceletEntry.media.length);
  
  // Check if /shop/category/bracelets already exists
  const existingIdx = sliders.findIndex(s => s.targetPage === '/shop/category/bracelets');
  
  const newEntry = {
    id: 'brace-cat-' + Date.now(),
    targetPage: '/shop/category/bracelets',
    media: braceletEntry.media,
    duration: 5000,
    transition: 'slide'
  };
  
  let newSliders;
  if (existingIdx >= 0) {
    newSliders = sliders.map((s, i) => i === existingIdx ? newEntry : s);
  } else {
    newSliders = [...sliders, newEntry];
  }
  
  // Save back
  const updateResult = await request('/rest/v1/settings?key=eq.media_sliders', 'PATCH', { value: newSliders });
  console.log('Updated! Sliders now:', updateResult.length || 'done');
}

main().catch(console.error);
