// app/(tabs)/_layout.tsx
//
// This is a SPECIAL kind of layout: instead of <Stack>, we use <Tabs> from
// expo-router. It automatically renders a bottom tab bar, and every screen
// file in this (tabs) folder becomes one tab — no manual wiring needed.

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// 👆 @expo/vector-icons ships with Expo by default — no install needed.
// If you have your OWN custom icon PNGs/SVGs in assets/icons/, see the
// commented-out alternative further down for how to swap them in instead.

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',   // blue when tab is selected
        tabBarInactiveTintColor: '#94A3B8', // gray when not selected
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {/* Each <Tabs.Screen> maps to a file in this folder by its `name`. */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

// ─────────────────────────────────────────────────────────────
// TO USE YOUR OWN ICON IMAGES INSTEAD (e.g. assets/icons/home.png):
//
// import { Image } from 'react-native';
//
// tabBarIcon: ({ focused }) => (
//   <Image
//     source={require('../../assets/icons/home.png')}
//     style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
//   />
// ),
//
// Repeat per tab with the matching icon file. If you have separate
// "active" and "inactive" versions of each icon (common in Figma exports),
// swap the `source` based on `focused` instead of using opacity.
// ─────────────────────────────────────────────────────────────