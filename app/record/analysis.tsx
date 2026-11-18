import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInDown,
  Easing,
} from 'react-native-reanimated';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

const ANALYSIS_STEPS = [
  'Transcribing your recording',
  'Measuring pacing',
  'Reviewing clarity',
  'Checking pauses',
  'Comparing your takes',
];

const SUBTITLES = [
  'Reviewing this recording',
  'Reviewing this recording',
  'Comparing with your last take',
  'Comparing with your last take',
  'Preparing your feedback',
];

// Status: 'done' | 'active' | 'pending'
type StepStatus = 'done' | 'active' | 'pending';

function StepIndicator({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={styles.checkCircle}>
        <Text style={styles.checkMark}>✓</Text>
      </Animated.View>
    );
  }

  if (status === 'active') {
    return <View style={styles.activeDot} />;
  }

  return <View style={styles.pendingDot} />;
}

function ProgressBar({ progress }: { progress: number }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 600, easing: Easing.out(Easing.ease) });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, barStyle]} />
    </View>
  );
}

// Decorative background dots
function BackgroundDots() {
  return (
    <View style={styles.dotsGrid} pointerEvents="none">
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <View
            key={`${row}-${col}`}
            style={[
              styles.bgDot,
              {
                top: 40 * S + row * 72 * S,
                left: -10 * S + col * 100 * S,
                opacity: 0.08,
              },
            ]}
          />
        )),
      )}
    </View>
  );
}

export default function AnalysisScreen() {
  const router = useRouter();
  const { time = '05:12', pace = '140' } = useLocalSearchParams<{
    time?: string;
    pace?: string;
  }>();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Progress through steps one by one
    const timers: ReturnType<typeof setTimeout>[] = [];

    ANALYSIS_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(i + 1);
        }, 1500 + i * 1800),
      );
    });

    // After all steps done, navigate to results
    timers.push(
      setTimeout(() => {
        router.replace({
          pathname: '/record/results-ready',
          params: { time, pace },
        });
      }, 1500 + ANALYSIS_STEPS.length * 1800 + 1200),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return 'done';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const subtitleIndex = Math.min(currentStep, SUBTITLES.length - 1);
  const progress = (currentStep / ANALYSIS_STEPS.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundDots />

      <View style={styles.content}>
        {/* Character */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.characterContainer}>
          <Image
            source={require('../../assets/images/orate-character.png')}
            style={styles.character}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Text style={styles.title}>Recording complete</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View entering={FadeIn.duration(400).delay(400)}>
          <Text style={styles.subtitle} key={subtitleIndex}>
            {SUBTITLES[subtitleIndex]}
          </Text>
        </Animated.View>

        {/* Steps */}
        <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.stepsContainer}>
          {ANALYSIS_STEPS.map((stepText, i) => {
            const status = getStatus(i);
            return (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <StepIndicator status={status} />
                  <Text
                    style={[
                      styles.stepText,
                      status === 'pending' && styles.stepTextPending,
                      status === 'done' && styles.stepTextDone,
                    ]}
                  >
                    {stepText}
                  </Text>
                </View>
                {status === 'done' && (
                  <Animated.Text entering={FadeIn.duration(300)} style={styles.doneLabel}>
                    Done
                  </Animated.Text>
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SparkColors.cream,
  },
  dotsGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  bgDot: {
    position: 'absolute',
    width: 48 * S,
    height: 48 * S,
    borderRadius: 24 * S,
    backgroundColor: '#E8CCAA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28 * S,
    justifyContent: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20 * S,
  },
  character: {
    width: 80 * S,
    height: 80 * S,
  },
  title: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 28 * S,
    lineHeight: 34 * S,
    color: SparkColors.cocoaText,
    marginBottom: 8 * S,
  },
  subtitle: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    lineHeight: 21 * S,
    color: SparkColors.warmGray,
    marginBottom: 28 * S,
  },
  stepsContainer: {
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14 * S,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * S,
    flex: 1,
  },
  checkCircle: {
    width: 20 * S,
    height: 20 * S,
    borderRadius: 10 * S,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12 * S,
    fontWeight: '700',
  },
  activeDot: {
    width: 12 * S,
    height: 12 * S,
    borderRadius: 6 * S,
    backgroundColor: SparkColors.orange,
    marginHorizontal: 4 * S,
  },
  pendingDot: {
    width: 12 * S,
    height: 12 * S,
    borderRadius: 6 * S,
    backgroundColor: '#D5CCC3',
    marginHorizontal: 4 * S,
  },
  stepText: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 16 * S,
    lineHeight: 22 * S,
    color: SparkColors.cocoaText,
    flex: 1,
  },
  stepTextPending: {
    color: SparkColors.warmGray,
  },
  stepTextDone: {
    color: SparkColors.cocoaText,
  },
  doneLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 14 * S,
    color: '#4CAF50',
  },
  progressContainer: {
    marginTop: 24 * S,
  },
  progressTrack: {
    height: 4 * S,
    backgroundColor: '#E8DFC6',
    borderRadius: 2 * S,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SparkColors.orange,
    borderRadius: 2 * S,
  },
});
