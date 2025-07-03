import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Service Role Key project Anda
const SUPABASE_URL = 'https://wmkonrlfgziagtepgqpl.supabase.co'; // <-- Ganti dengan URL project Anda
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indta29ucmxmZ3ppYWd0ZXBncXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM3NzAzOSwiZXhwIjoyMDY1OTUzMDM5fQ.rsoFTyY2yEXarZcvgKSMtES0bGYxtX9JANwu09qc5lQ'; // <-- Ganti dengan Service Role Key Anda

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setAdmin() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    '917e6c77-4abb-418f-8847-db6b16f24e11', // <-- Ganti dengan user ID yang ingin dijadikan admin
    { user_metadata: { role: 'admin' } }
  );
  if (error) {
    console.error('Gagal update metadata:', error);
  } else {
    console.log('Berhasil update metadata:', data);
  }
}

setAdmin(); 