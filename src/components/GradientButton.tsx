// components/GradientButton.tsx
//
// A shared button used across ALL auth screens — instead of copy-pasting
// the gradient + press logic six times, we build it once here and import
// it everywhere. This is the "don't repeat yourself" principle in practice.

import { Text, Pressable, ActivityIndicator, PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = PressableProps & {
  label: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function GradientButton({ label, loading, disabled, ...pressableProps }: Props) {
  return (
    <Pressable {...pressableProps} disabled={disabled || loading} className="w-full">
      {/* LinearGradient can't take a className for its colors — gradients
          are drawn on the GPU, not via stylesheet properties, so the color
          stops are passed as a plain prop. Everything else (padding,
          rounding, opacity) IS controlled via NativeWind className below. */}
      <LinearGradient
        colors={disabled ? ['#4B5563', '#1F2937'] : ['#374151', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl py-4 items-center justify-center flex-row"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-bold">{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}