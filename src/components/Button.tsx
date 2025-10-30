import { h, ComponentChildren } from 'preact';

// Define our own StyleProps to avoid deprecated JSXInternal.CSSProperties
// This mirrors the structure but without the deprecation warning
type StyleProps = {
  [key: string]: string | number | undefined;
};

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ComponentChildren;
  onClick?: (e?: any) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  secondary?: boolean;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  style?: StyleProps;
}

export function Button({
  variant: variantProp,
  size = 'md',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  secondary = false,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  style,
}: ButtonProps) {
  // Support both 'variant' and 'secondary' props for backwards compatibility
  const variant = variantProp || (secondary ? 'secondary' : 'primary');

  const getHoverBackground = () => {
    if (disabled) return undefined;
    if (variant === 'primary') return 'var(--button-bgHover)';
    if (variant === 'secondary') return 'var(--button-secondary-bgHover)';
    if (variant === 'ghost') return 'var(--button-ghost-bgHover)';
    if (variant === 'tertiary') return 'var(--button-tertiary-bgHover)';
    return undefined;
  };

  const baseStyles: StyleProps = {
    border: 'none',
    borderRadius: 'var(--border-radius-none)',
    fontWeight: 'var(--font-weight-normal)',
    letterSpacing: 'var(--letter-spacing-heading)',  // 2px from DS Coverage for CTA buttons
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--transition-fast)',
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
  };

  const sizeStyles: Record<ButtonSize, StyleProps> = {
    sm: {
      height: 'var(--input-height)',  // 24px for tertiary buttons
      padding: '0 var(--spacing-xl)',
      fontSize: 'var(--font-size-base)',
    },
    md: {
      height: 'var(--button-height-md)',  // 40px from DS Coverage
      padding: '0 var(--spacing-xxl)',
      fontSize: 'var(--font-size-base)',
    },
    lg: {
      height: 'var(--button-height-lg)',
      padding: '0 var(--spacing-xxxl)',
      fontSize: 'var(--font-size-lg)',
    },
    xl: {
      height: 'var(--button-height-xl)',
      padding: '0 var(--spacing-xxxxl)',
      fontSize: 'var(--font-size-lg)',
    },
  };

  const variantStyles: Record<ButtonVariant, StyleProps> = {
    primary: {
      background: disabled ? 'var(--button-disabled-bg)' : 'var(--button-bg)',
      color: disabled ? 'var(--button-disabled-text)' : 'var(--button-text)',
    },
    secondary: {
      background: 'var(--button-secondary-bg)',
      border: `1px solid ${disabled ? 'var(--button-disabled-bg)' : 'var(--button-secondary-border)'}`,
      color: disabled ? 'var(--button-disabled-text)' : 'var(--button-secondary-text)',
    },
    ghost: {
      background: 'var(--button-ghost-bg)',
      color: disabled ? 'var(--button-disabled-text)' : 'var(--button-ghost-text)',
    },
    tertiary: {
      background: 'var(--button-tertiary-bg)',
      color: disabled ? 'var(--button-disabled-text)' : 'var(--button-tertiary-text)',
      borderRadius: 'var(--border-radius-md)',
      letterSpacing: '1px',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  const handleMouseEnter = (e: any) => {
    if (onMouseEnterProp) {
      onMouseEnterProp(e);
    }
    const target = e.currentTarget as HTMLButtonElement;
    const hoverBg = getHoverBackground();

    if (!disabled && hoverBg) {
      if (variant === 'ghost') {
        target.style.opacity = '0.7';
      } else {
        target.style.background = hoverBg;
      }
    }
  };

  const handleMouseLeave = (e: any) => {
    if (onMouseLeaveProp) {
      onMouseLeaveProp(e);
    }
    const target = e.currentTarget as HTMLButtonElement;

    if (!disabled) {
      if (variant === 'primary') {
        target.style.background = 'var(--button-bg)';
      } else if (variant === 'secondary') {
        target.style.background = 'var(--button-secondary-bg)';
      } else if (variant === 'tertiary') {
        target.style.background = 'var(--button-tertiary-bg)';
      } else if (variant === 'ghost') {
        target.style.opacity = '1';
      }
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
