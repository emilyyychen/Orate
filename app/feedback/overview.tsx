import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';
import { MOCK_TAKES } from '@/data/mockData';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

type Tab = 'overview' | 'script' | 'timeline';

export default function FeedbackOverviewScreen() {
  const router = useRouter();
  const { takeId } = useLocalSearchParams<{ takeId: string }>();
  const take = MOCK_TAKES.find(t => t.id === takeId) || MOCK_TAKES[0];
  const [tab, setTab] = useState<Tab>('overview');

  const dur = `${Math.floor(take.durationSec / 60)}:${String(take.durationSec % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Ionicons name="chevron-back" size={24 * S} color={SparkColors.cocoaText} /></TouchableOpacity>
        <Text style={s.headerTitle}>Lesson results</Text>
        <TouchableOpacity hitSlop={12}><Text style={s.shareText}>Share</Text></TouchableOpacity>
      </View>

      <View style={s.tabRow}>
        {(['overview', 'script', 'timeline'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {tab === 'overview' && (
          <>
            <Text style={s.lessonLabel}>Master the art of the pause · Lesson 1</Text>
            <Text style={s.sectionLabel}>Lesson score</Text>
            <View style={s.scoreCard}>
              <View style={s.scoreCircle}>
                <Text style={s.scoreNum}>{take.score}</Text>
                <Text style={s.scoreMax}>/ 100</Text>
              </View>
              <Text style={s.scoreTitle}>Great number placement!</Text>
              <Text style={s.scoreSub}>You led with the number in 4 out of 5 key moments. Practice consistency.</Text>
            </View>

            <Text style={s.sectionLabel}>At a glance</Text>
            <View style={s.glanceRow}>
              <GlanceStat icon="document-text-outline" value={String(take.wordsPerMinute)} unit="wpm" label="Words" />
              <GlanceStat icon="pause-outline" value={String(take.pauses)} unit="" label="Pauses" />
            </View>
            <View style={s.glanceRow}>
              <GlanceStat icon="location-outline" value={String(take.fillerWords)} unit="" label="Fillers" />
              <GlanceStat icon="star-outline" value="4/5" unit="" label="Moments" />
            </View>

            <Text style={s.sectionLabel}>The read</Text>
            <View style={s.readCard}>
              <Text style={s.readTitle}>You nailed the number-first pattern.</Text>
              <Text style={s.readDesc}>In 4 out of 5 moments, you led with the number before the context — that's the technique. Keep it up.</Text>
            </View>

            <Text style={s.sectionLabel}>Moments</Text>
            <MomentItem time="0:08 – 0:19" desc="number first, clean delivery" color={SparkColors.brandOrange} />
            <MomentItem time="0:24" desc="hesitant maybe around 15% — hedged the number" color={SparkColors.warmGray} />
            <MomentItem time="1:04 – 1:08" desc="'a hundred of growth' — strong number placement" color={SparkColors.brandOrange} />
            <MomentItem time="1:25" desc="'conversation rate' — confident about" color={SparkColors.brandOrange} />

            <Text style={s.sectionLabel}>Where to focus next</Text>
            <View style={s.focusCard}>
              <Text style={s.focusTitle}>Drop the hedge words</Text>
              <Text style={s.focusSub}>At 0:24, "maybe around 15%" — try "15% growth" and let the number land.</Text>
            </View>
            <View style={s.focusCard}>
              <Text style={s.focusTitle}>Pause after the number</Text>
              <Text style={s.focusSub}>A brief silence after "54%" lets the audience absorb — don't rush the context.</Text>
            </View>

            <TouchableOpacity style={s.tryAgainBtn} activeOpacity={0.85} onPress={() => router.push('/lessons/practice')}>
              <Text style={s.tryAgainText}>Try again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.backBtn} activeOpacity={0.7} onPress={() => router.back()}>
              <Text style={s.backBtnText}>Back to lessons</Text>
            </TouchableOpacity>
          </>
        )}

        {tab === 'script' && (
          <View style={s.scriptSection}>
            <Text style={s.scriptTitle}>Pause practice</Text>
            <Text style={s.scriptBody}>
              We help growing teams turn scattered customer information into a clear next step. Today I'll share the problem, our progress, and style and strategy.{'\n\n'}
              Customer teams are spending more time finding content than acting on it. That delay costs them renewals and growth.{'\n\n'}
              Our platform brings those signals together so each team can see what matters and act on it.{'\n\n'}
              We've proved the workflow with our first customers. Now we're building a repeatable way to bring it to more teams.{'\n\n'}
              The forecast is about four million this quarter. That estimate reflects our current pipeline and renewal assumptions.{'\n\n'}
              We're seeing strong demand, although there's still work to do to make delivery more consistent.
            </Text>
          </View>
        )}

        {tab === 'timeline' && (
          <View style={s.timelineSection}>
            <Text style={s.timelineTitle}>Pause practice</Text>
            <View style={s.timelineWaveform}>
              {Array.from({ length: 50 }).map((_, i) => (
                <View key={i} style={[s.timelineBar, { height: (Math.sin(i * 0.3) * 0.5 + 0.5) * 60 * S + 4 * S, backgroundColor: i > 15 && i < 25 ? SparkColors.brandOrange : '#F5D5A0' }]} />
              ))}
            </View>
            <View style={s.timeLabels}>
              <Text style={s.timeLabel}>0:00</Text>
              <Text style={s.timeLabel}>0:30</Text>
              <Text style={s.timeLabel}>1:00</Text>
            </View>
            <View style={s.timerRow}>
              <Text style={s.timerText}>00:24.00</Text>
            </View>
            <TouchableOpacity style={s.backToLessonsBtn} activeOpacity={0.7} onPress={() => router.back()}>
              <Text style={s.backToLessonsText}>Back to lessons</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function GlanceStat({ icon, value, unit, label }: { icon: any; value: string; unit: string; label: string }) {
  return (
    <View style={s.glanceBox}>
      <Ionicons name={icon} size={18 * S} color={SparkColors.warmGray} style={{ marginBottom: 4 * S }} />
      <View style={s.glanceValueRow}>
        <Text style={s.glanceValue}>{value}</Text>
        {unit ? <Text style={s.glanceUnit}>{unit}</Text> : null}
      </View>
      <Text style={s.glanceLabel}>{label}</Text>
    </View>
  );
}

function MomentItem({ time, desc, color }: { time: string; desc: string; color: string }) {
  return (
    <View style={s.momentRow}>
      <View style={[s.momentDot, { backgroundColor: color }]} />
      <View style={s.momentInfo}>
        <Text style={s.momentTime}>{time}</Text>
        <Text style={s.momentDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 * S, paddingVertical: 12 * S },
  headerTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 17 * S, color: SparkColors.cocoaText },
  shareText: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText },
  tabRow: { flexDirection: 'row', paddingHorizontal: 24 * S, gap: 20 * S, marginBottom: 16 * S },
  tabText: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.warmGray, paddingBottom: 6 * S },
  tabActive: { color: SparkColors.brandOrange, borderBottomWidth: 2, borderBottomColor: SparkColors.brandOrange },
  content: { paddingHorizontal: 24 * S, paddingBottom: 60 * S },
  lessonLabel: { fontFamily: SparkFonts.robotoMedium, fontSize: 11 * S, letterSpacing: 1.2, color: SparkColors.textLabel, marginBottom: 16 * S },
  sectionLabel: { fontFamily: SparkFonts.robotoMedium, fontSize: 11 * S, letterSpacing: 1.2, color: SparkColors.textLabel, marginTop: 20 * S, marginBottom: 12 * S },
  scoreCard: { backgroundColor: '#FFFFFF', borderRadius: 20 * S, borderWidth: 1, borderColor: SparkColors.warmBorder, padding: 24 * S, alignItems: 'center', marginBottom: 8 * S },
  scoreCircle: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 * S },
  scoreNum: { fontFamily: SparkFonts.outfitBold, fontSize: 56 * S, color: SparkColors.coral },
  scoreMax: { fontFamily: SparkFonts.robotoRegular, fontSize: 20 * S, color: SparkColors.warmGray, marginLeft: 4 * S },
  scoreTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 18 * S, color: SparkColors.cocoaText, marginBottom: 6 * S, textAlign: 'center' },
  scoreSub: { fontFamily: SparkFonts.robotoRegular, fontSize: 14 * S, lineHeight: 20 * S, color: SparkColors.warmGray, textAlign: 'center' },
  glanceRow: { flexDirection: 'row', gap: 12 * S, marginBottom: 12 * S },
  glanceBox: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16 * S, borderWidth: 1, borderColor: SparkColors.warmBorder, padding: 14 * S },
  glanceValueRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 * S },
  glanceValue: { fontFamily: SparkFonts.outfitBold, fontSize: 24 * S, color: SparkColors.cocoaText },
  glanceUnit: { fontFamily: SparkFonts.robotoRegular, fontSize: 12 * S, color: SparkColors.warmGray, marginLeft: 3 * S },
  glanceLabel: { fontFamily: SparkFonts.robotoRegular, fontSize: 12 * S, color: SparkColors.warmGray },
  readCard: { backgroundColor: '#FFFFFF', borderRadius: 16 * S, borderWidth: 1, borderColor: SparkColors.warmBorder, padding: 18 * S },
  readTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 17 * S, color: SparkColors.cocoaText, marginBottom: 6 * S },
  readDesc: { fontFamily: SparkFonts.robotoRegular, fontSize: 14 * S, lineHeight: 20 * S, color: SparkColors.warmGray },
  momentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 * S },
  momentDot: { width: 8 * S, height: 8 * S, borderRadius: 4 * S, marginTop: 6 * S, marginRight: 12 * S },
  momentInfo: { flex: 1 },
  momentTime: { fontFamily: SparkFonts.robotoMedium, fontSize: 14 * S, color: SparkColors.cocoaText, marginBottom: 2 * S },
  momentDesc: { fontFamily: SparkFonts.robotoRegular, fontSize: 13 * S, color: SparkColors.warmGray },
  focusCard: { backgroundColor: SparkColors.warmCanvas, borderRadius: 16 * S, padding: 16 * S, marginBottom: 10 * S },
  focusTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText, marginBottom: 4 * S },
  focusSub: { fontFamily: SparkFonts.robotoRegular, fontSize: 13 * S, lineHeight: 19 * S, color: SparkColors.warmGray },
  tryAgainBtn: { backgroundColor: SparkColors.cocoaCta, borderRadius: 23 * S, height: 52 * S, alignItems: 'center', justifyContent: 'center', marginTop: 24 * S },
  tryAgainText: { fontFamily: SparkFonts.robotoBold, fontSize: 16 * S, color: '#FFFFFF' },
  backBtn: { borderWidth: 1, borderColor: SparkColors.warmBorder, borderRadius: 23 * S, height: 48 * S, alignItems: 'center', justifyContent: 'center', marginTop: 10 * S },
  backBtnText: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText },
  scriptSection: { paddingTop: 10 * S },
  scriptTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 22 * S, color: SparkColors.cocoaText, marginBottom: 16 * S },
  scriptBody: { fontFamily: SparkFonts.robotoRegular, fontSize: 16 * S, lineHeight: 26 * S, color: SparkColors.cocoaText },
  timelineSection: { paddingTop: 10 * S },
  timelineTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 22 * S, color: SparkColors.cocoaText, marginBottom: 20 * S },
  timelineWaveform: { flexDirection: 'row', alignItems: 'center', gap: 2 * S, height: 70 * S, marginBottom: 10 * S },
  timelineBar: { width: 4 * S, borderRadius: 2 * S },
  timeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 * S },
  timeLabel: { fontFamily: SparkFonts.robotoRegular, fontSize: 12 * S, color: SparkColors.warmGray },
  timerRow: { alignItems: 'center', marginBottom: 20 * S },
  timerText: { fontFamily: SparkFonts.outfitBold, fontSize: 32 * S, color: SparkColors.cocoaText },
  backToLessonsBtn: { borderWidth: 1, borderColor: SparkColors.warmBorder, borderRadius: 23 * S, height: 48 * S, alignItems: 'center', justifyContent: 'center' },
  backToLessonsText: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: SparkColors.cocoaText },
});
