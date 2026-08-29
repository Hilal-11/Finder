// app/(auth)/sign-in-options.tsx

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

// This uses your app's scheme (set in app.json) to build the redirect URL,
// instead of hardcoding a placeholder string — so it automatically matches
// whatever scheme you actually configured.
const redirectTo = Linking.createURL('/select-role');

export default function SignInOptionsScreen() {
  const router = useRouter();

  async function handleGoogleSignIn() {
    // Step 1: ask Supabase for the Google auth URL (this does NOT open
    // anything yet — it just returns a URL to send the user to).
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });

    if (error || !data?.url) {
      console.error('Google sign-in error:', error?.message);
      return;
    }

    // Step 2: actually open that URL in a managed in-app browser session,
    // and WAIT for it to redirect back to our app's scheme.
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type === 'success' && result.url) {
      // Step 3: the redirect URL contains the session tokens in its query
      // params — extract them and hand them to Supabase to finish login.
      const { params, errorCode } = Linking.parse(result.url);
      if (errorCode) {
        console.error('OAuth callback error:', errorCode);
        return;
      }

      const { access_token, refresh_token } = params as { access_token?: string; refresh_token?: string };
      if (access_token && refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
        if (sessionError) console.error('Session error:', sessionError.message);
        // No manual navigation needed — onAuthStateChange in the root
        // layout picks up the new session and redirects automatically.
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* flexGrow: 1 + justifyContent: space-between on the ScrollView's
          CONTENT (not the ScrollView itself) is what lets the terms text
          sit at the bottom on tall screens, while still letting the whole
          thing scroll on short screens instead of clipping. */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Pressable onPress={() => router.back()} className="w-10 h-10 justify-center mt-2">
            <Ionicons name="arrow-back" size={22} color="#111" />
          </Pressable>

          <Text className="text-2xl font-extrabold text-slate-900 mt-4">Welcome back! 👋</Text>
          <Text className="text-slate-500 text-sm mt-1 mb-8">Sign in to continue</Text>

          <View className="gap-3">
            <Pressable
              onPress={() => router.push('/(auth)/phone-input')}
              className="flex-row items-center border border-slate-200 rounded-2xl px-4 py-4"
            >
              <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-3">
                <Ionicons name="call-outline" size={18} color="#111" />
              </View>
              <Text className="text-slate-900 font-semibold text-sm">Continue with Phone</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(auth)/email-input')}
              className="flex-row items-center border border-slate-200 rounded-2xl px-4 py-4"
            >
              <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-3">
                <Ionicons name="mail-outline" size={18} color="#111" />
              </View>
              <Text className="text-slate-900 font-semibold text-sm">Continue with Email</Text>
            </Pressable>

            <Pressable onPress={handleGoogleSignIn}>
              <LinearGradient
                colors={['#374151', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center rounded-2xl px-4 py-4"
              >
                <View className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3">
                  <Ionicons name="logo-google" size={16} color="#111" />
                </View>
                <Text className="text-white font-semibold text-sm">Continue with Google</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* This block naturally lands at the bottom because of
            justifyContent: 'space-between' on contentContainerStyle above —
            no absolute positioning needed. */}
        <Text className="text-xs text-slate-400 text-center mb-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}