import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

type TabIconProps = { focused: boolean; iconName: keyof typeof Ionicons.glyphMap; label: string };

function TabIcon({ focused, iconName, label }: TabIconProps) {
  if (focused) {
    return (
      <View style={tabStyles.activePill}>
        <Ionicons name={iconName} size={22 * S} color={SparkColors.cocoaText} />
        <Text style={tabStyles.activeLabel}>{label}</Text>
      </View>
    );
  }
  return (
    <View style={tabStyles.inactiveWrap}>
      <Ionicons name={iconName} size={22 * S} color={SparkColors.warmGray} />
    </View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const tabs = [
    { key: 'index', icon: 'home-outline' as const, iconFocused: 'home' as const, label: 'Home' },
    { key: 'history', icon: 'time-outline' as const, iconFocused: 'time' as const, label: 'History' },
    { key: 'script', icon: 'document-text-outline' as const, iconFocused: 'document-text' as const, label: 'Lessons' },
    { key: 'profile', icon: 'person-outline' as const, iconFocused: 'person' as const, label: 'Profile' },
  ];

  return (
    <View style={tabStyles.barOuter}>
      <View style={tabStyles.barContainer}>
        <View style={tabStyles.barInner}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const tab = tabs[index];
            if (!tab) return null;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7} style={isFocused ? tabStyles.tabActive : tabStyles.tabInactive}>
                <TabIcon
                  focused={isFocused}
                  iconName={isFocused ? tab.iconFocused : tab.icon}
                  label={tab.label}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SparkColors.brandOrange,
    borderRadius: 24 * S,
    paddingHorizontal: 16 * S,
    paddingVertical: 10 * S,
    gap: 8 * S,
  },
  activeLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 14 * S,
    color: SparkColors.cocoaText,
  },
  inactiveWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10 * S,
  },
  barOuter: {
    backgroundColor: SparkColors.cream,
    paddingBottom: Platform.OS === 'ios' ? 28 * S : 8 * S,
  },
  barContainer: {
    marginHorizontal: 24 * S,
    backgroundColor: SparkColors.warmCanvas,
    borderRadius: 36 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
  },
  barInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8 * S,
    paddingVertical: 8 * S,
  },
  tabActive: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInactive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4 * S,
  },
});

export default function TabLayout() {
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
