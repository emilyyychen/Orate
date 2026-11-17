import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Platform, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

const TAB_DEFS = [
  { key: 'index', icon: 'home-outline' as const, iconFocused: 'home' as const, label: 'Home' },
  { key: 'history', icon: 'time-outline' as const, iconFocused: 'time' as const, label: 'History' },
  { key: 'script', icon: 'document-text-outline' as const, iconFocused: 'document-text' as const, label: 'Lessons' },
  { key: 'profile', icon: 'person-outline' as const, iconFocused: 'person' as const, label: 'Profile' },
];

/* ------------------------------------------------------------------ */
/*  Animated single tab — uses RN Animated with spring                */
/* ------------------------------------------------------------------ */
function AnimatedTab({
  def,
  focused,
  onPress,
}: {
  def: (typeof TAB_DEFS)[number];
  focused: boolean;
  onPress: () => void;
}) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      damping: 15,
      stiffness: 150,
      mass: 0.8,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const pillBg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,197,1,0)', 'rgba(255,197,1,1)'],
  });

  const paddingH = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16 * S],
  });

  const labelOpacity = progress;

  const labelScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const labelMaxW = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80 * S],
  });

  const iconScale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.15, 1],
  });

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View
        style={{
          backgroundColor: pillBg,
          paddingHorizontal: paddingH,
          borderRadius: 22 * S,
          paddingVertical: 8 * S,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6 * S,
        }}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Ionicons
            name={focused ? def.iconFocused : def.icon}
            size={22 * S}
            color={focused ? SparkColors.cocoaText : SparkColors.chevron}
          />
        </Animated.View>
        <Animated.View
          style={{
            opacity: labelOpacity,
            transform: [{ scale: labelScale }],
            maxWidth: labelMaxW,
            overflow: 'hidden',
          }}
        >
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
      </Animated.View>
    </Pressable>
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
