/**
 * Spark Design System — Orate color tokens & typography
 * Updated to match the latest Figma design system.
 */

export const SparkColors = {
  // Backgrounds
  cream: '#FFFCF3',
  container: '#FFFFFF',
  border: '#E8DFC6',
  borderStrong: '#B8A98F',
  destructiveBg: '#FFEDE6',

  // Accent
  orange: '#FF9900',
  yellow500: '#FFC501',
  yellow600: '#FFE47B',
  yellow100: '#FFF4CC',
  coral: '#FF4D36',

  // Text
  textPrimary: '#1C1C1E',
  textSecondary: '#706659',
  textTertiary: '#8EBE93',
  textLabel: '#8A7B66',
  textInverse: '#FFFCF5',

  // Interactive
  button: '#3A2925',
  chevron: '#B8A98F',
  marker: '#FF4D36',

  // Legacy aliases for gradual migration
  warmCanvas: '#FFF4CC',
  brandOrange: '#FF9900',
  cocoaText: '#1C1C1E',
  warmGray: '#706659',
  paleGray: '#B8A98F',
  cocoaCta: '#3A2925',
  warmBorder: '#E8DFC6',
  sand: '#B8A98F',
  paleYellow: '#FFE47B',
  peach: '#FFEDE6',
  gold: '#FFE47B',
  sheetWhite: '#FFFCF5',

  // Score
  orangeScore: '#FF742F',

  // Staircase colors (for onboarding illustration)
  stairYellowLight: '#FFE98A',
  stairYellow: '#FFD93D',
  stairGold: '#FFC107',
  stairOrangeLight: '#FFB74D',
  stairOrange: '#FF9800',
} as const;

export const SparkFonts = {
  outfitBold: 'Outfit-Bold',
  robotoRegular: 'Roboto-Regular',
  robotoMedium: 'Roboto-Medium',
  robotoBold: 'Roboto-Bold',
  robotoSemiBold: 'Roboto-SemiBold',
  interRegular: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  interBold: 'Inter-Bold',
} as const;

export const SparkTypography = {
  headline: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    lineHeight: 28,
    color: '#1C1C1E',
  },
  headlineLarge: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    lineHeight: 34,
    color: '#1C1C1E',
  },
  body: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    lineHeight: 22,
    color: '#1C1C1E',
  },
  bodyRegular: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#1C1C1E',
  },
  helper: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#706659',
  },
  ctaButton: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1,
    color: '#8A7B66',
    textTransform: 'uppercase' as const,
  },
} as const;
