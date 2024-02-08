import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabaseUrl = "https://xstshtvdjvmzebjctwmn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdHNodHZkanZtemViamN0d21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNzg3MjgsImV4cCI6MjAyMjg1NDcyOH0.TZ5cmTcEW_1NKson2Wk6ZTq8mQTkCcZazam7IyZL9HI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
