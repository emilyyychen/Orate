import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

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
    Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}

function ZoomInView({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: any }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 100, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>{children}</Animated.View>;
}

function FadeInUpView({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
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
        {/* Character in circle ring with checkmark */}
        <ZoomInView delay={0} style={styles.characterContainer}>
          <View style={styles.characterCircle}>
            <Image
              source={require('../../assets/images/orate-character.png')}
              style={styles.character}
              resizeMode="contain"
            />
          </View>
          {/* Checkmark badge */}
          <ZoomInView delay={400} style={styles.checkBadge}>
            <Text style={styles.checkIcon}>✓</Text>
          </ZoomInView>
        </ZoomInView>

        {/* Three dots */}
        <FadeInView delay={200} style={styles.dotsBelow}>
          <View style={styles.orangeDotSmall} />
          <View style={styles.orangeDotSmall} />
          <View style={styles.orangeDotSmall} />
        </FadeInView>

        {/* Title */}
        <FadeInUpView delay={300}>
          <Text style={styles.title}>Your results are ready</Text>
        </FadeInUpView>

        {/* Subtitle */}
        <FadeInView delay={500}>
          <Text style={styles.subtitle}>
            See feedback from your first recording.
          </Text>
        </FadeInView>
      </View>

      {/* Buttons */}
      <FadeInView delay={700} style={styles.bottomArea}>
        <Pressable style={styles.recordAgainButton} onPress={handleRecordAgain}>
          <Text style={styles.recordAgainText}>Record again</Text>
        </Pressable>
        <Pressable style={styles.viewResultsButton} onPress={handleViewResults}>
          <Text style={styles.viewResultsText}>View my results</Text>
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
    marginBottom: 8 * S,
    position: 'relative',
  },
  characterCircle: {
    width: 120 * S,
    height: 120 * S,
    borderRadius: 60 * S,
    borderWidth: 3 * S,
    borderColor: SparkColors.orange,
    backgroundColor: '#FFF6E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    width: 72 * S,
    height: 72 * S,
  },
  checkBadge: {
    position: 'absolute',
    right: -2 * S,
    bottom: 2 * S,
    width: 30 * S,
    height: 30 * S,
    borderRadius: 15 * S,
    backgroundColor: '#6BBF59',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: SparkColors.cream,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 15 * S,
    fontWeight: '700',
  },
  dotsBelow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4 * S,
    marginBottom: 20 * S,
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
