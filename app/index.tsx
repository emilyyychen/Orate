import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SparkColors } from '@/constants/Spark';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/orate-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Orate</Text>
        </View>
        <Text style={styles.tagline}>
          Feel ready for your{'\n'}next big moment
        </Text>
      </View>
      <View style={styles.bottomSection}>
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push('/onboarding/carousel')}
        >
          <Text style={styles.ctaText}>Get started</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/auth/sign-in')}>
          <Text style={styles.signInLink}>
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SparkColors.cream,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  brandName: {
    fontFamily: 'Outfit-Bold',
    fontSize: 36,
    color: SparkColors.brandOrange,
  },
  tagline: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    lineHeight: 32,
    color: SparkColors.cocoaText,
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  signInLink: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: SparkColors.warmGray,
  },
});
