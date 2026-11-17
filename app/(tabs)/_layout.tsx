import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Platform } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.8 };

const TAB_DEFS = [
  { key: 'index', icon: 'home-outline' as const, iconFocused: 'home' as const, label: 'Home' },
  { key: 'history', icon: 'time-outline' as const, iconFocused: 'time' as const, label: 'History' },
  { key: 'script', icon: 'document-text-outline' as const, iconFocused: 'document-text' as const, label: 'Lessons' },
  { key: 'profile', icon: 'person-outline' as const, iconFocused: 'person' as const, label: 'Profile' },
];

/* ------------------------------------------------------------------ */
/*  Animated single tab                                               */
/* ------------------------------------------------------------------ */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedTab({
  def,
  focused,
  onPress,
}: {
  def: (typeof TAB_DEFS)[number];
  focused: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(focused ? 1 : 0);

  useDerivedValue(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING_CONFIG);
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255, 197, 1, ${progress.value})`,
    paddingHorizontal: interpolate(progress.value, [0, 1], [0, 16 * S]),
    borderRadius: 22 * S,
    paddingVertical: 8 * S,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: interpolate(progress.value, [0, 1], [0, 6 * S]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.5, 1]) }],
    maxWidth: interpolate(progress.value, [0, 1], [0, 80 * S]),
    overflow: 'hidden' as const,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 0.5, 1],
          [1, 1.15, 1],
        ),
      },
    ],
  }));

  return (
    <AnimatedPressable onPress={onPress} style={pillStyle} hitSlop={8}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? def.iconFocused : def.icon}
          size={22 * S}
          color={focused ? SparkColors.cocoaText : SparkColors.chevron}
        />
      </Animated.View>
      <Animated.View style={labelStyle}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: SparkFonts.robotoMedium,
            fontSize: 13 * S,
            color: SparkColors.cocoaText,
          }}
        >
          {def.label}
        </Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom Tab Bar                                                     */
/* ------------------------------------------------------------------ */
function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barOuter,
        { paddingBottom: Math.max(insets.bottom, 8 * S) },
      ]}
    >
      <View style={styles.barInner}>
        {TAB_DEFS.map((def, idx) => (
          <AnimatedTab
            key={def.key}
            def={def}
            focused={state.index === idx}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[idx].key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                navigation.navigate(state.routes[idx].name);
              }
            }}
          />
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Tabs layout                                                        */
/* ------------------------------------------------------------------ */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="script" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16 * S,
    backgroundColor: 'transparent',
  },
  barInner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 36 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    paddingHorizontal: 12 * S,
    paddingVertical: 6 * S,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 380 * S,
  },
});
