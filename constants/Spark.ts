/**
 * Spark Design System — Orate color tokens & typography
 * Matches the Figma design file exactly.
 */

export const SparkColors = {
  // Backgrounds
  cream: '#FFFDF5',
  warmCanvas: '#FFF6E8',
  sheetWhite: '#FFFCF5',

  // Accent
  brandOrange: '#FE9A0E',
  orange: '#FF9900',
  tangerine: '#FF7D1F',
  gold: '#FFE47B',
  peach: '#FFE8BE',
  paleYellow: '#FFF0C3',

  // Text
  cocoaText: '#382823',
  warmGray: '#918880',
  paleGray: '#B6ADA6',
  brown: '#79513C',

  // Interactive
  cocoaCta: '#3A2925',

  // Borders & Surfaces
  warmBorder: '#E9DECF',
  sand: '#DBD0C2',

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
} as const;

export const SparkTypography = {
  headline: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    lineHeight: 28,
    color: '#382823',
  },
  headlineLarge: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    lineHeight: 34,
    color: '#382823',
  },
  body: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    lineHeight: 22,
    color: '#382823',
  },
  bodyRegular: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#382823',
  },
  helper: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#918880',
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
    color: '#918880',
    textTransform: 'uppercase' as const,
  },
} as const;
