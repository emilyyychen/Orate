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

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

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
        <Text style={styles.heading}>What should we call you?</Text>

        {/* Description */}
        <Text style={styles.description}>
          A first name or nickname is enough.{'\n'}You can change it later.
        </Text>

        {/* Name input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{'NAME · OPTIONAL'}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Dena"
            placeholderTextColor={SparkColors.paleGray}
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
          />
        </View>

        {/* Spacer */}
        <View style={styles.flex} />

        {/* CTA button */}
        <Pressable
          style={styles.ctaButton}
          onPress={() => {
            router.push({ pathname: '/auth/welcome', params: { name: name || 'there' } });
          }}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>

        {/* Skip */}
        <Pressable
          style={styles.skipButton}
          onPress={() => {
            router.push({ pathname: '/auth/welcome', params: { name: 'there' } });
          }}
        >
          <Text style={styles.skipText}>Skip for now</Text>
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
  ctaButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 32,
    marginBottom: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  skipText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: SparkColors.warmGray,
  },
});
