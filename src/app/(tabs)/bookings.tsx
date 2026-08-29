// app/(tabs)/bookings.tsx
//
// Shows the current user's bookings/inquiries. Uses a simple tab-within-tab
// pattern (Upcoming / Past) with local state — no navigation needed for this,
// since it's just a filter on the same data, not a different screen.

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

type Booking = {
  id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  event_date: string;
  requirement_notes: string;
};

export default function BookingsScreen() {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function loadBookings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('id, status, event_date, requirement_notes')
        .eq('customer_id', user.id) // NOTE: swap to .eq('worker_id', user.id) on the worker-facing version of this screen
        .order('event_date', { ascending: filter === 'upcoming' });

      if (error) {
        console.error('Failed to load bookings:', error.message);
        return;
      }
      setBookings(data ?? []);
    }
    loadBookings();
  }, [filter]);

  const statusColor: Record<Booking['status'], string> = {
    pending: 'text-amber-600 bg-amber-50',
    accepted: 'text-blue-600 bg-blue-50',
    completed: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Text className="text-xl font-bold text-gray-900 mt-2 mb-4">Bookings</Text>

      {/* Segmented toggle */}
      <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
        {(['upcoming', 'past'] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`flex-1 py-2 rounded-lg items-center ${filter === f ? 'bg-white' : ''}`}
          >
            <Text className={`text-sm font-semibold capitalize ${filter === f ? 'text-gray-900' : 'text-gray-400'}`}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Ionicons name="calendar-outline" size={40} color="#CBD5E1" />
            <Text className="text-gray-400 mt-3">No {filter} bookings</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-gray-50 rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between items-start">
              <Text className="font-bold text-gray-900 flex-1 pr-2">{item.requirement_notes}</Text>
              <View className={`px-2 py-1 rounded-full ${statusColor[item.status]}`}>
                <Text className={`text-xs font-semibold capitalize ${statusColor[item.status].split(' ')[0]}`}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 text-xs mt-2">{item.event_date}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}