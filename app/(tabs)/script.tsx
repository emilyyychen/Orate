import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';
import { LESSONS } from '@/data/mockData';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

type TabKey = 'browse' | 'progress';

function SkillCard({ lesson, onPress }: { lesson: (typeof LESSONS)[0]; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.skillCard} activeOpacity={0.7} onPress={onPress}>
      <View style={[s.skillIcon, { backgroundColor: lesson.color }]}>
        <Ionicons name={lesson.icon as any} size={22 * S} color={SparkColors.cocoaText} />
      </View>
      <Text style={s.skillTitle} numberOfLines={2}>{lesson.title}</Text>
      <Text style={s.skillSub} numberOfLines={1}>{lesson.subtitle}</Text>
    </TouchableOpacity>
  );
}

export default function ScriptScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('browse');

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Lessons</Text>
      </View>

      <View style={s.tabRow}>
        {(['browse', 'progress'] as TabKey[]).map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {tab === 'browse' && (
          <>
            <Text style={s.sectionLabel}>Recommended for you</Text>
            <View style={s.grid}>
              {LESSONS.map((lesson) => (
                <SkillCard
                  key={lesson.id}
                  lesson={lesson}
                  onPress={() =>
                    router.push({ pathname: '/lessons/detail', params: { lessonId: lesson.id } })
                  }
                />
              ))}
            </View>
          </>
        )}

        {tab === 'progress' && (
          <View style={s.progressEmpty}>
            <Ionicons name="trophy-outline" size={48 * S} color={SparkColors.warmGray} />
            <Text style={s.progressTitle}>No progress yet</Text>
            <Text style={s.progressSub}>Complete a lesson to track your progress here.</Text>
          </View>
        )}

        <View style={{ height: 100 * S }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: { paddingHorizontal: 24 * S, paddingTop: 8 * S, paddingBottom: 8 * S },
  headerTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 24 * S, color: SparkColors.cocoaText },
  tabRow: { flexDirection: 'row', paddingHorizontal: 24 * S, gap: 20 * S, marginBottom: 16 * S },
  tabText: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.warmGray, paddingBottom: 6 * S },
  tabActive: { color: SparkColors.brandOrange, borderBottomWidth: 2, borderBottomColor: SparkColors.brandOrange },
  scroll: { paddingHorizontal: 24 * S },
  sectionLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 11 * S,
    letterSpacing: 1.2,
    color: SparkColors.textLabel,
    marginBottom: 12 * S,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 * S },
  skillCard: {
    width: (SW - 60 * S) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    padding: 16 * S,
  },
  skillIcon: {
    width: 44 * S,
    height: 44 * S,
    borderRadius: 14 * S,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12 * S,
  },
  skillTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText, marginBottom: 4 * S },
  skillSub: { fontFamily: SparkFonts.robotoRegular, fontSize: 12 * S, color: SparkColors.warmGray },

  progressEmpty: { alignItems: 'center', paddingTop: 60 * S },
  progressTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 20 * S, color: SparkColors.cocoaText, marginTop: 16 * S, marginBottom: 8 * S },
  progressSub: { fontFamily: SparkFonts.robotoRegular, fontSize: 15 * S, color: SparkColors.warmGray, textAlign: 'center' },
});
