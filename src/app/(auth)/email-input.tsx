// app/(auth)/email-input.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import { supabase } from '../../lib/supabase';

export default function EmailInputScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function sendCode() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      console.error('OTP send error:', error.message);
      return;
    }
    router.push({ pathname: '/(auth)/verify-otp', params: { email, method: 'email' } });
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Pressable onPress={() => router.back()} className="w-10 h-10 justify-center">
        <Ionicons name="arrow-back" size={22} color="#111" />
      </Pressable>

      <View className="items-center mt-6 mb-8">
        <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
          <Ionicons name="mail-outline" size={28} color="#111" />
        </View>
        <Text className="text-lg font-bold text-slate-900 text-center">
          Enter your email address{'\n'}to continue
        </Text>
      </View>

      <TextInput
        className="border border-slate-200 rounded-2xl px-4 py-4 text-base text-slate-900 mb-8"
        placeholder="Enter your email address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <GradientButton label="Send Code" onPress={sendCode} loading={loading} disabled={!email} />
    </SafeAreaView>
  );
}