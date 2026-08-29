// app/(tabs)/chats.tsx
//
// List of conversations. Tapping one navigates into a dynamic chat detail
// route: app/chat/[id].tsx (not built yet — this is just the list).

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Conversation = {
  id: string;
  // In a real query you'd join to get the OTHER person's name/avatar and
  // the last message — simplified here to keep focus on the screen structure.
  other_user_name: string;
  last_message: string;
  last_message_at: string;
  unread: boolean;
};

export default function ChatsScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Placeholder fetch — replace with a real query once `messages` +
    // `conversations` tables have data. Left as a comment to show the shape
    // you'd write once you get there:
    //
    // const { data } = await supabase
    //   .from('conversations')
    //   .select('id, customer:customer_id(name), worker:worker_id(name), messages(content, sent_at)')
    //   .order('created_at', { ascending: false });
    setConversations([]);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Text className="text-xl font-bold text-gray-900 mt-2 mb-4">Chats</Text>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Ionicons name="chatbubble-ellipses-outline" size={40} color="#CBD5E1" />
            <Text className="text-gray-400 mt-3">No conversations yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <View className="w-12 h-12 rounded-full bg-gray-200 mr-3" />
            <View className="flex-1">
              <Text className="font-bold text-gray-900">{item.other_user_name}</Text>
              <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>{item.last_message}</Text>
            </View>
            {item.unread && <View className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}