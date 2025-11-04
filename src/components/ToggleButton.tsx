/**
 * ToggleButton Component - Matches DS Coverage .randomButton styles
 * Used for Row/Column selection toggles
 */

import { h } from 'preact';
import { useState } from 'preact/hooks';

export interface ToggleButtonProps {
  /** Button label */
  children: string;
  /** Whether button is in selected/active state */
  selected?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export const ToggleButton = ({
  children,
  selected = false,
  disabled = false,
  onClick,
}: ToggleButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBackgroundColor = () => {
    if (isHovered && !disabled) return 'var(--button-tertiary-bgHover)';
    return 'var(--button-tertiary-bg)';
  };

  const getTextColor = () => {
    if (disabled) return 'var(--text-secondary)';
    if (selected) return 'var(--text-primary)';
    return 'var(--text-secondary)';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minWidth: '50px',
        height: '24px',
        padding: '0 var(--spacing-xxs)',
        fontSize: '10px',
        fontFamily: "'IBM Plex Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderRadius: '3px',
        border: 'none',
        background: getBackgroundColor(),
        color: getTextColor(),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
      }}
    >
      {children}
    </button>
  );
};
