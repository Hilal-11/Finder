// app/(auth)/phone-input.tsx
//
// Rebuilt with NativeWind + back arrow + gradient Send Code button.

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import { supabase } from '../../lib/supabase';

export default function PhoneInputScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function sendCode() {
    setLoading(true);
    const fullPhone = `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      console.error('OTP send error:', error.message);
      return;
    }
    router.push({ pathname: '/(auth)/verify-otp', params: { phone: fullPhone, method: 'phone' } });
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Pressable onPress={() => router.back()} className="w-10 h-10 justify-center">
        <Ionicons name="arrow-back" size={22} color="#111" />
      </Pressable>

      <Text className="text-2xl font-extrabold text-slate-900 mt-4">Enter your phone number</Text>
      <Text className="text-slate-500 text-sm mt-1 mb-8">
        We'll send you a 6-digit code to verify your number
      </Text>

      <View className="flex-row items-center border border-slate-200 rounded-2xl px-4 mb-8">
        <Text className="text-base mr-2 py-4">🇮🇳 +91</Text>
        <View className="w-px h-6 bg-slate-200 mr-3" />
        <TextInput
          className="flex-1 text-base py-4 text-slate-900"
          placeholder="98765 43210"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
      </View>

      <GradientButton label="Send Code" onPress={sendCode} loading={loading} disabled={!phone} />
    </SafeAreaView>
  );
}