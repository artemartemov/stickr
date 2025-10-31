/**
 * SEMANTIC DESIGN TOKENS
 * Purpose-based tokens that reference primitives
 * Use these in components instead of primitives
 */

import { primitives } from './primitives';

// Light mode semantic tokens
export const lightMode = {
  // ===== TEXT =====
  text: {
    primary: primitives.color.gray900,      // #222 from DS Coverage
    secondary: primitives.color.gray400,    // #BDBDBD from DS Coverage
    tertiary: primitives.color.gray500,
    inverse: primitives.color.white,
    onBrand: primitives.color.white,
  },

  // ===== BACKGROUND =====
  bg: {
    primary: primitives.color.white,
    secondary: primitives.color.gray100,
    tertiary: primitives.color.gray850,
    inverse: primitives.color.gray900,
    hover: primitives.alpha.black10,
  },

  // ===== BORDER =====
  border: {
    default: primitives.color.gray200,
    strong: primitives.color.gray300,
    focus: primitives.color.blue500,        // #4697F8 from DS Coverage
  },

  // ===== BUTTON =====
  button: {
    primary: {
      bg: primitives.color.gray900,         // #222
      bgHover: primitives.color.gray950,     // #111 from DS Coverage
      text: primitives.color.white,
    },
    secondary: {
      bg: 'transparent',
      bgHover: primitives.alpha.black10,
      border: primitives.color.gray200,
      text: primitives.color.gray900,
    },
    ghost: {
      bg: 'transparent',
      bgHover: primitives.alpha.black10,
      text: primitives.color.gray900,
    },
    tertiary: {
      bg: 'transparent',                    // Transparent until hover
      bgHover: primitives.color.grayEEE,    // #eee from DS Coverage SHFFL button hover
      bgActive: primitives.color.gray100,   // #f5f5f5 from DS Coverage SHFFL button active
      text: primitives.color.gray900,
    },
    disabled: {
      bg: primitives.alpha.black10,
      text: primitives.alpha.black30,
    },
  },

  // ===== TAB/SEGMENTED CONTROL =====
  tab: {
    containerBg: primitives.color.gray100,
    activeBg: primitives.color.gray900,
    activeText: primitives.color.white,
    inactiveText: primitives.color.gray900,
  },

  // ===== CHECKBOX =====
  checkbox: {
    checkedBg: primitives.color.black,
    uncheckedBg: primitives.color.gray200,
    checkmark: primitives.color.white,
  },

  // ===== MODAL =====
  modal: {
    overlay: primitives.alpha.black75,
    bg: primitives.color.white,
  },

  // ===== TOOLTIP =====
  tooltip: {
    bg: primitives.color.gray900,        // #222 - default tooltip background
    bgDark: primitives.color.black,      // #000 - darker variant for emphasis
    text: primitives.color.white,
  },

  // ===== CARD =====
  card: {
    bg: primitives.color.white,
  },

  // ===== PROGRESS =====
  progress: {
    fill: primitives.color.black,
    fillSecondary: primitives.color.gray800,
  },
} as const;

