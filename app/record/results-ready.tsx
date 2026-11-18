import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
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

export default function ResultsReadyScreen() {
  const router = useRouter();
  const { time, pace } = useLocalSearchParams<{ time?: string; pace?: string }>();

  const handleRecordAgain = () => {
    router.replace('/record/mic-check');
  };

  const handleViewResults = () => {
    router.replace({
      pathname: '/feedback/overview',
      params: { takeId: '1' },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BackgroundDots />

      <View style={styles.content}>
        {/* Character with checkmark */}
        <Animated.View entering={ZoomIn.duration(600)} style={styles.characterContainer}>
          <Image
            source={require('../../assets/images/orate-character.png')}
            style={styles.character}
            resizeMode="contain"
          />
          {/* Checkmark badge */}
          <Animated.View entering={ZoomIn.duration(400).delay(400)} style={styles.checkBadge}>
            <Text style={styles.checkIcon}>✓</Text>
          </Animated.View>
          {/* Three dots */}
          <View style={styles.dotsBelow}>
            <View style={styles.orangeDotSmall} />
            <View style={styles.orangeDotSmall} />
            <View style={styles.orangeDotSmall} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInUp.duration(500).delay(300)}>
          <Text style={styles.title}>Your results are ready</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View entering={FadeIn.duration(500).delay(500)}>
          <Text style={styles.subtitle}>
            See feedback from your first recording.
          </Text>
        </Animated.View>
      </View>

      {/* Buttons */}
      <Animated.View entering={FadeIn.duration(500).delay(700)} style={styles.bottomArea}>
        <Pressable style={styles.recordAgainButton} onPress={handleRecordAgain}>
          <Text style={styles.recordAgainText}>Record again</Text>
        </Pressable>
        <Pressable style={styles.viewResultsButton} onPress={handleViewResults}>
          <Text style={styles.viewResultsText}>View my results</Text>
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
    paddingHorizontal: 28 * S,
  },
  characterContainer: {
    marginBottom: 20 * S,
    position: 'relative',
  },
  character: {
    width: 90 * S,
    height: 90 * S,
  },
  checkBadge: {
    position: 'absolute',
    right: -4 * S,
    bottom: 2 * S,
    width: 28 * S,
    height: 28 * S,
    borderRadius: 14 * S,
    backgroundColor: SparkColors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: SparkColors.cream,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 14 * S,
    fontWeight: '700',
  },
  dotsBelow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4 * S,
    marginTop: 4 * S,
  },
  orangeDotSmall: {
    width: 8 * S,
    height: 8 * S,
    borderRadius: 4 * S,
    backgroundColor: SparkColors.orange,
  },
  title: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 28 * S,
    lineHeight: 34 * S,
    color: SparkColors.cocoaText,
    textAlign: 'center',
    marginBottom: 10 * S,
  },
  subtitle: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 16 * S,
    lineHeight: 22 * S,
    color: SparkColors.warmGray,
    textAlign: 'center',
  },
  bottomArea: {
    paddingHorizontal: 24 * S,
    paddingBottom: 20 * S,
    gap: 10 * S,
  },
  recordAgainButton: {
    backgroundColor: SparkColors.paleYellow,
    borderRadius: 26 * S,
    height: 52 * S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordAgainText: {
    fontFamily: SparkFonts.robotoBold,
    fontSize: 16 * S,
    lineHeight: 22 * S,
    color: SparkColors.cocoaText,
  },
  viewResultsButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 26 * S,
    height: 52 * S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewResultsText: {
    fontFamily: SparkFonts.robotoBold,
    fontSize: 16 * S,
    lineHeight: 22 * S,
    color: '#FFFFFF',
  },
});
