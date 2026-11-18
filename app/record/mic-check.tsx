import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

const WAVEFORM_BARS = 24;

function WaveformBar({ index, total }: { index: number; total: number }) {
  const height = useSharedValue(4 * S);

  useEffect(() => {
    // Create natural waveform: center bars taller, edges shorter
    const center = total / 2;
    const dist = Math.abs(index - center) / center;
    const maxH = (1 - dist * 0.6) * 28 * S;
    const minH = 4 * S;

    height.value = withDelay(
      index * 40,
      withRepeat(
        withSequence(
          withTiming(maxH * (0.4 + Math.random() * 0.6), {
            duration: 300 + Math.random() * 200,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(minH + Math.random() * 8 * S, {
            duration: 300 + Math.random() * 200,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 3 * S,
          borderRadius: 1.5 * S,
          backgroundColor: SparkColors.orange,
          marginHorizontal: 1.5 * S,
        },
        animStyle,
      ]}
    />
  );
}

export default function MicCheckScreen() {
  const router = useRouter();

  const listeningOpacity = useSharedValue(1);

  useEffect(() => {
    listeningOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, []);

  const listeningStyle = useAnimatedStyle(() => ({
    opacity: listeningOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Character */}
        <Animated.View entering={FadeIn.duration(600).delay(200)} style={styles.characterContainer}>
          <Image
            source={require('../../assets/images/orate-character.png')}
            style={styles.character}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeIn.duration(600).delay(400)}>
          <Text style={styles.title}>Mic check</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View entering={FadeIn.duration(600).delay(500)}>
          <Text style={styles.subtitle}>
            Say a few words to check your{'\n'}microphone.
          </Text>
        </Animated.View>

        {/* Waveform */}
        <Animated.View entering={FadeIn.duration(600).delay(600)} style={styles.waveformContainer}>
          <View style={styles.waveform}>
            {Array.from({ length: WAVEFORM_BARS }).map((_, i) => (
              <WaveformBar key={i} index={i} total={WAVEFORM_BARS} />
            ))}
          </View>
        </Animated.View>

        {/* LISTENING... */}
        <Animated.Text style={[styles.listeningText, listeningStyle]}>
          LISTENING...
        </Animated.Text>
      </View>

      {/* CTA */}
      <Animated.View entering={FadeIn.duration(600).delay(800)} style={styles.ctaContainer}>
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.replace('/record/countdown')}
        >
          <Text style={styles.ctaText}>Start recording</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24 * S,
  },
  characterContainer: {
    marginBottom: 16 * S,
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
    textAlign: 'center',
    marginBottom: 12 * S,
  },
  subtitle: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 16 * S,
    lineHeight: 22 * S,
    color: SparkColors.warmGray,
    textAlign: 'center',
    marginBottom: 32 * S,
  },
  waveformContainer: {
    marginBottom: 12 * S,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40 * S,
    justifyContent: 'center',
  },
  listeningText: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 12 * S,
    letterSpacing: 2,
    color: SparkColors.orange,
    textTransform: 'uppercase',
  },
  ctaContainer: {
    paddingHorizontal: 24 * S,
    paddingBottom: 16 * S,
  },
  ctaButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 26 * S,
    height: 52 * S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: SparkFonts.robotoBold,
    fontSize: 16 * S,
    lineHeight: 22 * S,
    color: '#FFFFFF',
  },
});
