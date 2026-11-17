import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

const SETTINGS_ITEMS = [
  { icon: 'person-outline', label: 'Edit profile', route: '/settings/profile' },
  { icon: 'notifications-outline', label: 'Reminders', route: '/settings/reminders' },
  { icon: 'shield-outline', label: 'Privacy', route: '/settings/privacy' },
  { icon: 'star-outline', label: 'Membership', route: '/settings/membership' },
  { icon: 'information-circle-outline', label: 'About', route: '/settings/about' },
];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24 * S} color={SparkColors.cocoaText} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 24 * S }} />
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.card}>
          {SETTINGS_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[s.row, idx === SETTINGS_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons name={item.icon as any} size={20 * S} color={SparkColors.warmGray} />
              <Text style={s.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16 * S} color={SparkColors.chevron} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={s.signOutBtn} activeOpacity={0.7}>
          <Text style={s.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 * S, paddingVertical: 12 * S },
  headerTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 17 * S, color: SparkColors.cocoaText },
  scroll: { paddingHorizontal: 24 * S },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16 * S, borderWidth: 1, borderColor: SparkColors.warmBorder, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 * S, borderBottomWidth: 1, borderBottomColor: SparkColors.warmBorder, gap: 12 * S },
  rowLabel: { flex: 1, fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText },
  signOutBtn: { marginTop: 24 * S, alignItems: 'center', paddingVertical: 14 * S },
  signOutText: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: '#D94030' },
});
