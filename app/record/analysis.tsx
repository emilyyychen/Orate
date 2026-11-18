import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

type StepStatus = 'done' | 'active' | 'pending';

function StepIndicator({ status }: { status: StepStatus }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'done') {
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [status]);

  if (status === 'done') {
    return (
      <Animated.View style={[styles.checkCircle, { opacity }]}>
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
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

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

function FadeInView({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 600, delay, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}

function FadeInDownView({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}

export default function AnalysisScreen() {
  const router = useRouter();
  const { time = '05:12', pace = '140' } = useLocalSearchParams<{
    time?: string;
    pace?: string;
  }>();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    ANALYSIS_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(i + 1);
        }, 1500 + i * 1800),
      );
    });

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
        <FadeInView delay={0} style={styles.characterContainer}>
          <Image
            source={require('../../assets/images/orate-character.png')}
            style={styles.character}
            resizeMode="contain"
          />
        </FadeInView>

        {/* Title */}
        <FadeInDownView delay={200}>
          <Text style={styles.title}>Recording complete</Text>
        </FadeInDownView>

        {/* Subtitle */}
        <FadeInView delay={400}>
          <Text style={styles.subtitle}>
            {SUBTITLES[subtitleIndex]}
          </Text>
        </FadeInView>

        {/* Steps */}
        <FadeInDownView delay={600} style={styles.stepsContainer}>
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
                  <Text style={styles.doneLabel}>Done</Text>
                )}
              </View>
            );
          })}
        </FadeInDownView>

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
    backgroundColor: '#6BBF59',
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
    color: '#6BBF59',
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
