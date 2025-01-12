import { createClient } from '@supabase/supabase-js'

const { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_PROJECT_URL } = import.meta.env;

const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_ANON_KEY);

export default supabase;