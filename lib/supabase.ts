import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

interface Extra {
  PROD_SUPABASE_URL: string;
  PROD_SUPABASE_ANON_KEY: string;
  STAGING_SUPABASE_URL: string;
  STAGING_SUPABASE_ANON_KEY: string;
  DEV_LOCAL_SUPABASE_URL: string;
  DEV_LOCAL_SUPABASE_ANON_KEY: string;
  DEV_ONLINE_SUPABASE_URL: string;
  DEV_ONLINE_SUPABASE_ANON_KEY: string;
}

const {
  PROD_SUPABASE_URL,
  PROD_SUPABASE_ANON_KEY,
  STAGING_SUPABASE_URL,
  STAGING_SUPABASE_ANON_KEY,
  DEV_LOCAL_SUPABASE_ANON_KEY,
  DEV_LOCAL_SUPABASE_URL,
  DEV_ONLINE_SUPABASE_ANON_KEY,
  DEV_ONLINE_SUPABASE_URL,
} = Constants.expoConfig?.extra as Extra;

// // Toggle these flags to switch between environments
const useProduction = false; // Set to true to use production variables
const useLocalSupabase = false; // Set to false to use the online environment in development

const useStaging = false;

let supabaseUrl, supabaseAnonKey;

if (useProduction) {
  // Production environment
  supabaseUrl = PROD_SUPABASE_URL;
  supabaseAnonKey = PROD_SUPABASE_ANON_KEY;
} else if (useStaging) {
  supabaseUrl = STAGING_SUPABASE_URL;
  supabaseAnonKey = STAGING_SUPABASE_ANON_KEY;
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
