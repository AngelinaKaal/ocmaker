// This file initializes the connection to your database
const _supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
const _supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';
const _supabase = supabase.createClient(_supabaseUrl, _supabaseKey);