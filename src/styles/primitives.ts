/**
 * PRIMITIVE DESIGN TOKENS
 * Raw values - DO NOT use directly in components
 * These are referenced by semantic tokens only
 */

export const primitives = {
  // ===== COLORS =====
  color: {
    // Grayscale
    white: '#FFFFFF',
    gray50: '#F0F0F0',
    gray100: '#F5F5F5',
    gray150: '#E8E8E8',
    gray200: '#E5E5E5',
    gray300: '#D4D4D4',
    gray400: '#BDBDBD',
    gray500: '#B8B8B8',
    gray700: '#666666',
    gray800: '#52525B',
    gray850: '#242424',
    gray875: '#232323',
    gray900: '#222222',
    black: '#000000',

    // Brand/Accent
    blue500: '#4697F8',
  },

  // Transparency helpers
  alpha: {
    black10: 'rgba(0, 0, 0, 0.1)',
    black30: 'rgba(0, 0, 0, 0.3)',
    black75: 'rgba(0, 0, 0, 0.75)',
    black90: 'rgba(0, 0, 0, 0.9)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white30: 'rgba(255, 255, 255, 0.3)',
    white90: 'rgba(255, 255, 255, 0.9)',
  },

  // ===== SPACING (2px grid) =====
  spacing: {
    0: '0',
    xxxs: '2px',
    xxs: '4px',
    xs: '6px',
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '16px',
    xxl: '20px',
    xxxl: '24px',
    xxxxl: '32px',
  },

  // ===== TYPOGRAPHY =====
  fontSize: {
    xxs: '7px',
    xs: '9px',
    sm: '10px',
    base: '12px',  // DS Coverage base size
    md: '13px',
    lg: '14px',
    xl: '16px',
    xxl: '18px',
    xxxl: '20px',  // DS Coverage heading size
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  letterSpacing: {
    tight: '0.03em',
    normal: '0.05em',
    wide: '0.1em',
    label: '1.5px',      // DS Coverage label spacing
    heading: '2px',      // DS Coverage heading spacing
  },

  lineHeight: {
    tight: 1.5,
    normal: 1.6,
    relaxed: 1.65,
  },

  fontFamily: {
    mono: `'IBM Plex Mono', 'JetBrains Mono', 'Monaco', 'Courier New', monospace`,
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '3px',
    lg: '4px',
    full: '50%',
  },

  // ===== SIZING =====
  size: {
    // Icon sizes
    icon: {
      xs: '10px',
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
      xxxl: '28px',
    },
    // Button heights
    button: {
      sm: '32px',
      md: '40px',  // DS Coverage CTA height
      lg: '48px',
      xl: '52px',
      xxl: '56px',
    },
    // Input/Checkbox sizes
    input: {
      checkbox: '14px',
      field: '24px',  // DS Coverage input height
      toggle: {
        width: '32px',
        height: '24px',
      },
    },
  },

  // ===== Z-INDEX =====
  zIndex: {
    modal: 9999,
    tooltip: 10000,
  },

  // ===== TRANSITIONS =====
  transition: {
    fast: 'all 0.15s',
    fastEase: 'all 0.15s ease',
  },
} as const;