// Dark mode semantic tokens
export const darkMode = {
  // ===== TEXT =====
  text: {
    primary: primitives.color.white,
    secondary: primitives.color.gray400,
    tertiary: primitives.color.gray500,
    inverse: primitives.color.gray900,
    onBrand: primitives.color.gray900,
  },

  // ===== BACKGROUND =====
  bg: {
    primary: primitives.color.gray875,
    secondary: primitives.color.gray850,
    tertiary: primitives.color.gray100,
    inverse: primitives.color.white,
    hover: primitives.alpha.white10,
  },

  // ===== BORDER =====
  border: {
    default: primitives.color.gray700,
    strong: primitives.color.gray500,
    focus: primitives.color.blue500,
  },

  // ===== BUTTON =====
  button: {
    primary: {
      bg: primitives.color.white,
      bgHover: primitives.color.gray50,
      text: primitives.color.gray900,
    },
    secondary: {
      bg: 'transparent',
      bgHover: primitives.alpha.white10,
      border: primitives.color.gray700,
      text: primitives.color.white,
    },
    ghost: {
      bg: 'transparent',
      bgHover: primitives.alpha.white10,
      text: primitives.color.white,
    },
    tertiary: {
      bg: 'transparent',                   // Transparent until hover
      bgHover: primitives.color.gray850,   // Darker for dark mode
      text: primitives.color.white,
    },
    disabled: {
      bg: primitives.alpha.white10,
      text: primitives.alpha.white30,
    },
  },

  // ===== TAB/SEGMENTED CONTROL =====
  tab: {
    containerBg: primitives.color.gray850,
    activeBg: primitives.color.white,
    activeText: primitives.color.gray900,
    inactiveText: primitives.color.gray500,
  },

  // ===== CHECKBOX =====
  checkbox: {
    checkedBg: primitives.color.white,
    uncheckedBg: primitives.color.gray700,
    checkmark: primitives.color.gray900,
  },

  // ===== MODAL =====
  modal: {
    overlay: primitives.alpha.black90,
    bg: primitives.color.gray875,
  },

  // ===== TOOLTIP =====
  tooltip: {
    bg: primitives.color.white,          // Default tooltip background for dark mode
    bgDark: primitives.color.gray50,     // Lighter variant for emphasis in dark mode
    text: primitives.color.gray900,
  },

  // ===== CARD =====
  card: {
    bg: primitives.color.gray875,
  },

  // ===== PROGRESS =====
  progress: {
    fill: primitives.color.white,
    fillSecondary: primitives.color.gray500,
  },
} as const;

// Typography semantic tokens (same for both modes)
export const typography = {
  // ===== HEADINGS =====
  heading: {
    section: {
      fontSize: primitives.fontSize.base,      // 12px - DS Coverage uses .label class for section headings
      fontWeight: primitives.fontWeight.semibold,  // 600 from DS Coverage
      letterSpacing: primitives.letterSpacing.label,  // 1.5px from DS Coverage .label class
      textTransform: 'uppercase' as const,
    },
    subsection: {
      fontSize: primitives.fontSize.md,
      fontWeight: primitives.fontWeight.semibold,
      letterSpacing: primitives.letterSpacing.normal,
    },
    card: {
      fontSize: primitives.fontSize.base,
      fontWeight: primitives.fontWeight.medium,
      textTransform: 'uppercase' as const,
      letterSpacing: primitives.letterSpacing.normal,
    },
  },

  // ===== LABELS =====
  label: {
    fontSize: primitives.fontSize.base,
    fontWeight: primitives.fontWeight.semibold,
    letterSpacing: primitives.letterSpacing.label,  // 1.5px from DS Coverage
    textTransform: 'uppercase' as const,
  },

  // ===== BODY =====
  body: {
    fontSize: primitives.fontSize.base,        // 12px from DS Coverage
    lineHeight: primitives.lineHeight.relaxed,
  },

  bodySm: {
    fontSize: primitives.fontSize.sm,
    lineHeight: primitives.lineHeight.normal,
  },

  // ===== CODE =====
  code: {
    fontFamily: primitives.fontFamily.mono,
    fontSize: primitives.fontSize.sm,
  },

  // ===== VALUES/METRICS =====
  value: {
    fontSize: primitives.fontSize.base,
    fontWeight: primitives.fontWeight.medium,
    fontFeatureSettings: '"tnum"',
  },

  metricLarge: {
    fontSize: primitives.fontSize.xxl,
    fontWeight: primitives.fontWeight.bold,
    fontFeatureSettings: '"tnum"',
  },
} as const;

// Spacing semantic tokens
export const spacing = primitives.spacing;

// Size semantic tokens (organized by component)
export const size = {
  button: primitives.size.button,
  icon: primitives.size.icon,
  input: primitives.size.input,
} as const;

// Border radius semantic tokens
export const borderRadius = primitives.borderRadius;

// Z-index semantic tokens
export const zIndex = primitives.zIndex;

// Transition semantic tokens
export const transition = primitives.transition;
