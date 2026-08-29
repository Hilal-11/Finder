// app/(tabs)/index.tsx
//
// The Home tab — category grid + featured workers. This is the screen
// users land on right after select-role.tsx.
//
// Notice: no StyleSheet.create() anymore. Every style is a className string,
// compiled by NativeWind. `flex-1` = flex:1, `px-4` = paddingHorizontal:16, etc.
// If a Tailwind class looks unfamiliar, it maps 1:1 to the web Tailwind docs.

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Shape of a row from your `categories` table — matches the schema from earlier.

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-2 mb-4">
          <View>
            <Text className="text-sm text-gray-500">Your location</Text>
            <Text className="text-base font-bold text-gray-900">Una, Himachal Pradesh</Text>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="#111" />
          </Pressable>
        </View>

        {/* Search bar (tapping it sends them to the Explore tab, not a text input here) */}
        <Pressable
          onPress={() => router.push('/(tabs)/explore')}
          className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6"
        >
          <Ionicons name="search" size={18} color="#94A3B8" />
          <Text className="ml-2 text-gray-400">Search for carpenters, photographers...</Text>
        </Pressable>

        {/* Categories grid */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Categories</Text>

        {/* Featured workers placeholder — you'll replace this with a real
            query + FlatList once worker_profiles has data */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Top Rated Near You</Text>
        <View className="bg-gray-50 rounded-2xl p-6 items-center mb-6">
          <Text className="text-gray-400 text-sm">Featured workers will appear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}