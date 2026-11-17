import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';

export default function TabBarBackground() {
  return (
    <BlurView
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  if (Platform.OS === 'ios') {
    return tabHeight;
  }
  return 0;
}
