import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { SparkColors, SparkFonts } from '@/constants/Spark';
import { useStore } from '@/store/useStore';
import { MOCK_TAKES } from '@/data/mockData';

const { width: SW, height: SH } = Dimensions.get('window');
const S = SW / 390;

const SPRING = { damping: 14, stiffness: 120, mass: 0.8 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/* ---------- FadeInView wrapper ---------- */
function FadeInView({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(delay, withSpring(1, SPRING));
  }, []);
  const anim = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [18, 0], Extrapolation.CLAMP) },
    ],
  }));
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useStore();
  const hasRecordings = MOCK_TAKES.length > 0;
  const latestTake = MOCK_TAKES[0];

  /* bottom sheet for new recording */
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetY = useSharedValue(SH);

  const openSheet = useCallback(() => {
    setSheetOpen(true);
    sheetY.value = withSpring(0, { damping: 20, stiffness: 140 });
  }, []);

  const closeSheet = useCallback(() => {
    sheetY.value = withSpring(SH, { damping: 20, stiffness: 140 });
    setTimeout(() => setSheetOpen(false), 400);
  }, []);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  const dur = latestTake
    ? `${Math.floor(latestTake.durationSec / 60)}:${String(latestTake.durationSec % 60).padStart(2, '0')}`
    : '';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* Header */}
      <FadeInView delay={0}>
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning,</Text>
            <Text style={s.name}>{user.name}</Text>
          </View>
          <View style={s.avatarCircle}>
            <Ionicons name="person" size={20 * S} color={SparkColors.warmGray} />
          </View>
        </View>
      </FadeInView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {hasRecordings ? (
          <>
            {/* Hero card — latest session */}
            <FadeInView delay={80}>
              <AnimatedPressable
                style={s.heroCard}
                onPress={() =>
                  router.push({
                    pathname: '/feedback/overview',
                    params: { takeId: latestTake.id },
                  })
                }
              >
                <Text style={s.heroLabel}>Latest session</Text>
                <Text style={s.heroTitle}>{latestTake.label}</Text>
                <View style={s.heroMeta}>
                  <Text style={s.heroScore}>{latestTake.score}</Text>
                  <Text style={s.heroScoreMax}>/100</Text>
                  <View style={s.heroDot} />
                  <Text style={s.heroDur}>{dur}</Text>
                </View>
                <Text style={s.heroDate}>{latestTake.date}</Text>
              </AnimatedPressable>
            </FadeInView>

            {/* Previous sessions */}
            <FadeInView delay={160}>
              <Text style={s.sectionLabel}>Previous sessions</Text>
              {MOCK_TAKES.slice(1, 4).map((take) => (
                <AnimatedPressable
                  key={take.id}
                  style={s.sessionRow}
                  onPress={() =>
                    router.push({
                      pathname: '/feedback/overview',
                      params: { takeId: take.id },
                    })
                  }
                >
                  <View style={s.sessionLeft}>
                    <Text style={s.sessionTitle}>{take.label}</Text>
                    <Text style={s.sessionDate}>{take.date}</Text>
                  </View>
                  <View style={s.sessionRight}>
                    <Text style={s.sessionScore}>{take.score}</Text>
                    <Ionicons name="chevron-forward" size={16 * S} color={SparkColors.chevron} />
                  </View>
                </AnimatedPressable>
              ))}
            </FadeInView>
          </>
        ) : (
          /* First-use hero */
          <FadeInView delay={80}>
            <View style={s.firstUseCard}>
              <View style={s.firstUseIllustration}>
                <Ionicons name="mic-outline" size={48 * S} color={SparkColors.brandOrange} />
              </View>
              <Text style={s.firstUseTitle}>Ready to practice?</Text>
              <Text style={s.firstUseSub}>
                Record your first speech and get instant AI feedback on pacing, filler words, and
                delivery.
              </Text>
            </View>
          </FadeInView>
        )}

        {/* Quick actions */}
        <FadeInView delay={240}>
          <Text style={s.sectionLabel}>Quick start</Text>
          <View style={s.quickRow}>
            <AnimatedPressable
              style={s.quickCard}
              onPress={() => router.push('/lessons/practice')}
            >
              <Ionicons name="mic-outline" size={24 * S} color={SparkColors.brandOrange} />
              <Text style={s.quickTitle}>Free practice</Text>
              <Text style={s.quickSub}>Record & get feedback</Text>
            </AnimatedPressable>
            <AnimatedPressable
              style={s.quickCard}
              onPress={() => router.push('/lessons/detail?lessonId=pause')}
            >
              <Ionicons name="book-outline" size={24 * S} color={SparkColors.brandOrange} />
              <Text style={s.quickTitle}>Browse lessons</Text>
              <Text style={s.quickSub}>Guided skill building</Text>
            </AnimatedPressable>
          </View>
        </FadeInView>

        {/* Spacer for tab bar */}
        <View style={{ height: 100 * S }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24 * S,
    paddingTop: 8 * S,
    paddingBottom: 16 * S,
  },
  greeting: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.warmGray,
  },
  name: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 24 * S,
    color: SparkColors.cocoaText,
    marginTop: 2 * S,
  },
  avatarCircle: {
    width: 40 * S,
    height: 40 * S,
    borderRadius: 20 * S,
    backgroundColor: SparkColors.warmCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
  },
  scroll: { paddingHorizontal: 24 * S },

  /* Hero card */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 20 * S,
    marginBottom: 20 * S,
  },
  heroLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 11 * S,
    letterSpacing: 1.2,
    color: SparkColors.textLabel,
    marginBottom: 8 * S,
  },
  heroTitle: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 20 * S,
    color: SparkColors.cocoaText,
    marginBottom: 10 * S,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 * S },
  heroScore: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 36 * S,
    color: SparkColors.coral || SparkColors.orangeScore,
  },
  heroScoreMax: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 16 * S,
    color: SparkColors.warmGray,
    marginLeft: 2 * S,
  },
  heroDot: {
    width: 4 * S,
    height: 4 * S,
    borderRadius: 2 * S,
    backgroundColor: SparkColors.warmGray,
    marginHorizontal: 10 * S,
    marginBottom: 4 * S,
  },
  heroDur: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.warmGray,
  },
  heroDate: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
  },

  /* Section */
  sectionLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 11 * S,
    letterSpacing: 1.2,
    color: SparkColors.textLabel,
    marginBottom: 12 * S,
    marginTop: 4 * S,
  },

  /* Session rows */
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 16 * S,
    marginBottom: 10 * S,
  },
  sessionLeft: { flex: 1 },
  sessionTitle: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
    marginBottom: 2 * S,
  },
  sessionDate: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
  },
  sessionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 * S },
  sessionScore: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 20 * S,
    color: SparkColors.cocoaText,
  },

  /* First use */
  firstUseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 28 * S,
    alignItems: 'center',
    marginBottom: 20 * S,
  },
  firstUseIllustration: {
    width: 80 * S,
    height: 80 * S,
    borderRadius: 40 * S,
    backgroundColor: SparkColors.warmCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16 * S,
  },
  firstUseTitle: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 22 * S,
    color: SparkColors.cocoaText,
    marginBottom: 8 * S,
  },
  firstUseSub: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    lineHeight: 22 * S,
    color: SparkColors.warmGray,
    textAlign: 'center',
  },

  /* Quick actions */
  quickRow: { flexDirection: 'row', gap: 12 * S },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 16 * S,
  },
  quickTitle: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
    marginTop: 10 * S,
    marginBottom: 4 * S,
  },
  quickSub: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
  },
});
