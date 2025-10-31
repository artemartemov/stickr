/**
 * Input Component - Matches DS Coverage number input field styles
 */

import { h } from 'preact';
import { useState } from 'preact/hooks';

export interface InputProps {
  /** Input ID */
  id?: string;
  /** Input label/key (e.g. "W", "H", "LR", "TB") */
  label?: string;
  /** Input type */
  type?: 'text' | 'number';
  /** Input value */
  value?: string | number;
  /** Placeholder text */
  placeholder?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Title text for tooltip */
  title?: string;
  /** Width variant */
  width?: 'sm' | 'md' | 'full';
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
}

export const Input = ({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  alt,
  title,
  width = 'md',
  onChange,
  disabled = false,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange?.(target.value);
  };

  const getOutlineColor = () => {
    if (isFocused) return '#4697F8';  // --border-focus
    if (isHovered) return '#E9E9E9';  // --color-gray150
    return 'transparent';
  };

  const getOutlineWidth = () => {
    if (isFocused) return '2px';
    if (isHovered) return '1px';
    return '1px';
  };

  const inputWidth = width === 'sm' ? '36px' : width === 'md' ? '40px' : '100%';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px',  // --spacing-sm
        borderRadius: '2px',  // --border-radius-sm
        outlineColor: getOutlineColor(),
        outlineStyle: 'solid',
        outlineWidth: getOutlineWidth(),
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      {label && (
        <span
          style={{
            color: '#BDBDBD',  // --text-secondary
            marginRight: '6px',  // --spacing-xs
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            userSelect: 'none',
          }}
        >
          {label}
        </span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        alt={alt}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: inputWidth,
          height: '24px',  // --input-height
          border: 'none',
          outline: 'none',
          borderRadius: '2px',  // --border-radius-sm
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          color: 'var(--text-primary)',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};