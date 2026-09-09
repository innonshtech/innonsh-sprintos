import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Supabase URL or Service Role Key is missing. Check your environment variables.');
}

// Service role key is used in backend to bypass RLS when necessary or act as admin
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
