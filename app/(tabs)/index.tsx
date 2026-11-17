import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Image, TouchableOpacity,
  Animated, Modal, ScrollView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors, SparkFonts, SparkTypography } from '@/constants/Spark';

const { width: SW, height: SH } = Dimensions.get('window');
const S = SW / 390;

/* ───── background pattern data ───── */
type Shape = { type: 'square' | 'circle'; x: number; y: number };
const PATTERN_SHAPES: Shape[] = [
  // Row 0 (y=0)
  { type: 'square', x: -3, y: 0 }, { type: 'circle', x: 61, y: 0 },
  { type: 'square', x: 125, y: 0 }, { type: 'square', x: 253, y: 0 },
  { type: 'square', x: 317, y: 0 }, { type: 'circle', x: 381, y: 0 },
  // Row 1 (y=64)
  { type: 'circle', x: -3, y: 64 }, { type: 'square', x: 61, y: 64 },
  { type: 'square', x: 189, y: 64 }, { type: 'circle', x: 253, y: 64 },
  { type: 'circle', x: 317, y: 64 }, { type: 'square', x: 381, y: 64 },
  // Row 2 (y=128)
  { type: 'square', x: -3, y: 128 }, { type: 'square', x: 125, y: 128 },
  { type: 'circle', x: 189, y: 128 }, { type: 'square', x: 253, y: 128 },
  { type: 'square', x: 317, y: 128 },
  // Row 3 (y=192)
  { type: 'square', x: 61, y: 192 }, { type: 'circle', x: 125, y: 192 },
  { type: 'square', x: 189, y: 192 }, { type: 'square', x: 381, y: 192 },
  // Row 4 (y=256)
  { type: 'square', x: -3, y: 256 }, { type: 'circle', x: 61, y: 256 },
  { type: 'square', x: 125, y: 256 }, { type: 'square', x: 253, y: 256 },
  { type: 'square', x: 317, y: 256 }, { type: 'circle', x: 381, y: 256 },
  // Row 5 (y=320)
  { type: 'square', x: -3, y: 320 }, { type: 'circle', x: 61, y: 320 },
  { type: 'square', x: 125, y: 320 }, { type: 'square', x: 253, y: 320 },
  { type: 'square', x: 317, y: 320 }, { type: 'circle', x: 381, y: 320 },
];
const SHAPE_SIZE = 56;
const PATTERN_H = 384; // pattern area height
const YELLOW_COLOR = '#FDE068';
const CORAL_COLOR = '#F0A090';

function BackgroundPattern() {
  return (
    <View style={patStyles.wrap} pointerEvents="none">
      {PATTERN_SHAPES.map((s, i) => {
        // fade out toward bottom of pattern
        const rowOpacity = Math.max(0.03, 0.14 - (s.y / PATTERN_H) * 0.14);
        const size = SHAPE_SIZE * S;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: s.x * S,
              top: s.y * S,
              width: size,
              height: size,
              borderRadius: s.type === 'circle' ? size / 2 : 12 * S,
              backgroundColor: s.type === 'square' ? YELLOW_COLOR : CORAL_COLOR,
              opacity: rowOpacity,
            }}
          />
        );
      })}
    </View>
  );
}
const patStyles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, width: SW, height: PATTERN_H * S, overflow: 'hidden' },
});

/* ───── occasion choices ───── */
const OCCASIONS = [
  { id: 'interview', label: 'A job interview', icon: 'briefcase-outline' as const },
  { id: 'pitch', label: 'A pitch', icon: 'chatbubble-outline' as const },
  { id: 'keynote', label: 'A keynote', icon: 'mic-outline' as const },
  { id: 'lecture', label: 'A class or lecture', icon: 'school-outline' as const },
  { id: 'toast', label: 'A toast', icon: 'wine-outline' as const },
  { id: 'other', label: 'Other', icon: 'happy-outline' as const },
];

/* ───── material choices ───── */
const MATERIALS = [
  { id: 'script', title: 'Paste script', desc: 'Type or paste your speech text', icon: 'document-text-outline' as const },
  { id: 'upload', title: 'Upload audio or video', desc: 'Choose an audio or video file', icon: 'cloud-upload-outline' as const },
];

/* ───── time choices ───── */
const TIMES = [
  { id: '1', label: '1 minute', icon: 'time-outline' as const },
  { id: '3', label: '3 minutes', icon: 'time-outline' as const },
  { id: '5', label: '5 minutes', icon: 'time-outline' as const },
  { id: '15', label: '15 minutes', icon: 'time-outline' as const },
  { id: 'custom', label: 'Customize...', icon: 'time-outline' as const },
];

/* ───── bottom sheet constants ───── */
const SHEET_TOP = SH * 0.166; // Figma: y=140/844
const SHEET_RADIUS = 32 * S;

