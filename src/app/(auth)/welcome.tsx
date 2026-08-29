// app/(auth)/welcome.tsx
//
// Design notes:
// 1. The gradient "blob" in the top-right corner is a LinearGradient shaped
//    into a large circle (via borderRadius = half its width/height) and
//    pushed partly off-screen with negative top/right positioning. That's
//    the standard trick for faking a soft radial glow with a tool that
//    only draws linear gradients.
// 2. The 8 worker photos are arranged with ABSOLUTE positioning inside one
//    relative container — each one just gets a top/left/right offset and a
//    size, rather than living in a grid. That's what gives the "floating
//    scattered circles" look instead of a rigid row of avatars.
// 3. Everything sits inside SafeAreaView + a padded View, so nothing
//    touches the screen edges or the notch/status bar — that's the fix
//    for the missing left/right padding you flagged.

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';

// Rename your 8 images to these, or edit the paths below to match your
// actual filenames in assets/images/.
const workerImages = [
  require('../../../assets/images/workers.png'),
  require('../../../assets/images/clothing.png'),
  require('../../../assets/images/driver.png'),
  require('../../../assets/images/camera.png'),
  require('../../../assets/images/workers2.png'),
  require('../../../assets/images/crops.png'),
  require('../../../assets/images/teams.png'),
  require('../../../assets/images/workers3.png'),
];

// Position, size, and z-index for each floating circle. Tweak these numbers
// freely — this is the "layout" for the whole collage in one place.
const layout = [
  { top: 10, left: 20, size: 64 },
  { top: 0, left: 130, size: 52 },
  { top: 55, left: 210, size: 72 },
  { top: 130, left: 250, size: 56 },
  { top: 150, left: 40, size: 60 },
  { top: 90, left: 90, size: 44 },
  { top: 190, left: 150, size: 50 },
  { top: 20, left: 260, size: 40 },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Decorative gradient blob — absolutely positioned, sits BEHIND
          everything else (it's the first child, and other content is
          rendered on top of it naturally in React Native's stacking order) */}
      <LinearGradient
        colors={['#DBEAFE', '#F8FAFC']} // light blue fading to the page background
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: 130, // half of width/height = perfect circle
        }}
      />

      <View className="flex-1 justify-between px-6">
        {/* Floating image collage */}
        <View className="mt-10" style={{ height: 260 }}>
          <View style={{ height: 240 }} className="relative">
            {workerImages.map((img, i) => {
              const pos = layout[i];
              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    width: pos.size,
                    height: pos.size,
                  }}
                  className="rounded-full overflow-hidden bg-white shadow-md border-2 border-white"
                >
                  <Image source={img} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
              );
            })}
          </View>
        </View>

        {/* Heading + subtext */}
        <View className="mt-4">
          <Text className="text-4xl font-extrabold text-slate-900 leading-tight">
            Find{'\n'}the right person{'\n'}for the job.
          </Text>
          <Text className="text-base text-slate-500 mt-4 leading-relaxed">
            Connect with trusted local professionals near you.
          </Text>
        </View>

        {/* Bottom actions */}
        <View className="mb-8 mt-10">
          <GradientButton label="Get Started" onPress={() => router.push('/(auth)/sign-in-options')} />
          <Pressable onPress={() => router.push('/(auth)/sign-in-options')} className="mt-4">
            <Text className="text-center text-slate-900 font-semibold text-sm">
              I already have an account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}