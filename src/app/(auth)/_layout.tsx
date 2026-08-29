// app/(auth)/_layout.tsx
//
// This layout applies ONLY to screens inside the (auth) folder.
// We're using it to hide the default header bar on every auth screen,
// since your designs show custom back arrows instead of a native header.

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // we build our own back buttons per-screen
      }}
    />
  );
}