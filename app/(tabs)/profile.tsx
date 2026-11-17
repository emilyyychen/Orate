import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';
import { useStore } from '@/store/useStore';
import { WEEK_DATA, MOCK_TAKES } from '@/data/mockData';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

/* Extracted to avoid hooks-in-callbacks issues */
function PrefRowItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.prefRow} activeOpacity={0.7} onPress={onPress}>
      <Ionicons name={icon as any} size={20 * S} color={SparkColors.warmGray} />
      <Text style={s.prefLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16 * S} color={SparkColors.chevron} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useStore();
  const totalSessions = MOCK_TAKES.length;
  const avgScore = Math.round(MOCK_TAKES.reduce((a, t) => a + t.score, 0) / totalSessions);
  const maxBar = Math.max(...WEEK_DATA.map((d) => d.minutes), 1);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Profile</Text>
        <TouchableOpacity hitSlop={12} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22 * S} color={SparkColors.cocoaText} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Identity */}
        <View style={s.identityCard}>
          <View style={s.avatarLg}>
            <Ionicons name="person" size={28 * S} color={SparkColors.warmGray} />
          </View>
          <Text style={s.userName}>{user.name}</Text>
          <Text style={s.userEmail}>{user.email}</Text>
          <View style={s.tierBadge}>
            <Text style={s.tierText}>{user.tier === 'pro' ? 'Pro' : 'Free'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statVal}>{totalSessions}</Text>
            <Text style={s.statLbl}>Sessions</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statVal}>{avgScore}</Text>
            <Text style={s.statLbl}>Avg score</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statVal}>3</Text>
            <Text style={s.statLbl}>Streak</Text>
          </View>
        </View>

        {/* Weekly chart */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>This week</Text>
          <View style={s.chartBars}>
            {WEEK_DATA.map((d) => (
              <View key={d.day} style={s.barCol}>
                <View
                  style={[
                    s.bar,
                    {
                      height: Math.max((d.minutes / maxBar) * 60 * S, 4 * S),
                      backgroundColor: d.minutes > 0 ? SparkColors.brandOrange : SparkColors.warmBorder,
                    },
                  ]}
                />
                <Text style={s.barDay}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings links */}
        <Text style={s.sectionLabel}>Settings</Text>
        <View style={s.prefCard}>
          <PrefRowItem icon="person-outline" label="Edit profile" onPress={() => router.push('/settings/profile')} />
          <PrefRowItem icon="notifications-outline" label="Reminders" onPress={() => router.push('/settings/reminders')} />
          <PrefRowItem icon="shield-outline" label="Privacy" onPress={() => router.push('/settings/privacy')} />
          <PrefRowItem icon="information-circle-outline" label="About" onPress={() => router.push('/settings/about')} />
        </View>

        <View style={{ height: 100 * S }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24 * S,
    paddingTop: 8 * S,
    paddingBottom: 16 * S,
  },
  headerTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 24 * S, color: SparkColors.cocoaText },
  scroll: { paddingHorizontal: 24 * S },

  identityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 24 * S,
    alignItems: 'center',
    marginBottom: 16 * S,
  },
  avatarLg: {
    width: 64 * S,
    height: 64 * S,
    borderRadius: 32 * S,
    backgroundColor: SparkColors.warmCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    marginBottom: 12 * S,
  },
  userName: { fontFamily: SparkFonts.outfitBold, fontSize: 22 * S, color: SparkColors.cocoaText, marginBottom: 2 * S },
  userEmail: { fontFamily: SparkFonts.robotoRegular, fontSize: 14 * S, color: SparkColors.warmGray, marginBottom: 10 * S },
  tierBadge: {
    backgroundColor: SparkColors.warmCanvas,
    borderRadius: 10 * S,
    paddingHorizontal: 12 * S,
    paddingVertical: 4 * S,
  },
  tierText: { fontFamily: SparkFonts.robotoMedium, fontSize: 12 * S, color: SparkColors.cocoaText },

  statsRow: { flexDirection: 'row', gap: 12 * S, marginBottom: 16 * S },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 14 * S,
    alignItems: 'center',
  },
  statVal: { fontFamily: SparkFonts.outfitBold, fontSize: 22 * S, color: SparkColors.cocoaText },
  statLbl: { fontFamily: SparkFonts.robotoRegular, fontSize: 12 * S, color: SparkColors.warmGray, marginTop: 2 * S },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 20 * S,
    marginBottom: 20 * S,
  },
  chartTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText, marginBottom: 16 * S },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 70 * S },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 20 * S, borderRadius: 6 * S },
  barDay: { fontFamily: SparkFonts.robotoRegular, fontSize: 11 * S, color: SparkColors.warmGray, marginTop: 6 * S },

  sectionLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 11 * S,
    letterSpacing: 1.2,
    color: SparkColors.textLabel,
    marginBottom: 12 * S,
  },
  prefCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16 * S,
    borderBottomWidth: 1,
    borderBottomColor: SparkColors.warmBorder,
    gap: 12 * S,
  },
  prefLabel: { flex: 1, fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText },
});
