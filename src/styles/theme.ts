/**
 * THEME SYSTEM
 * Generates CSS variables from semantic tokens
 */

import { primitives } from './primitives';
import { lightMode, darkMode, typography, spacing, size, borderRadius, zIndex, transition } from './semantic';

// Helper to flatten nested objects into CSS variable format
function generateCSSVars(obj: any, prefix: string = ''): string {
  let css = '';

  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively handle nested objects
      css += generateCSSVars(value, varName);
    } else {
      // Convert to CSS variable
      css += `    --${varName}: ${value};\n`;
    }
  }

  return css;
}

export const themeStyles = `
  /* Normalize plugin spacing */
  * {
    box-sizing: border-box;
  }

  body, html {
    margin: 0 !important;
    padding: 0 !important;
  }

  #app {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Global font family */
  * {
    font-family: ${primitives.fontFamily.mono} !important;
  }

  :root {
    /* ===========================
       PRIMITIVE TOKENS
       ========================== */

    /* Colors */
${generateCSSVars(primitives.color, 'color')}
    /* Alpha values */
${generateCSSVars(primitives.alpha, 'alpha')}

    /* ===========================
       SEMANTIC TOKENS (shared)
       ========================== */

    /* Spacing */
${generateCSSVars(spacing, 'spacing')}

    /* Typography */
${generateCSSVars(typography.heading.section, 'type-heading-section')}
${generateCSSVars(typography.heading.subsection, 'type-heading-subsection')}
${generateCSSVars(typography.heading.card, 'card-heading')}
${generateCSSVars(typography.label, 'section-label')}
${generateCSSVars(typography.body, 'type-body')}
${generateCSSVars(typography.bodySm, 'type-body-sm')}
${generateCSSVars(typography.code, 'type-code')}
${generateCSSVars(typography.value, 'section-value')}
${generateCSSVars(typography.metricLarge, 'metric-large')}

    /* Font primitives */
    --font-size-xxs: ${primitives.fontSize.xxs};
    --font-size-xs: ${primitives.fontSize.xs};
    --font-size-sm: ${primitives.fontSize.sm};
    --font-size-base: ${primitives.fontSize.base};
    --font-size-md: ${primitives.fontSize.md};
    --font-size-lg: ${primitives.fontSize.lg};
    --font-size-xl: ${primitives.fontSize.xl};
    --font-size-xxl: ${primitives.fontSize.xxl};
    --font-size-xxxl: ${primitives.fontSize.xxxl};

    --font-weight-normal: ${primitives.fontWeight.normal};
    --font-weight-medium: ${primitives.fontWeight.medium};
    --font-weight-semibold: ${primitives.fontWeight.semibold};
    --font-weight-bold: ${primitives.fontWeight.bold};
    --font-weight-black: ${primitives.fontWeight.black};

    --letter-spacing-tight: ${primitives.letterSpacing.tight};
    --letter-spacing-normal: ${primitives.letterSpacing.normal};
    --letter-spacing-wide: ${primitives.letterSpacing.wide};
    --letter-spacing-label: ${primitives.letterSpacing.label};
    --letter-spacing-heading: ${primitives.letterSpacing.heading};

    --line-height-tight: ${primitives.lineHeight.tight};
    --line-height-normal: ${primitives.lineHeight.normal};
    --line-height-relaxed: ${primitives.lineHeight.relaxed};

    /* Border radius */
${generateCSSVars(borderRadius, 'border-radius')}

    /* Sizes */
${generateCSSVars(size.button, 'button-height')}
${generateCSSVars(size.icon, 'icon-size')}
    --checkbox-size: ${size.input.checkbox};
    --input-height: ${size.input.field};
    --toggle-width: ${size.input.toggle.width};
    --toggle-height: ${size.input.toggle.height};

    /* Z-index */
    --z-modal: ${zIndex.modal};
    --z-tooltip: ${zIndex.tooltip};

    /* Transitions */
    --transition-fast: ${transition.fast};
    --transition-fast-ease: ${transition.fastEase};

    /* Component-specific tokens */
    --button-height-md: ${size.button.md};
    --icon-size: ${size.icon.sm};
    --card-padding: ${spacing.xxl};
    --card-gap: ${spacing.xxxl};
    --card-border-radius: ${borderRadius.lg};
  }

  /* ===========================
     LIGHT MODE
     ========================== */
  @media (prefers-color-scheme: light) {
    :root {
      /* Text colors */
${generateCSSVars(lightMode.text, 'text')}

      /* Background colors */
${generateCSSVars(lightMode.bg, 'bg')}

      /* Border colors */
${generateCSSVars(lightMode.border, 'border')}

      /* Button colors */
${generateCSSVars(lightMode.button.primary, 'button')}
${generateCSSVars(lightMode.button.secondary, 'button-secondary')}
${generateCSSVars(lightMode.button.ghost, 'button-ghost')}
${generateCSSVars(lightMode.button.tertiary, 'button-tertiary')}
${generateCSSVars(lightMode.button.disabled, 'button-disabled')}

      /* Tab/Segmented control */
${generateCSSVars(lightMode.tab, 'tab')}

      /* Checkbox */
${generateCSSVars(lightMode.checkbox, 'checkbox')}

      /* Modal */
${generateCSSVars(lightMode.modal, 'modal')}

      /* Tooltip */
${generateCSSVars(lightMode.tooltip, 'tooltip')}

      /* Card */
      --card-bg: ${lightMode.card.bg};

      /* Progress */
${generateCSSVars(lightMode.progress, 'progress')}

      /* Legacy compatibility - keep Figma's native variables */
      --figma-color-text: ${lightMode.text.primary};
      --figma-color-text-secondary: ${lightMode.text.secondary};
      --figma-color-text-tertiary: ${lightMode.text.tertiary};
      --figma-color-text-onbrand: ${lightMode.text.onBrand};
      --figma-color-bg: ${lightMode.bg.primary};
      --figma-color-bg-secondary: ${lightMode.bg.secondary};
      --figma-color-bg-hover: ${lightMode.bg.hover};
      --figma-color-bg-inverse: ${lightMode.bg.inverse};
      --figma-color-border: ${lightMode.border.default};
    }
  }

  /* ===========================
     DARK MODE
     ========================== */
  @media (prefers-color-scheme: dark) {
    :root {
      /* Text colors */
${generateCSSVars(darkMode.text, 'text')}

      /* Background colors */
${generateCSSVars(darkMode.bg, 'bg')}

      /* Border colors */
${generateCSSVars(darkMode.border, 'border')}

      /* Button colors */
${generateCSSVars(darkMode.button.primary, 'button')}
${generateCSSVars(darkMode.button.secondary, 'button-secondary')}
${generateCSSVars(darkMode.button.ghost, 'button-ghost')}
${generateCSSVars(darkMode.button.tertiary, 'button-tertiary')}
${generateCSSVars(darkMode.button.disabled, 'button-disabled')}

      /* Tab/Segmented control */
${generateCSSVars(darkMode.tab, 'tab')}

      /* Checkbox */
${generateCSSVars(darkMode.checkbox, 'checkbox')}

      /* Modal */
${generateCSSVars(darkMode.modal, 'modal')}

      /* Tooltip */
${generateCSSVars(darkMode.tooltip, 'tooltip')}

      /* Card */
      --card-bg: ${darkMode.card.bg};

      /* Progress */
${generateCSSVars(darkMode.progress, 'progress')}

      /* Legacy compatibility - keep Figma's native variables */
      --figma-color-text: ${darkMode.text.primary};
      --figma-color-text-secondary: ${darkMode.text.secondary};
      --figma-color-text-tertiary: ${darkMode.text.tertiary};
      --figma-color-text-onbrand: ${darkMode.text.onBrand};
      --figma-color-bg: ${darkMode.bg.primary};
      --figma-color-bg-secondary: ${darkMode.bg.secondary};
      --figma-color-bg-hover: ${darkMode.bg.hover};
      --figma-color-bg-inverse: ${darkMode.bg.inverse};
      --figma-color-border: ${darkMode.border.default};
    }
  }

  /* Animations */
  @keyframes barGrow {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  @keyframes donutFill {
    from {
      stroke-dasharray: 0 1000;
    }
    to {
      stroke-dasharray: var(--stroke-length) 1000;
    }
  }
`;
