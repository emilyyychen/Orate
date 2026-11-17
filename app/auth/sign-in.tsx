import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SparkColors } from '@/constants/Spark';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top section with logo */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/orate-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.heading}>
          Get started with{'\n'}Orate
        </Text>
      </View>

      {/* Bottom section with sign-in options */}
      <View style={styles.bottomSection}>
        {/* Email button */}
        <Pressable
          style={styles.emailButton}
          onPress={() => router.push('/auth/email')}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.emailButtonText}>Continue with email</Text>
        </Pressable>

        {/* Social sign-in row */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialButton}>
            <Ionicons name="logo-apple" size={24} color={SparkColors.cocoaText} />
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Image
              source={require('../../assets/images/google-icon.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SparkColors.cream,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  heading: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    lineHeight: 36,
    color: SparkColors.cocoaText,
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  emailButton: {
    backgroundColor: SparkColors.cocoaCta,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  emailButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  socialButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  termsText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: SparkColors.warmGray,
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
