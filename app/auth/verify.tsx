import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors } from '@/constants/Spark';

const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const isComplete = code.every((digit) => digit !== '');

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const digits = text.replace(/[^0-9]/g, '').split('').slice(0, CODE_LENGTH);
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < CODE_LENGTH) {
          newCode[index + i] = d;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      // Auto-submit if all filled
      if (newCode.every((d) => d !== '')) {
        setTimeout(() => router.push('/auth/name'), 300);
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit entered
    if (text && index === CODE_LENGTH - 1) {
      const finalCode = [...newCode];
      if (finalCode.every((d) => d !== '')) {
        setTimeout(() => router.push('/auth/name'), 300);
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={SparkColors.cocoaText} />
      </Pressable>

      {/* Header */}
      <Text style={styles.heading}>Check your email</Text>

      {/* Description */}
      <Text style={styles.description}>
        Enter the 6-digit code sent to{'\n'}
        {email || 'your email'}
      </Text>

      {/* Code input boxes - bigger and rounder like Figma */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[
              styles.codeInput,
              digit ? styles.codeInputFilled : styles.codeInputEmpty,
            ]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoFocus={index === 0}
          />
        ))}
      </View>

      {/* Resend link */}
      <Pressable style={styles.resendButton}>
        <Text style={styles.resendText}>Send a new code</Text>
      </Pressable>

      {/* Helper text */}
      <Text style={styles.helperText}>You can use this code only once.</Text>

      {/* Spacer */}
      <View style={styles.flex} />

      {/* CTA button */}
      <Pressable
        style={[styles.ctaButton, !isComplete && styles.ctaButtonDisabled]}
        onPress={() => {
          if (isComplete) {
            router.push('/auth/name');
          }
        }}
        disabled={!isComplete}
      >
        <Text style={styles.ctaText}>Verify email</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SparkColors.cream,
  },
  flex: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  heading: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    lineHeight: 34,
    color: SparkColors.cocoaText,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 24,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: SparkColors.warmGray,
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  codeInput: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    color: SparkColors.cocoaText,
  },
  codeInputEmpty: {
    borderColor: SparkColors.warmBorder,
    backgroundColor: 'transparent',
  },
  codeInputFilled: {
    borderColor: SparkColors.warmBorder,
    backgroundColor: 'transparent',
  },
  resendButton: {
    paddingHorizontal: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: SparkColors.brandOrange,
  },
  helperText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: SparkColors.warmGray,
    paddingHorizontal: 32,
  },
  ctaButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
