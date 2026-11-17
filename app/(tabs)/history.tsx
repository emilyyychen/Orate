import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';
import { MOCK_TAKES, MOCK_GROUPS } from '@/data/mockData';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

function SessionRow({ take, onPress }: { take: (typeof MOCK_TAKES)[0]; onPress: () => void }) {
  const dur = `${Math.floor(take.durationSec / 60)}:${String(take.durationSec % 60).padStart(2, '0')}`;
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.7} onPress={onPress}>
      <View style={s.rowLeft}>
        <Text style={s.rowTitle}>{take.label}</Text>
        <Text style={s.rowSub}>{take.date} · {dur}</Text>
      </View>
      <View style={s.rowRight}>
        <Text style={s.rowScore}>{take.score}</Text>
        <Ionicons name="chevron-forward" size={16 * S} color={SparkColors.chevron} />
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const totalSessions = MOCK_TAKES.length;
  const avgScore = Math.round(MOCK_TAKES.reduce((a, t) => a + t.score, 0) / totalSessions);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>History</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Stats hero */}
        <View style={s.heroCard}>
          <View style={s.statRow}>
            <View style={s.statBox}>
              <Text style={s.statValue}>{totalSessions}</Text>
              <Text style={s.statLabel}>Sessions</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{avgScore}</Text>
              <Text style={s.statLabel}>Avg score</Text>
            </View>
          </View>
        </View>

        {/* Grouped sessions */}
        {MOCK_GROUPS.map((group) => (
          <View key={group.label}>
            <Text style={s.groupLabel}>{group.label}</Text>
            {group.takes.map((take) => (
              <SessionRow
                key={take.id}
                take={take}
                onPress={() =>
                  router.push({ pathname: '/feedback/overview', params: { takeId: take.id } })
                }
              />
            ))}
          </View>
        ))}

        <View style={{ height: 100 * S }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: { paddingHorizontal: 24 * S, paddingTop: 8 * S, paddingBottom: 16 * S },
  headerTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 24 * S, color: SparkColors.cocoaText },
  scroll: { paddingHorizontal: 24 * S },

  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 20 * S,
    marginBottom: 20 * S,
  },
  statRow: { flexDirection: 'row', gap: 16 * S },
  statBox: { flex: 1 },
  statValue: { fontFamily: SparkFonts.outfitBold, fontSize: 28 * S, color: SparkColors.cocoaText },
  statLabel: { fontFamily: SparkFonts.robotoRegular, fontSize: 13 * S, color: SparkColors.warmGray, marginTop: 2 * S },

  groupLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 11 * S,
    letterSpacing: 1.2,
    color: SparkColors.textLabel,
    marginBottom: 12 * S,
    marginTop: 4 * S,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 16 * S,
    marginBottom: 10 * S,
  },
  rowLeft: { flex: 1 },
  rowTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText, marginBottom: 2 * S },
  rowSub: { fontFamily: SparkFonts.robotoRegular, fontSize: 13 * S, color: SparkColors.warmGray },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 * S },
  rowScore: { fontFamily: SparkFonts.outfitBold, fontSize: 20 * S, color: SparkColors.cocoaText },
});
