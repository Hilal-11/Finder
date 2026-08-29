// app/(auth)/select-role.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

type Role = 'visitor' | 'worker';

export default function SelectRoleScreen() {
  const router = useRouter();

  async function chooseRole(role: Role) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('users').upsert({ id: user.id, role });
    if (error) {
      console.error('Role save error:', error.message);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Text className="text-2xl font-extrabold text-slate-900 mt-6">Choose your role</Text>
      <Text className="text-slate-500 text-sm mt-1 mb-8">This helps us personalize your experience</Text>

      <Pressable
        onPress={() => chooseRole('visitor')}
        className="flex-row items-center border border-slate-200 rounded-2xl p-4 mb-4"
      >
        <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center mr-3">
          <Ionicons name="search" size={20} color="#111" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-slate-900 text-sm">I'm looking for a Service/Professional</Text>
          <Text className="text-slate-500 text-xs mt-0.5">Find professionals for any job</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
      </Pressable>

      <Pressable
        onPress={() => chooseRole('worker')}
        className="flex-row items-center border border-slate-200 rounded-2xl p-4"
      >
        <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center mr-3">
          <Ionicons name="briefcase" size={20} color="#111" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-slate-900 text-sm">I'm a Professional/Worker</Text>
          <Text className="text-slate-500 text-xs mt-0.5">Offer your services to customers</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
      </Pressable>

      <Text className="text-xs text-slate-400 text-center mt-auto mb-8">
        You can change this later in your profile settings
      </Text>
    </SafeAreaView>
  );
}