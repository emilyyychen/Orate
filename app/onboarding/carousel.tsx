import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  Image,
  Animated,
  Easing,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SparkColors } from '@/constants/Spark';

const { width: SW, height: SH } = Dimensions.get('window');
const S = SW / 390;

interface SlideData {
  id: string;
  illustration: 'timeline' | 'character' | 'staircase';
  title: string;
  subtitle?: string;
  description?: string;
  buttonLabel: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    illustration: 'timeline',
    title: 'Know what to improve\nand where',
    buttonLabel: 'Next',
  },
  {
    id: '2',
    illustration: 'character',
    title: 'Meet Orate',
    subtitle: 'Your AI practice assistant.',
    description:
      "I'll help you find what to work on,\nthen practise it with your own words.",
    buttonLabel: 'Next',
  },
  {
    id: '3',
    illustration: 'staircase',
    title: 'Feel more confident\nwhen you speak',
    description:
      'Clearer ideas. A steadier voice.\nMore confidence for your next presentation.',
    buttonLabel: 'Get started',
  },
];

export default function CarouselScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/auth/sign-in');
    }
  };

  const handleSkip = () => {
    router.push('/auth/sign-in');
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SW);
    setCurrentIndex(index);
  };

  const renderSlide = ({ item, index }: { item: SlideData; index: number }) => (
    <View style={styles.slide}>
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.illustrationArea}>
        {item.illustration === 'timeline' && (
          <TimelineIllustration isActive={currentIndex === index} />
        )}
        {item.illustration === 'character' && (
          <CharacterIllustration isActive={currentIndex === index} />
        )}
        {item.illustration === 'staircase' && (
          <StaircaseIllustration isActive={currentIndex === index} />
        )}
      </View>

      <View style={styles.textArea}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
        )}
        {item.description && (
          <Text style={styles.slideDescription}>{item.description}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
      />
      <View style={styles.bottomArea}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <Pressable style={styles.ctaButton} onPress={handleNext}>
          <Text style={styles.ctaText}>
            {slides[currentIndex]?.buttonLabel ?? 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 1 — LIVE waveform that pulses like a recording
   Bars continuously animate up/down, symmetric from center.
   After a moment the marker scans in and tooltip pops up.
   ═══════════════════════════════════════════════════ */

const TOTAL_BARS = 80;
const BAR_WIDTH = 2.2 * S;
const BAR_GAP = 2 * S;
const WAVEFORM_WIDTH = TOTAL_BARS * (BAR_WIDTH + BAR_GAP);
const HALF_BAR_H = 70 * S;
const WAVEFORM_HEIGHT = HALF_BAR_H * 2;
const SCAN_TARGET = 0.48;
const SCAN_DURATION = 1200;

// Base amplitude envelope — speech-like shape
const BASE_ENV: number[] = Array.from({ length: TOTAL_BARS }, (_, i) => {
  const t = i / TOTAL_BARS;
  // quieter edges, louder middle
  const env = Math.sin(t * Math.PI) * 0.7 + 0.3;
  // add some speech-like clusters
  const cluster =
    Math.sin(t * 14) * 0.15 +
    Math.sin(t * 23) * 0.1 +
    Math.sin(t * 37) * 0.08;
  return Math.min(1, Math.max(0.06, env + cluster));
});

function TimelineIllustration({ isActive }: { isActive: boolean }) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const tooltipAnim = useRef(new Animated.Value(0)).current;
  // Each bar gets its own animated value for the live pulse
  const barAnims = useRef(
    Array.from({ length: TOTAL_BARS }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    if (!isActive) return;
    scanAnim.setValue(0);
    tooltipAnim.setValue(0);

    // Start the live waveform pulsing
    const loops: Animated.CompositeAnimation[] = [];
    barAnims.forEach((anim, i) => {
      // Each bar oscillates at a slightly different speed & phase
      const duration = 800 + (i % 7) * 150 + (i % 3) * 120;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.3 + Math.random() * 0.4,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.7 + Math.random() * 0.3,
            duration: duration + 50,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
      loop.start();
      loops.push(loop);
    });

    // Scan marker after short delay
    const timer = setTimeout(() => {
      Animated.timing(scanAnim, {
        toValue: SCAN_TARGET,
        duration: SCAN_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(tooltipAnim, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    }, 600);

    return () => {
      clearTimeout(timer);
      loops.forEach((l) => l.stop());
    };
  }, [isActive]);

  const markerX = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WAVEFORM_WIDTH],
  });

  const tooltipScale = tooltipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={tlStyles.container}>
      {/* Tooltip bubble */}
      <Animated.View
        style={[
          tlStyles.tooltip,
          {
            opacity: tooltipAnim,
            transform: [{ scale: tooltipScale }],
          },
        ]}>
        <Text style={tlStyles.tooltipMeta}>0:24 · Pacing</Text>
        <Text style={tlStyles.tooltipText}>
          {'Try a pause after\n“this week.”'}
        </Text>
      </Animated.View>

      {/* Waveform — bars pulse up & down from center */}
      <View style={tlStyles.waveformContainer}>
        {/* Highlight zone */}
        <Animated.View
          style={[
            tlStyles.highlightZone,
            { transform: [{ translateX: markerX }] },
          ]}
        />

        {/* Live-pulsing bars */}
        {BASE_ENV.map((baseH, i) => {
          const barX = i * (BAR_WIDTH + BAR_GAP);
          const isCenter = Math.abs(i / TOTAL_BARS - SCAN_TARGET) < 0.12;

          // Animated height: base envelope × pulse multiplier
          const animatedHalf = barAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [baseH * HALF_BAR_H * 0.2, baseH * HALF_BAR_H],
          });
          const animatedFull = Animated.multiply(animatedHalf, 2);
          const animatedTop = Animated.subtract(HALF_BAR_H, animatedHalf);

          return (
            <Animated.View
              key={i}
              style={[
                tlStyles.bar,
                {
                  left: barX,
                  height: animatedFull,
                  top: animatedTop,
                  backgroundColor: isCenter
                    ? SparkColors.brandOrange
                    : '#F5D5A0',
                },
              ]}
            />
          );
        })}

        {/* Animated marker line */}
        <Animated.View
          style={[
            tlStyles.markerLine,
            { transform: [{ translateX: markerX }] },
          ]}>
          <View style={tlStyles.markerDotTop} />
          <View style={tlStyles.markerLineBar} />
          <View style={tlStyles.markerDotBottom} />
        </Animated.View>
      </View>

      {/* Time labels */}
      <View style={tlStyles.timeRow}>
        <Text style={tlStyles.timeLabel}>0:00</Text>
        <Text style={tlStyles.timeLabel}>0:30</Text>
        <Text style={tlStyles.timeLabel}>1:00</Text>
      </View>
    </View>
  );
}

