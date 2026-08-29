// app/(auth)/verify-otp.tsx
//
// Upgraded from the single-TextInput version to a REAL 6-box OTP input,
// matching the reference design. The trick: there's still only ONE hidden
// TextInput actually capturing keystrokes — the 6 boxes are just visual
// Views that each display one character from that hidden input's value.
// This is a common pattern for OTP UIs; it avoids the complexity of
// managing focus across 6 separate real inputs.

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import { supabase } from '../../lib/supabase';

const CODE_LENGTH = 6;

export default function VerifyOtpScreen() {
  const { phone, email, method } = useLocalSearchParams<{
    phone?: string;
    email?: string;
    method: 'phone' | 'email';
  }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const hiddenInputRef = useRef<TextInput>(null);

  async function verifyCode() {
    setLoading(true);
    const { error } =
      method === 'phone'
        ? await supabase.auth.verifyOtp({ phone: phone!, token: code, type: 'sms' })
        : await supabase.auth.verifyOtp({ email: email!, token: code, type: 'email' });
    setLoading(false);
    if (error) {
      console.error('Verification error:', error.message);
      return;
    }
    router.push('/(auth)/select-role');
  }

  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? '');

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Pressable onPress={() => router.back()} className="w-10 h-10 justify-center">
        <Ionicons name="arrow-back" size={22} color="#111" />
      </Pressable>

      <Text className="text-2xl font-extrabold text-slate-900 mt-4">Enter the 6-digit code</Text>
      <Text className="text-slate-500 text-sm mt-1 mb-8">
        We sent the code to {method === 'phone' ? phone : email}
      </Text>

      {/* Tapping anywhere on the boxes focuses the hidden real input */}
      <Pressable onPress={() => hiddenInputRef.current?.focus()} className="flex-row justify-between mb-8">
        {digits.map((digit, i) => (
          <View
            key={i}
            className={`w-12 h-14 rounded-xl border items-center justify-center ${
              i === code.length ? 'border-slate-900 border-2' : 'border-slate-200'
            }`}
          >
            <Text className="text-xl font-bold text-slate-900">{digit}</Text>
          </View>
        ))}
      </Pressable>

      {/* This TextInput is invisible — positioned off-screen — but stays
          focused and captures all the real keyboard input */}
      <TextInput
        ref={hiddenInputRef}
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
        keyboardType="number-pad"
        maxLength={CODE_LENGTH}
        autoFocus
        className="absolute opacity-0 h-0"
      />

      <GradientButton label="Verify" onPress={verifyCode} loading={loading} disabled={code.length < CODE_LENGTH} />
    </SafeAreaView>
  );
}