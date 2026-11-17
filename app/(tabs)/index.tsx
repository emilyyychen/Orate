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

/* ───── decorative dots ───── */
const DOTS = [
  { size: 18, x: 50, y: 60, opacity: 0.25, color: SparkColors.brandOrange },
  { size: 12, x: 130, y: 40, opacity: 0.18, color: SparkColors.brandOrange },
  { size: 22, x: 220, y: 55, opacity: 0.22, color: SparkColors.brandOrange },
  { size: 10, x: 300, y: 35, opacity: 0.15, color: SparkColors.brandOrange },
  { size: 16, x: 340, y: 70, opacity: 0.20, color: SparkColors.brandOrange },
  { size: 14, x: 85, y: 95, opacity: 0.16, color: SparkColors.peach },
  { size: 20, x: 270, y: 90, opacity: 0.20, color: SparkColors.peach },
  { size: 8, x: 180, y: 80, opacity: 0.14, color: SparkColors.brandOrange },
  { size: 11, x: 25, y: 110, opacity: 0.12, color: SparkColors.brandOrange },
  { size: 15, x: 350, y: 110, opacity: 0.18, color: SparkColors.peach },
];

/* ───── occasion options (step 1, multi-select) ───── */
const OCCASIONS = [
  { id: 'interview', label: 'A job interview', icon: 'briefcase-outline' as const },
  { id: 'pitch', label: 'A pitch', icon: 'chatbubble-outline' as const },
  { id: 'keynote', label: 'A keynote', icon: 'easel-outline' as const },
  { id: 'lecture', label: 'A class or lecture', icon: 'school-outline' as const },
  { id: 'toast', label: 'A toast', icon: 'wine-outline' as const },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline' as const },
];

/* ───── material options (step 2) ───── */
const MATERIALS = [
  { id: 'script', title: 'Paste script', desc: 'Type or paste your speech text', icon: 'document-text-outline' as const },
  { id: 'upload', title: 'Upload audio or video', desc: 'Choose an audio or video file', icon: 'cloud-upload-outline' as const },
];

/* ───── time options (step 3, single-select) ───── */
const TIMES = [
  { id: '1', label: '1 minute' },
  { id: '3', label: '3 minutes' },
  { id: '5', label: '5 minutes' },
  { id: '15', label: '15 minutes' },
  { id: 'custom', label: 'Customize...' },
];

/* ━━━━━ HOME SCREEN ━━━━━ */
export default function HomeScreen() {
  const [showSetup, setShowSetup] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Image source={require('@/assets/images/orate-logo.png')} style={styles.logoImg} resizeMode="contain" />
          <Text style={styles.logoText}>Orate</Text>
        </View>

        {/* decorative dots */}
        {DOTS.map((d, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: d.size * S,
              height: d.size * S,
              borderRadius: (d.size * S) / 2,
              backgroundColor: d.color,
              opacity: d.opacity,
              left: d.x * S,
              top: d.y * S + 44 * S,
            }}
          />
        ))}

        {/* center content */}
        <View style={styles.centerContent}>
          <Image
            source={require('@/assets/images/orate-character.png')}
            style={styles.character}
            resizeMode="contain"
          />
          <Text style={styles.headline}>Let's record your{'\n'}first section</Text>
          <Text style={styles.subtitle}>Set up a session, then press record.</Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={() => setShowSetup(true)}>
            <Text style={styles.ctaText}>Start my first recording</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* session setup bottom sheet */}
      {showSetup && <SessionSetupSheet onClose={() => setShowSetup(false)} />}
    </SafeAreaView>
  );
}