const tlStyles = StyleSheet.create({
  container: {
    width: 342 * S,
    alignItems: 'center',
  },
  tooltip: {
    backgroundColor: SparkColors.paleYellow,
    borderRadius: 14 * S,
    paddingHorizontal: 16 * S,
    paddingVertical: 12 * S,
    marginBottom: 20 * S,
    alignSelf: 'center',
  },
  tooltipMeta: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: SparkColors.warmGray,
    marginBottom: 3,
  },
  tooltipText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    lineHeight: 22,
    color: SparkColors.cocoaText,
  },
  waveformContainer: {
    width: WAVEFORM_WIDTH,
    height: WAVEFORM_HEIGHT,
    position: 'relative',
    alignSelf: 'center',
  },
  highlightZone: {
    position: 'absolute',
    width: 46 * S,
    height: WAVEFORM_HEIGHT + 24 * S,
    top: -12 * S,
    marginLeft: -23 * S,
    borderRadius: 23 * S,
    backgroundColor: 'rgba(254, 154, 14, 0.08)',
  },
  bar: {
    position: 'absolute',
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
  },
  markerLine: {
    position: 'absolute',
    top: -18 * S,
    bottom: -18 * S,
    width: 2,
    alignItems: 'center',
    zIndex: 10,
  },
  markerLineBar: {
    flex: 1,
    width: 2,
    backgroundColor: SparkColors.brandOrange,
  },
  markerDotTop: {
    width: 10 * S,
    height: 10 * S,
    borderRadius: 5 * S,
    backgroundColor: SparkColors.brandOrange,
    marginBottom: -1,
  },
  markerDotBottom: {
    width: 10 * S,
    height: 10 * S,
    borderRadius: 5 * S,
    backgroundColor: SparkColors.brandOrange,
    marginTop: -1,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12 * S,
  },
  timeLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: SparkColors.warmGray,
  },
});

