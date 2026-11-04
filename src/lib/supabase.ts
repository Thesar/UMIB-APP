import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import type { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = supabaseUrl && publishableKey
  ? createClient<Database>(supabaseUrl, publishableKey, {
      auth: {
        ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error('Screamulus is not connected yet. Please ask the team to finish setup.');
  }

  return supabase;
}

export function watchSessionRefresh() {
  if (!supabase || Platform.OS === 'web') return;

  const client = supabase;
  const update = (state: typeof AppState.currentState) => {
    if (state === 'active') client.auth.startAutoRefresh();
    else client.auth.stopAutoRefresh();
  };

  update(AppState.currentState);
  const subscription = AppState.addEventListener('change', update);

  return () => {
    subscription.remove();
    client.auth.stopAutoRefresh();
  };
}
