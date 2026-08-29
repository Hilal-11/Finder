// app/(tabs)/explore.tsx
//
// Search + filter screen. Reads an optional `categoryId` param (passed
// when a user taps a category card on Home) and pre-filters results with it.

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

type WorkerCard = {
  id: string;
  bio: string;
  price: number;
  avg_rating: number;
  users: { name: string } | null; // joined from the `users` table
};

export default function ExploreScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [workers, setWorkers] = useState<WorkerCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkers() {
      setLoading(true);

      // Start the query
      let request = supabase
        .from('worker_profiles')
        .select('id, bio, price, avg_rating, users(name)');

      // Conditionally filter by category if one was passed in via navigation
      if (categoryId) {
        request = request.eq('category_id', categoryId);
      }

      const { data, error } = await request;
      if (error) {
        console.error('Failed to load workers:', error.message);
      } else {
        setWorkers((data as any) ?? []);
      }
      setLoading(false);
    }
    loadWorkers();
  }, [categoryId]);

  // Simple client-side text filter on top of the fetched list.
  // Fine for small result sets; move to a server-side `.ilike()` filter
  // once you have enough workers that this feels slow.
  const filtered = workers.filter((w) =>
    w.users?.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Text className="text-xl font-bold text-gray-900 mt-2 mb-4">Explore</Text>

      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          className="ml-2 flex-1 text-gray-800"
          placeholder="Search by name or skill"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <Text className="text-gray-400 text-center mt-10">Loading...</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-10">No workers found</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: '/worker/[id]', params: { id: item.id } })}
              className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-3"
            >
              <View className="w-14 h-14 rounded-full bg-gray-200 mr-3" />
              <View className="flex-1">
                <Text className="font-bold text-gray-900">{item.users?.name ?? 'Unnamed'}</Text>
                <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>{item.bio}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text className="text-xs text-gray-600 ml-1">{item.avg_rating?.toFixed(1) ?? 'New'}</Text>
                  <Text className="text-xs text-gray-400 ml-3">₹{item.price}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}