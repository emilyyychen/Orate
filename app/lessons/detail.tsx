import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';
import { LESSONS } from '@/data/mockData';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

export default function LessonDetailScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = LESSONS.find(l => l.id === lessonId) || LESSONS[0];

  const KEY_TAKEAWAYS = [
    'Use 2–3 second pauses after key statements',
    'Silence signals confidence, not uncertainty',
    'Vary pause length for emotional impact',
    'Practice pausing before and after numbers or data',
  ];

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Ionicons name="chevron-back" size={24 * S} color={SparkColors.cocoaText} /></TouchableOpacity>
        <Text style={s.headerTitle}>{lesson.title}</Text>
        <TouchableOpacity hitSlop={12}><Text style={s.shareText}>Share</Text></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.heroImage}>
          <Ionicons name="play-circle-outline" size={48 * S} color="rgba(255,255,255,0.8)" />
        </View>
        <Text style={s.lessonTitle}>{lesson.title}</Text>
        <Text style={s.lessonMeta}>Inspired by: Barack Obama, TED Talks</Text>
        <View style={s.badgeRow}>
          <View style={s.badge}><Text style={s.badgeText}>Intermediate</Text></View>
          <View style={[s.badge, { backgroundColor: SparkColors.peach }]}><Text style={s.badgeText}>Pacing</Text></View>
          <View style={[s.badge, { backgroundColor: SparkColors.paleYellow }]}><Text style={s.badgeText}>Confidence</Text></View>
        </View>
        <Text style={s.bodyText}>
          Great speakers know that silence can be more powerful than words. In this lesson, you'll learn how to use strategic pauses to emphasize key points, let ideas land, and command the room's attention.
        </Text>
        <Text style={s.sectionTitle}>Key takeaways</Text>
        {KEY_TAKEAWAYS.map((item, i) => (
          <View key={i} style={s.takeawayRow}>
            <View style={s.bullet} />
            <Text style={s.takeawayText}>{item}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={s.startBtn}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/lessons/practice', params: { lessonId: lesson.id } })}
        >
          <Text style={s.startBtnText}>Start practice</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 * S, paddingVertical: 12 * S },
  headerTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 17 * S, color: SparkColors.cocoaText, flex: 1, textAlign: 'center' },
  shareText: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText },
  content: { paddingHorizontal: 24 * S, paddingBottom: 40 * S },
  heroImage: { width: '100%', height: 200 * S, borderRadius: 20 * S, backgroundColor: '#2E2422', alignItems: 'center', justifyContent: 'center', marginBottom: 20 * S },
  lessonTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 24 * S, lineHeight: 30 * S, color: SparkColors.cocoaText, marginBottom: 6 * S },
  lessonMeta: { fontFamily: SparkFonts.robotoRegular, fontSize: 13 * S, color: SparkColors.warmGray, marginBottom: 14 * S },
  badgeRow: { flexDirection: 'row', gap: 8 * S, marginBottom: 16 * S },
  badge: { backgroundColor: SparkColors.warmCanvas, borderRadius: 12 * S, paddingHorizontal: 12 * S, paddingVertical: 5 * S },
  badgeText: { fontFamily: SparkFonts.robotoMedium, fontSize: 12 * S, color: SparkColors.cocoaText },
  bodyText: { fontFamily: SparkFonts.robotoRegular, fontSize: 15 * S, lineHeight: 23 * S, color: SparkColors.cocoaText, marginBottom: 20 * S },
  sectionTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 18 * S, color: SparkColors.cocoaText, marginBottom: 12 * S },
  takeawayRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 * S },
  bullet: { width: 6 * S, height: 6 * S, borderRadius: 3 * S, backgroundColor: SparkColors.brandOrange, marginTop: 7 * S, marginRight: 12 * S },
  takeawayText: { flex: 1, fontFamily: SparkFonts.robotoRegular, fontSize: 15 * S, lineHeight: 22 * S, color: SparkColors.cocoaText },
  startBtn: { backgroundColor: SparkColors.button, borderRadius: 23 * S, height: 52 * S, alignItems: 'center', justifyContent: 'center', marginTop: 24 * S },
  startBtnText: { fontFamily: SparkFonts.robotoBold, fontSize: 16 * S, color: '#FFFFFF' },
});
