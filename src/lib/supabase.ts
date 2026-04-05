import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ykvivlfnndexkwkcxrmz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrdml2bGZubmRleGt3a2N4cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNTYzMzIsImV4cCI6MjA4MTczMjMzMn0.hcPdyBo311YEk4_OX0uH8VQx1GbLpNyNiiz8sbSY358';

// Create client with fallback for demo mode
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

export const auth = supabase.auth;