/* ═══════════════════════════════════════════════════
   SLIDE 2 — Character with floating animation
   ═══════════════════════════════════════════════════ */

const CIRCLE_SIZE = 260 * S;

function CharacterIllustration({ isActive }: { isActive: boolean }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const circleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (!isActive) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.spring(circleAnim, {
      toValue: 1,
      tension: 40,
      friction: 6,
      useNativeDriver: true,
    }).start();

    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    floating.start();
    return () => floating.stop();
  }, [isActive]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10 * S],
  });

  const rotate = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '2deg', '0deg'],
  });

  return (
    <View style={charStyles.outer}>
      <Animated.View
        style={[
          charStyles.circle,
          { transform: [{ scale: circleAnim }] },
        ]}
      />
      <Animated.Image
        source={require('../../assets/images/orate-character.png')}
        style={[
          charStyles.characterImg,
          {
            transform: [
              { translateY },
              { rotate },
              { scale: scaleAnim },
            ],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const charStyles = StyleSheet.create({
  outer: {
    width: CIRCLE_SIZE + 50 * S,
    height: CIRCLE_SIZE + 50 * S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: SparkColors.paleYellow,
  },
  characterImg: {
    width: CIRCLE_SIZE * 0.95,
    height: CIRCLE_SIZE * 0.85,
    marginTop: 15 * S,
    zIndex: 1,
  },
});

/* ═══════════════════════════════════════════════════
   SLIDE 3 — Staircase: 3 columns ascending L→R
   ═══════════════════════════════════════════════════ */

const BLOCK_W = 100 * S;
const BLOCK_H = 90 * S;
const BLOCK_GAP = 6 * S;
const BLOCK_RADIUS = 12 * S;

const COLUMNS = [
  { blocks: 1, colors: ['#FFF5D6'] },
  { blocks: 2, colors: ['#FFCC00', '#FFE87A'] },
  { blocks: 3, colors: ['#FF9800', '#FFB300', '#FFC107'] },
];

function StaircaseIllustration({ isActive }: { isActive: boolean }) {
  const anims = useRef(COLUMNS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!isActive) return;
    anims.forEach((a) => a.setValue(0));

    Animated.stagger(
      180,
      anims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [isActive]);

  const totalH = 3 * (BLOCK_H + BLOCK_GAP);

  return (
    <View style={[stairStyles.container, { height: totalH }]}>
      {COLUMNS.map((col, colIdx) => {
        const translateY = anims[colIdx].interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        });
        const opacity = anims[colIdx];

        return (
          <Animated.View
            key={colIdx}
            style={[
              stairStyles.column,
              {
                opacity,
                transform: [{ translateY }],
              },
            ]}>
            {col.colors.map((color, blockIdx) => (
              <View
                key={blockIdx}
                style={[stairStyles.block, { backgroundColor: color }]}
              />
            ))}
          </Animated.View>
        );
      })}
    </View>
  );
}

const stairStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: BLOCK_GAP,
  },
  column: {
    alignItems: 'center',
    gap: BLOCK_GAP,
  },
  block: {
    width: BLOCK_W,
    height: BLOCK_H,
    borderRadius: BLOCK_RADIUS,
  },
});

/* ═══════════════════════════════════════════════════
   MAIN STYLES
   ═══════════════════════════════════════════════════ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SparkColors.cream,
  },
  slide: {
    width: SW,
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 14 * S,
    right: 24 * S,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: SparkColors.cocoaText,
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20 * S,
  },
  textArea: {
    paddingHorizontal: 24 * S,
    minHeight: 160 * S,
    paddingTop: 16 * S,
  },
  slideTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    lineHeight: 36,
    color: SparkColors.cocoaText,
    textAlign: 'center',
  },
  slideSubtitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 24,
    color: SparkColors.cocoaText,
    textAlign: 'center',
    marginTop: 12,
  },
  slideDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: SparkColors.warmGray,
    textAlign: 'center',
    marginTop: 12,
  },
  bottomArea: {
    paddingHorizontal: 24 * S,
    paddingBottom: 12,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { backgroundColor: SparkColors.cocoaText },
  dotInactive: { backgroundColor: SparkColors.sand },
  ctaButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 26,
    paddingVertical: 15,
    width: 342 * S,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
