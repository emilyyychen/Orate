import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

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

export default function PausedScreen() {
  const router = useRouter();
  const { time = '05:12', seconds = '312' } = useLocalSearchParams<{
    time?: string;
    seconds?: string;
  }>();

  // Simulated pace
  const pace = 140;

  const handleResume = () => {
    router.replace({
      pathname: '/record/recording',
    });
  };

  const handleFinish = () => {
    router.replace({
      pathname: '/record/analysis',
      params: { time, pace: String(pace) },
    });
  };

  const handleDiscard = () => {
    router.replace('/record/mic-check');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundDots />

      <View style={styles.content}>
        {/* Resume recording pill */}
        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <Pressable style={styles.resumePill} onPress={handleResume}>
            <Ionicons name="play" size={14 * S} color={SparkColors.cocoaText} />
            <Text style={styles.resumeText}>Resume recording</Text>
          </Pressable>
        </Animated.View>

        {/* Timer */}
        <Animated.View entering={FadeInUp.duration(500).delay(100)}>
          <Text style={styles.timer}>{time}</Text>
        </Animated.View>

        {/* Pace */}
        <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.paceContainer}>
          <Text style={styles.paceNumber}>{pace}</Text>
          <Text style={styles.paceLabel}>Pace (wpm)</Text>
        </Animated.View>
      </View>

      {/* Bottom buttons */}
      <Animated.View entering={FadeIn.duration(500).delay(400)} style={styles.bottomArea}>
        <Pressable style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishText}>Finish take</Text>
        </Pressable>
        <Pressable onPress={handleDiscard} style={styles.discardButton}>
          <Text style={styles.discardText}>Discard</Text>
        </Pressable>
      </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24 * S,
  },
  resumePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * S,
    paddingHorizontal: 16 * S,
    paddingVertical: 8 * S,
    gap: 6 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    marginBottom: 16 * S,
  },
  resumeText: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 14 * S,
    color: SparkColors.cocoaText,
  },
  timer: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 72 * S,
    lineHeight: 86 * S,
    color: SparkColors.cocoaText,
    textAlign: 'center',
    marginBottom: 8 * S,
  },
  paceContainer: {
    alignItems: 'center',
  },
  paceNumber: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 36 * S,
    lineHeight: 44 * S,
    color: SparkColors.cocoaText,
  },
  paceLabel: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 14 * S,
    color: SparkColors.warmGray,
    marginTop: 2 * S,
  },
  bottomArea: {
    paddingHorizontal: 24 * S,
    paddingBottom: 20 * S,
  },
  finishButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 26 * S,
    height: 52 * S,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12 * S,
  },
  finishText: {
    fontFamily: SparkFonts.robotoBold,
    fontSize: 16 * S,
    lineHeight: 22 * S,
    color: '#FFFFFF',
  },
  discardButton: {
    alignItems: 'center',
    paddingVertical: 8 * S,
  },
  discardText: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 16 * S,
    color: SparkColors.coral,
  },
});
