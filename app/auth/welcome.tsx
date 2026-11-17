import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors } from '@/constants/Spark';

export default function WelcomeScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const displayName = name || 'there';

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={SparkColors.cocoaText} />
      </Pressable>

      {/* Heading */}
      <Text style={styles.heading}>{"You’re signed in"}</Text>

      {/* Character illustration */}
      <View style={styles.characterContainer}>
        <Image
          source={require('../../assets/images/orate-character.png')}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </View>

      {/* Welcome message */}
      <Text style={styles.welcomeText}>Welcome, {displayName}</Text>

      {/* Info card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NAME</Text>
          <Text style={styles.infoValue}>{displayName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>EMAIL</Text>
          <Text style={styles.infoValue}>dena.parker@example.com</Text>
        </View>
      </View>

      {/* Helper text */}
      <Text style={styles.helperText}>
        Your account keeps your recordings{'\n'}and practice together.
      </Text>

      {/* Spacer */}
      <View style={styles.flex} />

      {/* CTA button */}
      <Pressable
        style={styles.ctaButton}
        onPress={() => {
          // Navigate to main app
          router.replace('/(tabs)');
        }}
      >
        <Text style={styles.ctaText}>Continue</Text>
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
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: 100,
    height: 100,
  },
  welcomeText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    lineHeight: 30,
    color: SparkColors.cocoaText,
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  infoCard: {
    marginHorizontal: 32,
    borderWidth: 1,
    borderColor: SparkColors.warmBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 11,
    letterSpacing: 1,
    color: SparkColors.warmGray,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: SparkColors.cocoaText,
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
  ctaText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