/* ═══════════════════════════════════════════ */
export default function HomeScreen() {
  const [showSheet, setShowSheet] = useState(false);
  const [step, setStep] = useState(1); // 1-3
  const [sessionName, setSessionName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [material, setMaterial] = useState('');
  const [timeChoice, setTimeChoice] = useState('');

  const slideAnim = useRef(new Animated.Value(SH)).current;

  /* open sheet */
  const openSheet = () => {
    setStep(1);
    setShowSheet(true);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
  };
  /* close sheet */
  const closeSheet = () => {
    Animated.timing(slideAnim, { toValue: SH, duration: 250, useNativeDriver: true }).start(() => {
      setShowSheet(false);
      setStep(1);
      setSessionName('');
      setOccasion('');
      setMaterial('');
      setTimeChoice('');
    });
  };
  /* next / back */
  const next = () => { if (step < 3) setStep(step + 1); };
  const back = () => { if (step > 1) setStep(step - 1); else closeSheet(); };

  /* ── render ── */
  return (
    <View style={styles.root}>
      {/* cream background + pattern */}
      <BackgroundPattern />

      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* ─── Home content ─── */}
        <View style={styles.homeContent}>
          {/* Top-left logo */}
          <Image source={require('@/assets/images/orate-logo.png')} style={styles.logo} resizeMode="contain" />

          {/* Character + text */}
          <View style={styles.hero}>
            <Image source={require('@/assets/images/orate-character.png')} style={styles.character} resizeMode="contain" />
            <Text style={styles.heroTitle}>Let's record your{'\n'}first session</Text>
            <Text style={styles.heroSub}>Practice makes perfect — start with{'\n'}a quick recording to warm up.</Text>
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={openSheet}>
            <Text style={styles.ctaText}>Start my first recording</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ═══ Bottom Sheet (modal) ═══ */}
      <Modal visible={showSheet} transparent animationType="none" statusBarTranslucent>
        <View style={styles.overlay}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
              {/* ── sheet header ── */}
              <View style={styles.sheetHeader}>
                {step > 1 ? (
                  <TouchableOpacity onPress={back} hitSlop={12} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={22 * S} color={SparkColors.cocoaText} />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.headerBtn} />
                )}
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={closeSheet} hitSlop={12} style={styles.headerBtn}>
                  <Ionicons name="close" size={22 * S} color={SparkColors.cocoaText} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.sheetScroll}
                contentContainerStyle={styles.sheetScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* step indicator */}
                <Text style={styles.stepLabel}>{step} of 3</Text>

                {/* ═══ STEP 1 ═══ */}
                {step === 1 && (
                  <>
                    <Text style={styles.sheetTitle}>Set up your recording</Text>

                    {/* session name */}
                    <Text style={styles.fieldLabel}>Recording name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Capstone presentation"
                      placeholderTextColor={SparkColors.paleGray}
                      value={sessionName}
                      onChangeText={setSessionName}
                    />

                    {/* occasion */}
                    <Text style={styles.fieldLabel}>What's the occasion?</Text>
                    {OCCASIONS.map((o) => (
                      <TouchableOpacity
                        key={o.id}
                        style={[styles.optionRow, occasion === o.id && styles.optionRowActive]}
                        activeOpacity={0.7}
                        onPress={() => setOccasion(o.id)}
                      >
                        <Ionicons name={o.icon} size={20 * S} color={SparkColors.brandOrange} />
                        <Text style={styles.optionText}>{o.label}</Text>
                        <View style={styles.radioOuter}>
                          {occasion === o.id && <View style={styles.radioInner} />}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {/* ═══ STEP 2 ═══ */}
                {step === 2 && (
                  <>
                    <Text style={styles.sheetTitle}>Add your material</Text>
                    <Text style={styles.sheetSub}>Optionally add a script or recording to compare against.</Text>

                    {MATERIALS.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        style={[styles.materialCard, material === m.id && styles.materialCardActive]}
                        activeOpacity={0.7}
                        onPress={() => setMaterial(m.id)}
                      >
                        <Ionicons name={m.icon} size={20 * S} color={SparkColors.brandOrange} style={{ marginTop: 2 * S }} />
                        <View style={styles.materialTextWrap}>
                          <Text style={styles.materialTitle}>{m.title}</Text>
                          <Text style={styles.materialDesc}>{m.desc}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}

                    <Text style={styles.helperText}>
                      You can always add or change this later.
                    </Text>
                  </>
                )}

                {/* ═══ STEP 3 ═══ */}
                {step === 3 && (
                  <>
                    <Text style={styles.sheetTitle}>Time</Text>
                    <Text style={styles.sheetSub}>Set a target duration for your session.</Text>

                    {TIMES.map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={[styles.optionRow, timeChoice === t.id && styles.optionRowActive]}
                        activeOpacity={0.7}
                        onPress={() => setTimeChoice(t.id)}
                      >
                        <Ionicons name={t.icon} size={20 * S} color={SparkColors.brandOrange} />
                        <Text style={styles.optionText}>{t.label}</Text>
                        <View style={styles.radioOuter}>
                          {timeChoice === t.id && <View style={styles.radioInner} />}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </ScrollView>

              {/* ── bottom button ── */}
              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.darkBtn}
                  activeOpacity={0.85}
                  onPress={step < 3 ? next : closeSheet}
                >
                  <Text style={styles.darkBtnText}>
                    {step === 1 ? 'Next' : step === 2 ? 'Continue without material' : 'Skip for now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

/* ═══════════ styles ═══════════ */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SparkColors.cream,
  },
  safe: { flex: 1 },

  /* ── home ── */
  homeContent: {
    flex: 1,
    paddingHorizontal: 24 * S,
  },
  logo: {
    width: 80 * S,
    height: 28 * S,
    marginTop: 12 * S,
  },
  hero: {
    alignItems: 'center',
    marginTop: 60 * S,
  },
  character: {
    width: 180 * S,
    height: 180 * S,
    marginBottom: 24 * S,
  },
  heroTitle: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 26 * S,
    lineHeight: 34 * S,
    color: SparkColors.cocoaText,
    textAlign: 'center',
    marginBottom: 10 * S,
  },
  heroSub: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    lineHeight: 22 * S,
    color: SparkColors.warmGray,
    textAlign: 'center',
  },
  ctaBtn: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 28 * S,
    height: 56 * S,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto' as any,
    marginBottom: 24 * S,
  },
  ctaText: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 16 * S,
    color: '#FFFFFF',
  },

  /* ── sheet ── */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    position: 'absolute',
    top: SHEET_TOP,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: SparkColors.cream,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * S,
    paddingTop: 20 * S,
    paddingBottom: 8 * S,
  },
  headerBtn: {
    width: 36 * S,
    height: 36 * S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingHorizontal: 24 * S,
    paddingBottom: 24 * S,
  },

  /* step indicator */
  stepLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
    marginBottom: 8 * S,
  },
  sheetTitle: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 24 * S,
    color: SparkColors.cocoaText,
    marginBottom: 20 * S,
  },
  sheetSub: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 14 * S,
    lineHeight: 20 * S,
    color: SparkColors.warmGray,
    marginTop: -12 * S,
    marginBottom: 20 * S,
  },

  /* text input */
  fieldLabel: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 14 * S,
    color: SparkColors.cocoaText,
    marginBottom: 8 * S,
  },
  input: {
    backgroundColor: SparkColors.warmCanvas,
    borderRadius: 16 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    height: 50 * S,
    paddingHorizontal: 16 * S,
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
    marginBottom: 20 * S,
  },

  /* option rows (occasion & time) */
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 49 * S,
    borderRadius: 25 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    backgroundColor: SparkColors.warmCanvas,
    paddingHorizontal: 18 * S,
    marginBottom: 10 * S,
  },
  optionRowActive: {
    borderColor: SparkColors.brandOrange,
    backgroundColor: '#FFF8EC',
  },
  optionText: {
    flex: 1,
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
    marginLeft: 14 * S,
  },
  radioOuter: {
    width: 20 * S,
    height: 20 * S,
    borderRadius: 10 * S,
    borderWidth: 1.5,
    borderColor: SparkColors.warmBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12 * S,
    height: 12 * S,
    borderRadius: 6 * S,
    backgroundColor: SparkColors.brandOrange,
  },

  /* material cards */
  materialCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 72 * S,
    borderRadius: 20 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    backgroundColor: SparkColors.warmCanvas,
    paddingHorizontal: 18 * S,
    paddingVertical: 14 * S,
    marginBottom: 12 * S,
  },
  materialCardActive: {
    borderColor: SparkColors.brandOrange,
    backgroundColor: '#FFF8EC',
  },
  materialTextWrap: {
    flex: 1,
    marginLeft: 14 * S,
  },
  materialTitle: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
    marginBottom: 2 * S,
  },
  materialDesc: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
  },
  helperText: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
    textAlign: 'center',
    marginTop: 8 * S,
  },

  /* bottom button */
  sheetFooter: {
    paddingHorizontal: 24 * S,
    paddingBottom: Platform.OS === 'ios' ? 36 * S : 20 * S,
    paddingTop: 12 * S,
  },
  darkBtn: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 28 * S,
    height: 52 * S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBtnText: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 16 * S,
    color: '#FFFFFF',
  },
});
