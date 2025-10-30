import { h, ComponentChildren } from 'preact';

// Use our custom StyleProps to avoid deprecation warnings
type StyleProps = {
  [key: string]: string | number | undefined;
};

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'default' | 'circular';

interface IconButtonProps {
  children: ComponentChildren;
  onClick?: (e: MouseEvent) => void;
  title?: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  disabled?: boolean;
  style?: StyleProps;
}

export function IconButton({
  children,
  onClick,
  title,
  size = 'md',
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  const sizeStyles: Record<IconButtonSize, StyleProps> = {
    sm: {
      width: 'var(--icon-size-xl)',
      height: 'var(--icon-size-xl)',
    },
    md: {
      width: 'var(--icon-size-xxl)',
      height: 'var(--icon-size-xxl)',
    },
    lg: {
      width: 'var(--icon-size-xxxl)',
      height: 'var(--icon-size-xxxl)',
    },
  };

  const variantStyles: Record<IconButtonVariant, StyleProps> = {
    default: {
      borderRadius: 'var(--border-radius-sm)',
      border: 'none',
    },
    circular: {
      borderRadius: 'var(--border-radius-full)',
      border: '1px solid var(--border-default)',
      fontSize: 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)',
    },
  };

  const baseStyles: StyleProps = {
    padding: '0',
    background: disabled ? 'var(--button-disabled-bg)' : 'transparent',
    color: disabled
      ? 'var(--button-disabled-text)'
      : variant === 'circular'
        ? 'var(--text-secondary)'
        : 'var(--text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-fast-ease)',
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  const handleMouseEnter = (e: MouseEvent) => {
    if (disabled) return;
    const target = e.currentTarget as HTMLButtonElement;

    if (variant === 'circular') {
      target.style.background = 'var(--bg-hover)';
      target.style.borderColor = 'var(--text-tertiary)';
    } else {
      target.style.background = 'var(--bg-hover)';
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (disabled) return;
    const target = e.currentTarget as HTMLButtonElement;

    if (variant === 'circular') {
      target.style.background = 'transparent';
      target.style.borderColor = 'var(--border-default)';
    } else {
      target.style.background = 'transparent';
    }
  };

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
