// app/(auth)/welcome.tsx
//
// Circular photo collage: one center image + 7 evenly spaced in a ring,
// positioned with trigonometry inside a fixed 280x280 box that flexbox
// centers on any screen width.
//
// Wrapped in a ScrollView as a safety net — on shorter phones (iPhone SE,
// some Androids), collage + heading + button combined can be taller than
// the screen. Without scroll, that overflow just gets silently clipped at
// the top; with it, the content scrolls into view instead. On taller
// screens this looks and behaves identically to a plain View.

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';

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

const ORBIT_SIZE = 300;
const ORBIT_RADIUS = 125;
const CENTER_SIZE = 76;
const RING_SIZE = 54;

function buildLayout() {
  const center = ORBIT_SIZE / 2;
  const positions: { top: number; left: number; size: number }[] = [];

  positions.push({
    top: center - CENTER_SIZE / 2,
    left: center - CENTER_SIZE / 2,
    size: CENTER_SIZE,
  });

  const ringCount = workerImages.length - 1;
  for (let i = 0; i < ringCount; i++) {
    const angle = (360 / ringCount) * i * (Math.PI / 180);
    const x = ORBIT_RADIUS * Math.cos(angle);
    const y = ORBIT_RADIUS * Math.sin(angle);
    positions.push({
      top: center + y - RING_SIZE / 2,
      left: center + x - RING_SIZE / 2,
      size: RING_SIZE,
    });
  }

  return positions;
}

const layout = buildLayout();

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <LinearGradient
        colors={['#DBEAFE', '#F8FAFC']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: 130 }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full mt-10 items-center justify-center">
          <View style={{ width: ORBIT_SIZE, height: ORBIT_SIZE }} className="relative">
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

        <View className="mt-10">
          <Text className="text-4xl font-extrabold text-slate-900 leading-tight">
            Find{'\n'}the right person{'\n'}for the job.
          </Text>
          <Text className="text-base text-neutral-800 mt-4 leading-relaxed ">
            Connect with trusted local professionals near you.
          </Text>
        </View>

        <View className="mb-8 mt-10">
          <GradientButton label="Get Started" onPress={() => router.push('/(auth)/sign-in-options')} />
          <Pressable onPress={() => router.push('/(auth)/sign-in-options')} className="mt-4">
            <Text className="text-center text-slate-900 font-semibold text-sm">
              I already have an account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}