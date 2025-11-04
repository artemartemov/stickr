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
    if (selected) return 'var(--button-tertiary-bgActive)';
    if (isHovered && !disabled) return 'var(--button-tertiary-bgHover)';
    return 'var(--button-tertiary-bg)';
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
        padding: '0 var(--spacing-sm)',
        fontSize: '10px',
        fontFamily: "'IBM Plex Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderRadius: '3px',
        border: 'none',
        background: getBackgroundColor(),
        color: disabled ? 'var(--text-secondary)' : 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.15s ease',
      }}
    >
      {children}
    </button>
  );
};
