import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://erggniuhzvaiiidntorl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P3fR9IF7V9WqIraByv9dgA_gKzbtOf1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
