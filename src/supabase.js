import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmkonrlfgziagtepgqpl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indta29ucmxmZ3ppYWd0ZXBncXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzcwMzksImV4cCI6MjA2NTk1MzAzOX0.zZnL88pUU_UtvGcDTZm4lZnbr9I5EIbJruB0_hkbl10'
export const supabase = createClient(supabaseUrl, supabaseKey)