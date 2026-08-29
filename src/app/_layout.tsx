// app/_layout.tsx
//
// This is the ROOT layout — it wraps EVERY screen in the entire app.
// Its job here: check if the user is logged in, and send them to the
// right place (auth flow, or main app) automatically.
//
// This pattern is called a "protected route" pattern.

import type { Session } from '@supabase/supabase-js';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import "../../global.css"
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments(); // tells us which folder/route we're currently in

  useEffect(() => {
    // 1. Check if a session already exists (user was logged in before, app just reopened)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for login/logout events happening anywhere in the app
    //    (e.g. after OTP verification succeeds elsewhere)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup: stop listening when this component unmounts
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // don't redirect until we know the auth state

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Not logged in, and NOT already on an auth screen → send to welcome screen
      router.replace('/(auth)/welcome');
    } else if (session && inAuthGroup) {
      // Logged in, but somehow still on an auth screen → send to main app
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  if (loading) return null; // could show a splash/loading screen here instead

  // <Slot /> renders whichever child screen the router has decided to show
  return <Slot />;
}