import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

type TabIconProps = { focused: boolean; iconName: keyof typeof Ionicons.glyphMap; label: string };

function TabIcon({ focused, iconName, label }: TabIconProps) {
  if (focused) {
    return (
      <View style={tabStyles.activePill}>
        <Ionicons name={iconName} size={20 * S} color="#FFFFFF" />
        <Text style={tabStyles.activeLabel}>{label}</Text>
      </View>
    );
  }
  return (
    <View style={tabStyles.inactiveWrap}>
      <Ionicons name={iconName} size={22 * S} color={SparkColors.paleGray} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 20 * S,
    paddingHorizontal: 14 * S,
    paddingVertical: 8 * S,
    gap: 6 * S,
  },
  activeLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 13 * S,
    color: '#FFFFFF',
  },
  inactiveWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8 * S,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: SparkColors.cream,
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 * S : 64 * S,
          paddingTop: 8 * S,
          paddingBottom: Platform.OS === 'ios' ? 28 * S : 8 * S,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName={focused ? 'cloud' : 'cloud-outline'} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName={focused ? 'time' : 'time-outline'} label="History" />
          ),
        }}
      />
      <Tabs.Screen
        name="script"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName={focused ? 'document-text' : 'document-text-outline'} label="Script" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName={focused ? 'person' : 'person-outline'} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
