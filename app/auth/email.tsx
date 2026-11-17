import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors } from '@/constants/Spark';

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const isValidEmail = email.includes('@') && email.includes('.');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={SparkColors.cocoaText} />
        </Pressable>

        {/* Header */}
        <Text style={styles.heading}>Continue with email</Text>

        {/* Description */}
        <Text style={styles.description}>
          {"We'll send a code to your email.\nNo password to remember."}
        </Text>

        {/* Email input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
        </View>

        {/* Helper text */}
        <Text style={styles.helperText}>
          Use the same email next time to find{'\n'}your recordings and saved practice.
        </Text>

        {/* Spacer */}
        <View style={styles.flex} />

        {/* CTA button */}
        <Pressable
          style={[styles.ctaButton, !isValidEmail && styles.ctaButtonDisabled]}
          onPress={() => {
            if (isValidEmail) {
              router.push({ pathname: '/auth/verify', params: { email } });
            }
          }}
          disabled={!isValidEmail}
        >
          <Text style={styles.ctaText}>Send sign-in code</Text>
        </Pressable>
      </KeyboardAvoidingView>
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
  inputContainer: {
    marginHorizontal: 32,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 11,
    letterSpacing: 1,
    color: SparkColors.warmGray,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  input: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: SparkColors.cocoaText,
    padding: 0,
  },
  helperText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: SparkColors.warmGray,
    paddingHorizontal: 32,
    marginTop: 16,
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
