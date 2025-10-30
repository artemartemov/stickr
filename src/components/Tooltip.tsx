import { h, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

type StyleProps = {
  [key: string]: string | number | undefined;
};

interface TooltipProps {
  content: string;
  children: ComponentChildren;
  position?: 'left' | 'right' | 'top' | 'bottom';
  disabled?: boolean;
  disabledContent?: string;
  fullWidth?: boolean;
}

export function Tooltip({ content, children, position = 'left', disabled = false, disabledContent, fullWidth = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const displayContent = disabled && disabledContent ? disabledContent : content;
  const shouldShowTooltip = disabled ? !!disabledContent : !!content;

  const getPositionStyles = (): StyleProps => {
    const baseStyles: StyleProps = {
      position: 'absolute',
      background: 'var(--tooltip-bg)',
      color: 'var(--tooltip-text)',
      padding: '6px 8px',
      borderRadius: 'var(--border-radius-lg)',
      fontSize: 'var(--font-size-sm)',
      whiteSpace: 'nowrap',
      zIndex: 'var(--z-tooltip)',
      pointerEvents: 'none',
    };

    switch (position) {
      case 'left':
        return {
          ...baseStyles,
          right: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          ...baseStyles,
          left: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'top':
        return {
          ...baseStyles,
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: fullWidth ? 'flex' : 'inline-block',
        flex: fullWidth ? '1' : undefined,
        width: fullWidth ? '100%' : undefined,
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && shouldShowTooltip && (
        <div style={getPositionStyles()}>
          {displayContent}
        </div>
      )}
    </div>
  );
}
