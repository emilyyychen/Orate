import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW, height: SH } = Dimensions.get('window');
const S = SW / 390;

const PRACTICE_TYPES = [
  { id: 'topic', icon: 'chatbubble-outline' as const, title: 'Main topic', desc: 'Practice presenting the core argument' },
  { id: 'narrative', icon: 'book-outline' as const, title: 'Narrative & storytelling', desc: 'Build compelling stories and arcs' },
  { id: 'examples', icon: 'bulb-outline' as const, title: 'Using examples', desc: 'Support your ideas with examples' },
  { id: 'pacing', icon: 'pause-outline' as const, title: 'Pacing & pausing', desc: 'Master rhythm and silence' },
];

export default function PracticeScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  const [phase, setPhase] = useState<'select' | 'recording'>('select');
  const [selected, setSelected] = useState('');
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording]);

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  if (phase === 'recording') {
    return (
      <View style={s.recordContainer}>
        <SafeAreaView style={s.recordSafe} edges={['top']}>
          <View style={s.recordHeader}>
            <TouchableOpacity onPress={() => { setIsRecording(false); setPhase('select'); setTimer(0); }}>
              <Ionicons name="close" size={24 * S} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={s.recordTitle}>Master the Art of the Pause</Text>
            <View style={{ width: 24 * S }} />
          </View>
          <View style={s.recordCenter}>
            <View style={s.waveformArea}>
              {Array.from({ length: 40 }).map((_, i) => (
                <View key={i} style={[s.recBar, { height: isRecording ? (Math.sin(i * 0.4 + timer) * 0.5 + 0.5) * 60 * S + 4 * S : 4 * S }]} />
              ))}
            </View>
            <Text style={s.timerText}>{formatTime(timer)}</Text>
          </View>
          <View style={s.recordControls}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[s.micBtn, isRecording && s.micBtnActive]}
                activeOpacity={0.8}
                onPress={() => {
                  if (isRecording) {
                    setIsRecording(false);
                    router.push({ pathname: '/feedback/overview', params: { takeId: '1' } });
                  } else {
                    setIsRecording(true);
                  }
                }}
              >
                <Ionicons name={isRecording ? 'stop' : 'mic'} size={32 * S} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Ionicons name="chevron-back" size={24 * S} color={SparkColors.cocoaText} /></TouchableOpacity>
        <Text style={s.headerTitle}>Practice type</Text>
        <View style={{ width: 24 * S }} />
      </View>
      <View style={s.content}>
        <Text style={s.label}>Master the Art of the Pause</Text>
        <Text style={s.title}>What would you like to practice?</Text>
        <Text style={s.subtitle}>Choose a skill to work on this speech topic.</Text>
        {PRACTICE_TYPES.map((pt) => (
          <TouchableOpacity
            key={pt.id}
            style={[s.optionCard, selected === pt.id && s.optionActive]}
            activeOpacity={0.7}
            onPress={() => setSelected(pt.id)}
          >
            <Ionicons name={pt.icon} size={22 * S} color={SparkColors.brandOrange} />
            <View style={s.optionText}>
              <Text style={s.optionTitle}>{pt.title}</Text>
              <Text style={s.optionDesc}>{pt.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.beginBtn, !selected && s.beginBtnDisabled]}
          activeOpacity={0.85}
          disabled={!selected}
          onPress={() => setPhase('recording')}
        >
          <Text style={s.beginBtnText}>Begin practice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 * S, paddingVertical: 12 * S },
  headerTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 17 * S, color: SparkColors.cocoaText },
  content: { flex: 1, paddingHorizontal: 24 * S },
  label: { fontFamily: SparkFonts.robotoMedium, fontSize: 11 * S, letterSpacing: 1.2, color: SparkColors.textLabel, marginBottom: 10 * S },
  title: { fontFamily: SparkFonts.outfitBold, fontSize: 24 * S, lineHeight: 30 * S, color: SparkColors.cocoaText, marginBottom: 6 * S },
  subtitle: { fontFamily: SparkFonts.robotoRegular, fontSize: 14 * S, color: SparkColors.warmGray, marginBottom: 20 * S },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFE9BB', borderRadius: 20 * S, borderWidth: 1, borderColor: '#E7DED2', padding: 16 * S, marginBottom: 10 * S, gap: 14 * S },
  optionActive: { borderColor: SparkColors.brandOrange, borderWidth: 1.5, backgroundColor: '#FFF1C1' },
  optionText: { flex: 1 },
  optionTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 16 * S, color: SparkColors.cocoaText, marginBottom: 2 * S },
  optionDesc: { fontFamily: SparkFonts.robotoRegular, fontSize: 13 * S, color: SparkColors.warmGray },
  footer: { paddingHorizontal: 24 * S, paddingBottom: 36 * S, paddingTop: 12 * S },
  beginBtn: { backgroundColor: SparkColors.cocoaCta, borderRadius: 23 * S, height: 52 * S, alignItems: 'center', justifyContent: 'center' },
  beginBtnDisabled: { opacity: 0.5 },
  beginBtnText: { fontFamily: SparkFonts.robotoBold, fontSize: 16 * S, color: '#FFFFFF' },
  recordContainer: { flex: 1, backgroundColor: '#2E2422' },
  recordSafe: { flex: 1 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 * S, paddingVertical: 12 * S },
  recordTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 15 * S, color: 'rgba(255,255,255,0.7)' },
  recordCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  waveformArea: { flexDirection: 'row', alignItems: 'center', gap: 3 * S, height: 80 * S, marginBottom: 20 * S },
  recBar: { width: 4 * S, borderRadius: 2 * S, backgroundColor: SparkColors.brandOrange },
  timerText: { fontFamily: SparkFonts.outfitBold, fontSize: 48 * S, color: '#FFFFFF' },
  recordControls: { alignItems: 'center', paddingBottom: 60 * S },
  micBtn: { width: 72 * S, height: 72 * S, borderRadius: 36 * S, backgroundColor: SparkColors.brandOrange, alignItems: 'center', justifyContent: 'center' },
  micBtnActive: { backgroundColor: '#D94030' },
});
