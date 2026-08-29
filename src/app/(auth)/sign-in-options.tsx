// app/(auth)/sign-in-options.tsx
//
// Rebuilt to match the reference: back arrow, "Welcome back!" header,
// three option rows each with an icon in a circle + label, and a
// dark-gradient handled per-row now (outlined rows in the reference,
// but the Google button in your image is a solid dark button — replicated
// below as the filled gradient variant, phone/email as outlined rows).

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function SignInOptionsScreen() {
  const router = useRouter();

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'yourapp://select-role' },
    });
    if (error) console.error('Google sign-in error:', error.message);
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Pressable onPress={() => router.back()} className="w-10 h-10 justify-center">
        <Ionicons name="arrow-back" size={22} color="#111" />
      </Pressable>

      <Text className="text-2xl font-extrabold text-slate-900 mt-4">Welcome back! 👋</Text>
      <Text className="text-slate-500 text-sm mt-1 mb-8">Sign in to continue</Text>

      <View className="gap-3">
        {/* Outlined row style — phone and email */}
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

        {/* Filled dark-gradient row — Google */}
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

      <Text className="text-xs text-slate-400 text-center mt-auto mb-8">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </SafeAreaView>
  );
}