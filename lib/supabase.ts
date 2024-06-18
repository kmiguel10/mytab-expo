import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import {
  DEV_LOCAL_SUPABASE_URL,
  DEV_LOCAL_SUPABASE_ANON_KEY,
  DEV_ONLINE_SUPABASE_URL,
  DEV_ONLINE_SUPABASE_ANON_KEY,
  PROD_SUPABASE_URL,
  PROD_SUPABASE_ANON_KEY,
} from "@env";
/** Local  */
// const supabaseUrl = "http://127.0.0.1:54321";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

/** Online  */
// const supabaseUrl = "https://xstshtvdjvmzebjctwmn.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdHNodHZkanZtemViamN0d21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNzg3MjgsImV4cCI6MjAyMjg1NDcyOH0.TZ5cmTcEW_1NKson2Wk6ZTq8mQTkCcZazam7IyZL9HI";

// Toggle these flags to switch between environments
const useProduction = false; // Set to true to use production variables
const useLocalSupabase = false; // Set to false to use the online environment in development

let supabaseUrl, supabaseAnonKey;

if (useProduction) {
  // Production environment
  supabaseUrl = PROD_SUPABASE_URL;
  supabaseAnonKey = PROD_SUPABASE_ANON_KEY;
} else {
  // Development environment
  if (useLocalSupabase) {
    // Local Supabase in development
    supabaseUrl = DEV_LOCAL_SUPABASE_URL;
    supabaseAnonKey = DEV_LOCAL_SUPABASE_ANON_KEY;
  } else {
    // Online Supabase in development
    supabaseUrl = DEV_ONLINE_SUPABASE_URL;
    supabaseAnonKey = DEV_ONLINE_SUPABASE_ANON_KEY;
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
