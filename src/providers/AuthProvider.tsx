import type { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { getSupabase } from '@/lib/supabase';

type AuthState = { user: User | null; loading: boolean; error: string | null };
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function subscribe() {
      const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
        // This callback must not await another Supabase Auth method.
        if (active) setState({ user: session?.user ?? null, loading: false, error: null });
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }

    subscribe().catch(() => {
      if (active) setState({ user: null, loading: false, error: 'Your session could not be loaded. Restart the app and try again.' });
    });

    return () => { active = false; unsubscribe?.(); };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
