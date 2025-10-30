import { h, ComponentChildren } from 'preact';

interface CheckboxProps {
  checked?: boolean;
  value?: boolean;
  onChange?: () => void;
  onValueChange?: (value: boolean) => void;
  onClick?: (e: any) => void;
  children?: ComponentChildren;
}

export function Checkbox({ checked, value, onChange, onValueChange, onClick, children }: CheckboxProps) {
  const isChecked = checked ?? value ?? false;
  const handleChange = () => {
    if (onChange) onChange();
    if (onValueChange) onValueChange(!isChecked);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(e);
          handleChange();
        }}
        style={{
          width: 'var(--checkbox-size)',
          height: 'var(--checkbox-size)',
          minWidth: 'var(--checkbox-size)',
          minHeight: 'var(--checkbox-size)',
          borderRadius: 'var(--border-radius-md)',
          background: isChecked ? 'var(--checkbox-checkedBg)' : 'var(--checkbox-uncheckedBg)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {isChecked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="var(--checkbox-checkmark)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}
