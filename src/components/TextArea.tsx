/**
 * TextArea Component - Matches DS Coverage textarea styles
 */

import { h } from 'preact';
import { useState } from 'preact/hooks';

export interface TextAreaProps {
  /** TextArea ID */
  id?: string;
  /** TextArea value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Number of rows */
  rows?: number;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
}

export const TextArea = ({
  id,
  value,
  placeholder,
  rows = 5,
  onChange,
  disabled = false,
}: TextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    onChange?.(target.value);
  };

  return (
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        width: '100%',
        height: '80px',  // DS Coverage graphData textarea
        padding: '11px 16px',
        border: 'none',
        borderColor: 'transparent',
        borderRadius: '6px',  // --border-radius-xl
        outlineColor: isFocused ? '#4697F8' : '#f5f5f5',  // --border-focus : --color-gray100
        outlineStyle: 'solid',
        outlineWidth: isFocused ? '2px' : '1px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '12px',
        lineHeight: '19px',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--bg-primary)',
        resize: 'vertical',
        transition: 'all 0.15s ease',
      }}
    />
  );
};