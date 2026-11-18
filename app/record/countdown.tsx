import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

const STEPS = [
  { number: '3', label: 'READY', charPos: 'right' as const },
  { number: '2', label: 'FOCUS', charPos: 'top' as const },
  { number: '1', label: 'SPEAK', charPos: 'left' as const },
];

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

export default function CountdownScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;
  const charScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset and animate for each step
    scale.setValue(0.3);
    opacity.setValue(0);
    labelOpacity.setValue(0);
    charScale.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(charScale, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= 2) {
          clearInterval(timer);
          setTimeout(() => {
            router.replace('/record/recording');
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const current = STEPS[step];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundDots />

      {/* Label */}
      <View style={styles.labelContainer}>
        <Animated.Text style={[styles.label, { opacity: labelOpacity }]}>
          {current.label}
        </Animated.Text>
      </View>

      {/* Number + Character */}
      <View style={styles.centerArea}>
        <View style={styles.numberCharContainer}>
          <Animated.Text
            style={[
              styles.number,
              { transform: [{ scale }], opacity },
            ]}
          >
            {current.number}
          </Animated.Text>
          <Animated.View
            style={[
              styles.characterWrap,
              current.charPos === 'right' && styles.charRight,
              current.charPos === 'top' && styles.charTop,
              current.charPos === 'left' && styles.charLeft,
              { transform: [{ scale: charScale }] },
            ]}
          >
            <Image
              source={require('../../assets/images/orate-character.png')}
              style={styles.character}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </View>

      {/* Cancel + dots */}
      <View style={styles.bottomArea}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i <= step ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
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
  labelContainer: {
    alignItems: 'center',
    marginTop: 80 * S,
  },
  label: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 22 * S,
    lineHeight: 28 * S,
    letterSpacing: 2,
    color: SparkColors.cocoaText,
    textTransform: 'uppercase',
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberCharContainer: {
    position: 'relative',
    width: 180 * S,
    height: 180 * S,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 120 * S,
    lineHeight: 140 * S,
    color: SparkColors.cocoaText,
  },
  characterWrap: {
    position: 'absolute',
    width: 72 * S,
    height: 72 * S,
  },
  charRight: {
    right: -10 * S,
    top: 20 * S,
  },
  charTop: {
    top: -20 * S,
    right: 10 * S,
  },
  charLeft: {
    left: -16 * S,
    bottom: 10 * S,
  },
  character: {
    width: '100%',
    height: '100%',
  },
  bottomArea: {
    alignItems: 'center',
    paddingBottom: 32 * S,
  },
  cancelText: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 16 * S,
    color: SparkColors.warmGray,
    marginBottom: 20 * S,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8 * S,
  },
  dot: {
    width: 10 * S,
    height: 10 * S,
    borderRadius: 5 * S,
  },
  dotActive: {
    backgroundColor: SparkColors.orange,
  },
  dotInactive: {
    backgroundColor: '#E0D5C5',
  },
});
