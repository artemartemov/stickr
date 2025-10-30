// UI Configuration
export const UI_CONFIG = {
  HEIGHT: 840,
  WIDTH: 600
} as const

// Frame Spacing
export const SPACING = {
  LARGE: 32,
  MEDIUM: 24,
  NORMAL: 16,
  SMALL: 12,
  TINY: 8
} as const

// Font Definitions
export const FONTS = {
  SEMI_BOLD: { family: 'Inter', style: 'Semi Bold' },
  MEDIUM: { family: 'Inter', style: 'Medium' },
  REGULAR: { family: 'Inter', style: 'Regular' }
} as const

// Font Sizes
export const FONT_SIZES = {
  LARGE: 18,
  MEDIUM: 14,
  SMALL: 11,
  TINY: 10
} as const

// Colors
export const COLORS = {
  LIGHT_BG: { r: 0.98, g: 0.98, b: 0.98 },
  DARK_BG: { r: 0.18, g: 0.18, b: 0.18 },
  WHITE: { r: 1, g: 1, b: 1 },
  TEXT_DARK: { r: 0.2, g: 0.2, b: 0.2 },
  TEXT_MEDIUM_DARK: { r: 0.3, g: 0.3, b: 0.3 },
  TEXT_LIGHT: { r: 0.5, g: 0.5, b: 0.5 },
  TEXT_LIGHTER: { r: 0.6, g: 0.6, b: 0.6 },
  TEXT_LIGHTEST: { r: 0.8, g: 0.8, b: 0.8 }
} as const

// Theme Colors
export const THEME_COLORS = {
  light: {
    primary: COLORS.TEXT_DARK,
    secondary: COLORS.TEXT_MEDIUM_DARK,
    tertiary: COLORS.TEXT_LIGHT,
    bg: COLORS.WHITE,
    surface: COLORS.WHITE
  },
  dark: {
    primary: COLORS.WHITE,
    secondary: COLORS.TEXT_LIGHTEST,
    tertiary: COLORS.TEXT_LIGHTER,
    bg: COLORS.DARK_BG,
    surface: COLORS.DARK_BG
  }
} as const

// Border Radius
export const BORDER_RADIUS = {
  SMALL: 8
} as const

// Frame Dimensions
export const FRAME_DIMENSIONS = {
  ROW_LABEL_WIDTH: 100,
  ROW_LABEL_WIDTH_LARGE: 120,
  SPACER_HEIGHT: 1
} as const

// Timing
export const TIMING = {
  SELECTION_DELAY_MS: 50,
  PREVIEW_DELAY_MS: 100
} as const

// Export Scale
export const EXPORT_SCALE = {
  THUMBNAIL: 0.5
} as const