/* ━━━━━ SESSION SETUP BOTTOM SHEET ━━━━━ */
function SessionSetupSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(SH)).current;

  /* session state */
  const [sessionName, setSessionName] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
    }).start();
  }, []);

  const dismiss = () => {
    Animated.timing(slideAnim, { toValue: SH, duration: 250, useNativeDriver: true }).start(() => onClose());
  };

  const toggleOccasion = (id: string) => {
    setSelectedOccasions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const goNext = () => { if (step < 3) setStep(step + 1); };
  const goBack = () => { if (step > 1) setStep(step - 1); };

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      <View style={sheet.overlay}>
        <TouchableOpacity style={sheet.overlayTouch} activeOpacity={1} onPress={dismiss} />
        <Animated.View style={[sheet.sheetWrap, { transform: [{ translateY: slideAnim }] }]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            {/* sheet header */}
            <View style={sheet.sheetHeader}>
              <View style={sheet.headerRow}>
                {step > 1 ? (
                  <TouchableOpacity onPress={goBack} style={sheet.headerBtn}>
                    <Ionicons name="chevron-back" size={24 * S} color={SparkColors.cocoaText} />
                  </TouchableOpacity>
                ) : (
                  <View style={sheet.headerBtn} />
                )}
                {/* Orate logo center */}
                <View style={sheet.headerCenter}>
                  <Image source={require('@/assets/images/orate-logo.png')} style={sheet.sheetLogo} resizeMode="contain" />
                  <Text style={sheet.sheetLogoText}>Orate</Text>
                </View>
                <TouchableOpacity onPress={dismiss} style={sheet.headerBtn}>
                  <Ionicons name="close" size={24 * S} color={SparkColors.cocoaText} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={sheet.scrollBody}
              contentContainerStyle={sheet.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {step === 1 && <Step1 sessionName={sessionName} setSessionName={setSessionName} selectedOccasions={selectedOccasions} toggleOccasion={toggleOccasion} />}
              {step === 2 && <Step2 />}
              {step === 3 && <Step3 selectedTime={selectedTime} setSelectedTime={setSelectedTime} />}
            </ScrollView>

            {/* bottom CTA */}
            <View style={sheet.bottomCta}>
              {step === 1 && (
                <TouchableOpacity style={sheet.darkBtn} activeOpacity={0.85} onPress={goNext}>
                  <Text style={sheet.darkBtnText}>Next</Text>
                </TouchableOpacity>
              )}
              {step === 2 && (
                <TouchableOpacity style={sheet.darkBtn} activeOpacity={0.85} onPress={goNext}>
                  <Text style={sheet.darkBtnText}>Continue without material</Text>
                </TouchableOpacity>
              )}
              {step === 3 && (
                <TouchableOpacity style={sheet.creamBtn} activeOpacity={0.85} onPress={dismiss}>
                  <Text style={sheet.creamBtnText}>Skip for now</Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ───── step 1: set up your recording ───── */
function Step1({
  sessionName, setSessionName, selectedOccasions, toggleOccasion,
}: {
  sessionName: string; setSessionName: (v: string) => void;
  selectedOccasions: string[]; toggleOccasion: (id: string) => void;
}) {
  return (
    <View>
      <Text style={sheet.stepLabel}>1 of 3</Text>
      <Text style={sheet.stepTitle}>Set up your recording</Text>

      {/* session name */}
      <Text style={sheet.inputLabel}>Session name · optional</Text>
      <TextInput
        style={sheet.textInput}
        placeholder="e.g. My presentation"
        placeholderTextColor={SparkColors.paleGray}
        value={sessionName}
        onChangeText={setSessionName}
      />

      {/* occasion list */}
      <Text style={sheet.sectionTitle}>What are you preparing for?</Text>
      {OCCASIONS.map(occ => {
        const selected = selectedOccasions.includes(occ.id);
        return (
          <TouchableOpacity
            key={occ.id}
            style={[sheet.optionRow, selected && sheet.optionRowSelected]}
            activeOpacity={0.7}
            onPress={() => toggleOccasion(occ.id)}
          >
            <View style={[sheet.optionIcon, selected && sheet.optionIconSelected]}>
              <Ionicons name={occ.icon} size={18 * S} color={selected ? SparkColors.brandOrange : SparkColors.warmGray} />
            </View>
            <Text style={[sheet.optionText, selected && sheet.optionTextSelected]}>{occ.label}</Text>
            <View style={[sheet.radio, selected && sheet.radioSelected]}>
              {selected && <View style={sheet.radioDot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ───── step 2: add your material ───── */
function Step2() {
  return (
    <View>
      <Text style={sheet.stepLabel}>2 of 3</Text>
      <Text style={sheet.stepTitle}>Add your material</Text>
      <Text style={sheet.stepSubtitle}>Add a script, audio or video for feedback.</Text>

      {MATERIALS.map(mat => (
        <TouchableOpacity key={mat.id} style={sheet.materialCard} activeOpacity={0.7}>
          <View style={sheet.materialIcon}>
            <Ionicons name={mat.icon} size={22 * S} color={SparkColors.brandOrange} />
          </View>
          <View style={sheet.materialInfo}>
            <Text style={sheet.materialTitle}>{mat.title}</Text>
            <Text style={sheet.materialDesc}>{mat.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={sheet.helperNote}>No material yet? You can record in the app.</Text>
    </View>
  );
}

/* ───── step 3: time ───── */
function Step3({
  selectedTime, setSelectedTime,
}: {
  selectedTime: string | null; setSelectedTime: (v: string) => void;
}) {
  return (
    <View>
      <Text style={sheet.stepLabel}>3 of 3</Text>
      <Text style={sheet.stepTitle}>Time</Text>
      <Text style={sheet.stepSubtitle}>Choose a target, or record without a time limit.</Text>

      {TIMES.map(t => {
        const selected = selectedTime === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={[sheet.optionRow, selected && sheet.optionRowSelected]}
            activeOpacity={0.7}
            onPress={() => setSelectedTime(t.id)}
          >
            <View style={[sheet.optionIcon, selected && sheet.optionIconSelected]}>
              <Ionicons name="time-outline" size={18 * S} color={selected ? SparkColors.brandOrange : SparkColors.warmGray} />
            </View>
            <Text style={[sheet.optionText, selected && sheet.optionTextSelected]}>{t.label}</Text>
            <View style={[sheet.radio, selected && sheet.radioSelected]}>
              {selected && <View style={sheet.radioDot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ━━━━━ STYLES ━━━━━ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SparkColors.cream },
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * S,
    paddingTop: 8 * S,
    gap: 6 * S,
  },
  logoImg: { width: 32 * S, height: 32 * S },
  logoText: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 20 * S,
    color: SparkColors.brandOrange,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24 * S,
  },
  character: {
    width: 140 * S,
    height: 140 * S,
    marginBottom: 20 * S,
  },
  headline: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 24 * S,
    lineHeight: 30 * S,
    color: SparkColors.cocoaText,
    textAlign: 'center',
    marginBottom: 10 * S,
  },
  subtitle: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.warmGray,
    textAlign: 'center',
  },
  ctaWrap: {
    paddingHorizontal: 24 * S,
    paddingBottom: 16 * S,
  },
  ctaButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 14 * S,
    paddingVertical: 16 * S,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: SparkFonts.robotoBold,
    fontSize: 16 * S,
    color: '#FFFFFF',
  },
});

/* ───── bottom sheet styles ───── */
const SHEET_TOP = SH * 0.08;
const sheet = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  overlayTouch: { height: SHEET_TOP },
  sheetWrap: {
    flex: 1,
    backgroundColor: SparkColors.cream,
    borderTopLeftRadius: 24 * S,
    borderTopRightRadius: 24 * S,
    overflow: 'hidden',
  },
  sheetHeader: {
    paddingTop: 16 * S,
    paddingHorizontal: 16 * S,
    paddingBottom: 8 * S,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: { width: 40 * S, alignItems: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 5 * S },
  sheetLogo: { width: 24 * S, height: 24 * S },
  sheetLogoText: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 17 * S,
    color: SparkColors.brandOrange,
  },
  scrollBody: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 * S, paddingBottom: 20 * S },

  /* step text */
  stepLabel: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
    marginBottom: 6 * S,
    marginTop: 8 * S,
  },
  stepTitle: {
    fontFamily: SparkFonts.outfitBold,
    fontSize: 22 * S,
    color: SparkColors.cocoaText,
    marginBottom: 16 * S,
  },
  stepSubtitle: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 14 * S,
    color: SparkColors.warmGray,
    marginBottom: 20 * S,
    marginTop: -8 * S,
  },

  /* input */
  inputLabel: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
    marginBottom: 8 * S,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12 * S,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    paddingHorizontal: 16 * S,
    paddingVertical: 14 * S,
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
    marginBottom: 24 * S,
  },

  /* section */
  sectionTitle: {
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
    marginBottom: 12 * S,
  },

  /* option row (occasions / time) */
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14 * S,
    borderWidth: 1.5,
    borderColor: SparkColors.warmBorder,
    paddingVertical: 14 * S,
    paddingHorizontal: 14 * S,
    marginBottom: 10 * S,
    gap: 12 * S,
  },
  optionRowSelected: {
    backgroundColor: '#FFF8EC',
    borderColor: SparkColors.brandOrange,
  },
  optionIcon: {
    width: 36 * S,
    height: 36 * S,
    borderRadius: 18 * S,
    backgroundColor: '#FFF6EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconSelected: {
    backgroundColor: '#FFF0D4',
  },
  optionText: {
    flex: 1,
    fontFamily: SparkFonts.robotoMedium,
    fontSize: 15 * S,
    color: SparkColors.cocoaText,
  },
  optionTextSelected: {
    color: SparkColors.cocoaText,
  },
  radio: {
    width: 22 * S,
    height: 22 * S,
    borderRadius: 11 * S,
    borderWidth: 1.5,
    borderColor: SparkColors.warmBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioSelected: {
    borderColor: SparkColors.brandOrange,
    backgroundColor: SparkColors.brandOrange,
  },
  radioDot: {
    width: 8 * S,
    height: 8 * S,
    borderRadius: 4 * S,
    backgroundColor: '#FFFFFF',
  },

  /* material cards (step 2) */
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SparkColors.warmCanvas,
    borderRadius: 14 * S,
    paddingVertical: 18 * S,
    paddingHorizontal: 16 * S,
    marginBottom: 12 * S,
    gap: 14 * S,
  },
  materialIcon: {
    width: 42 * S,
    height: 42 * S,
    borderRadius: 21 * S,
    backgroundColor: '#FFF0D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialInfo: { flex: 1 },
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
  helperNote: {
    fontFamily: SparkFonts.robotoRegular,
    fontSize: 13 * S,
    color: SparkColors.warmGray,
    textAlign: 'center',
    marginTop: 8 * S,
  },

  /* bottom buttons */
  bottomCta: {
    paddingHorizontal: 24 * S,
    paddingTop: 12 * S,
    paddingBottom: Platform.OS === 'ios' ? 36 * S : 20 * S,
    backgroundColor: SparkColors.cream,
  },
  darkBtn: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 14 * S,
    paddingVertical: 16 * S,
    alignItems: 'center',
  },
  darkBtnText: {
    fontFamily: SparkFonts.robotoBold,
    fontSize: 16 * S,
    color: '#FFFFFF',
  },
  creamBtn: {
    backgroundColor: SparkColors.warmCanvas,
    borderRadius: 14 * S,
    paddingVertical: 16 * S,
    alignItems: 'center',
  },
  creamBtnText: {
    fontFamily: SparkFonts.robotoBold,
    fontSize: 16 * S,
    color: SparkColors.cocoaText,
  },
});
