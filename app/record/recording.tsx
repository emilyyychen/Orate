import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;
const CIRCLE_SIZE = 200 * S;

function useSimulatedVolume(isRecording: boolean) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!isRecording) {
      setVolume(0);
      return;
    }
    const interval = setInterval(() => {
      const base = 0.3 + Math.random() * 0.4;
      const spike = Math.random() > 0.7 ? 0.3 : 0;
      const pause = Math.random() > 0.85 ? -0.3 : 0;
      setVolume(Math.max(0.05, Math.min(1, base + spike + pause)));
    }, 150);
    return () => clearInterval(interval);
  }, [isRecording]);

  return volume;
}

function InnerWaveBar({ index, volume }: { index: number; volume: number }) {
  const height = useRef(new Animated.Value(4 * S)).current;

  useEffect(() => {
    const center = 2;
    const dist = Math.abs(index - center) / center;
    const maxH = (1 - dist * 0.5) * 24 * S * volume + 4 * S;
    Animated.timing(height, {
      toValue: maxH,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }, [volume]);

  return (
    <Animated.View
      style={{
        width: 3 * S,
        height,
        borderRadius: 1.5 * S,
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginHorizontal: 2 * S,
      }}
    />
  );
}

function FadeInView({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
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

  // Ripple animations
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      const makeRipple = (val: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(val, {
              toValue: 1,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        );
      const a1 = makeRipple(ripple1, 0);
      const a2 = makeRipple(ripple2, 600);
      const a3 = makeRipple(ripple3, 1200);
      a1.start();
      a2.start();
      a3.start();
      return () => {
        a1.stop();
        a2.stop();
        a3.stop();
      };
    }
  }, [isRecording]);

  // Glow scale
  const glowScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(glowScale, {
      toValue: 1 + volume * 0.15,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  }, [volume]);

  const makeRippleStyle = (rippleVal: Animated.Value, maxScale: number) => ({
    transform: [
      {
        scale: rippleVal.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1 + maxScale * 0.3],
        }),
      },
    ],
    opacity: rippleVal.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.4, 0.2, 0],
    }),
  });

  // Stop button animation
  const stopScale = useRef(new Animated.Value(1)).current;

  const handleStop = useCallback(() => {
    if (isRecording) {
      // Animate stop button press
      Animated.sequence([
        Animated.timing(stopScale, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(stopScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setIsRecording(false);
      setTimeout(() => {
        router.replace({
          pathname: '/record/paused',
          params: { time: formatTime(seconds), seconds: String(seconds) },
        });
      }, 300);
    }
  }, [isRecording, seconds]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Title */}
      <FadeInView style={styles.headerArea}>
        <Text style={styles.sessionTitle}>Series B pitch</Text>
      </FadeInView>

      {/* Circle area */}
      <View style={styles.circleArea}>
        {/* Ripples */}
        <Animated.View style={[styles.ripple, styles.rippleLarge, makeRippleStyle(ripple1, volume + 0.5)]} />
        <Animated.View style={[styles.ripple, styles.rippleMed, makeRippleStyle(ripple2, volume + 0.3)]} />
        <Animated.View style={[styles.ripple, styles.rippleSmall, makeRippleStyle(ripple3, volume + 0.2)]} />

        {/* Main orange circle */}
        <Animated.View style={[styles.mainCircle, { transform: [{ scale: glowScale }] }]}>
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

      {/* Stop button */}
      <FadeInView delay={500} style={styles.stopArea}>
        <Pressable onPress={handleStop}>
          <Animated.View style={[styles.stopButton, { transform: [{ scale: stopScale }] }]}>
            <View style={styles.stopSquare} />
          </Animated.View>
        </Pressable>
      </FadeInView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SparkColors.cream,
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
    marginBottom: 32 * S,
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
  stopArea: {
    alignItems: 'center',
    paddingBottom: 40 * S,
  },
  stopButton: {
    width: 56 * S,
    height: 56 * S,
    borderRadius: 28 * S,
    borderWidth: 3 * S,
    borderColor: SparkColors.cocoaCta,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  stopSquare: {
    width: 20 * S,
    height: 20 * S,
    borderRadius: 4 * S,
    backgroundColor: SparkColors.cocoaCta,
  },
});
