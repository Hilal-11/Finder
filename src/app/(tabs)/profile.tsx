// app/(tabs)/profile.tsx
//
// Shows the logged-in user's info + a sign-out button. This is also where
// you'd later add "Switch to Worker mode" if you let one account hold both roles.

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

type UserRow = { name: string | null; email: string | null; phone: string | null; role: string };

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserRow | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('name, email, phone, role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to load profile:', error.message);
        return;
      }
      setProfile(data);
    }
    loadProfile();
  }, []);

  function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          // No manual navigation needed here — the onAuthStateChange listener
          // in the root _layout.tsx detects session becoming null and
          // redirects to (auth)/welcome automatically.
        },
      },
    ]);
  }

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile' },
    { icon: 'shield-checkmark-outline', label: 'Verification' },
    { icon: 'card-outline', label: 'Payments' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Text className="text-xl font-bold text-gray-900 mt-2 mb-6">Profile</Text>

      {/* User info card */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
        <Text className="text-lg font-bold text-gray-900">{profile?.name ?? 'Your Name'}</Text>
        <Text className="text-gray-500 text-sm">{profile?.email ?? profile?.phone ?? ''}</Text>
        <View className="bg-blue-50 px-3 py-1 rounded-full mt-2">
          <Text className="text-blue-600 text-xs font-semibold capitalize">{profile?.role ?? 'visitor'}</Text>
        </View>
      </View>

      {/* Menu list */}
      <View className="mb-6">
        {menuItems.map((item) => (
          <Pressable key={item.label} className="flex-row items-center py-3.5 border-b border-gray-100">
            <Ionicons name={item.icon as any} size={20} color="#475569" />
            <Text className="ml-3 text-gray-800 text-sm font-medium flex-1">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleSignOut}
        className="flex-row items-center justify-center py-3.5 border border-red-200 rounded-xl"
      >
        <Ionicons name="log-out-outline" size={18} color="#DC2626" />
        <Text className="ml-2 text-red-600 font-semibold text-sm">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}