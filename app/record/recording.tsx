import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;
const CIRCLE_SIZE = 200 * S;

// Simulated voice volume (0-1) - cycles through natural-feeling values
function useSimulatedVolume(isRecording: boolean) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!isRecording) {
      setVolume(0);
      return;
    }
    const interval = setInterval(() => {
      // Simulate natural speech volume
      const base = 0.3 + Math.random() * 0.4;
      const spike = Math.random() > 0.7 ? 0.3 : 0;
      const pause = Math.random() > 0.85 ? -0.3 : 0;
      setVolume(Math.max(0.05, Math.min(1, base + spike + pause)));
    }, 150);
    return () => clearInterval(interval);
  }, [isRecording]);

  return volume;
}

// Sound wave bars inside the circle
function InnerWaveBar({ index, volume }: { index: number; volume: number }) {
  const height = useSharedValue(4 * S);

  useEffect(() => {
    const center = 2;
    const dist = Math.abs(index - center) / center;
    const maxH = (1 - dist * 0.5) * 24 * S * volume + 4 * S;
    height.value = withTiming(maxH, { duration: 120 });
  }, [volume]);

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 3 * S,
          borderRadius: 1.5 * S,
          backgroundColor: 'rgba(255,255,255,0.9)',
          marginHorizontal: 2 * S,
        },
        animStyle,
      ]}
    />
  );
}

export default function RecordingScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const volume = useSimulatedVolume(isRecording);

  // Timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Ripple animation
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const ripple3 = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      ripple1.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      );
      ripple2.value = withDelay(
        600,
        withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
          -1,
          false,
        ),
      );
      ripple3.value = withDelay(
        1200,
        withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
          -1,
          false,
        ),
      );
    } else {
      cancelAnimation(ripple1);
      cancelAnimation(ripple2);
      cancelAnimation(ripple3);
      ripple1.value = withTiming(0, { duration: 400 });
      ripple2.value = withTiming(0, { duration: 400 });
      ripple3.value = withTiming(0, { duration: 400 });
    }
  }, [isRecording]);

  const makeRippleStyle = (rippleVal: Animated.SharedValue<number>, maxScale: number) =>
    useAnimatedStyle(() => {
      const baseScale = 1 + rippleVal.value * maxScale * 0.3;
      return {
        transform: [{ scale: baseScale }],
        opacity: interpolate(rippleVal.value, [0, 0.5, 1], [0.4, 0.2, 0]),
      };
    });

  const rippleStyle1 = makeRippleStyle(ripple1, volume + 0.5);
  const rippleStyle2 = makeRippleStyle(ripple2, volume + 0.3);
  const rippleStyle3 = makeRippleStyle(ripple3, volume + 0.2);

  // Volume-reactive glow
  const glowScale = useSharedValue(1);
  useEffect(() => {
    glowScale.value = withSpring(1 + volume * 0.15, { damping: 15, stiffness: 150 });
  }, [volume]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const handleTap = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      // Go to paused with current time
      setTimeout(() => {
        router.replace({
          pathname: '/record/paused',
          params: { time: formatTime(seconds), seconds: String(seconds) },
        });
      }, 300);
    }
  }, [isRecording, seconds]);

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Title */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.headerArea}>
          <Text style={styles.sessionTitle}>Series B pitch</Text>
          <Text style={styles.sessionSub}>Recording your presentation</Text>
        </Animated.View>

        {/* Circle area */}
        <View style={styles.circleArea}>
          {/* Ripples */}
          <Animated.View style={[styles.ripple, styles.rippleLarge, rippleStyle1]} />
          <Animated.View style={[styles.ripple, styles.rippleMed, rippleStyle2]} />
          <Animated.View style={[styles.ripple, styles.rippleSmall, rippleStyle3]} />

          {/* Main orange circle */}
          <Animated.View style={[styles.mainCircle, glowStyle]}>
            {/* Wave bars inside */}
            <View style={styles.innerWaves}>
              {Array.from({ length: 5 }).map((_, i) => (
                <InnerWaveBar key={i} index={i} volume={volume} />
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Timer */}
        <View style={styles.timerArea}>
          <Text style={styles.timer}>{formatTime(seconds)}</Text>
          <Text style={styles.timerSub}>of 05:00</Text>
        </View>

        {/* Bottom hint */}
        <Animated.View entering={FadeIn.duration(600).delay(1000)} style={styles.bottomHint}>
          <Text style={styles.hintText}>Tap anywhere to pause</Text>
        </Animated.View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SparkColors.cream,
  },
  safe: {
    flex: 1,
  },
  headerArea: {
    alignItems: 'center',
    marginTop: 24 * S,
  },
  sessionTitle: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 24 * S,
    lineHeight: 30 * S,
    color: SparkColors.cocoaText,
    marginBottom: 4 * S,
  },
  sessionSub: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.orange,
  },
  circleArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: SparkColors.orange,
  },
  rippleLarge: {
    width: CIRCLE_SIZE * 1.8,
    height: CIRCLE_SIZE * 1.8,
  },
  rippleMed: {
    width: CIRCLE_SIZE * 1.5,
    height: CIRCLE_SIZE * 1.5,
  },
  rippleSmall: {
    width: CIRCLE_SIZE * 1.25,
    height: CIRCLE_SIZE * 1.25,
  },
  mainCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    // Orange gradient effect using multiple layers
    backgroundColor: '#FF9900',
    shadowColor: '#FF9900',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40 * S,
    elevation: 20,
  },
  innerWaves: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30 * S,
  },
  timerArea: {
    alignItems: 'center',
    marginBottom: 60 * S,
  },
  timer: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 64 * S,
    lineHeight: 76 * S,
    color: SparkColors.cocoaText,
  },
  timerSub: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.warmGray,
    marginTop: -4 * S,
  },
  bottomHint: {
    alignItems: 'center',
    paddingBottom: 32 * S,
  },
  hintText: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.warmGray,
  },
});
