import { h } from 'preact';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  activeValue,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      style={{
        background: 'var(--tab-containerBg)',
        padding: '0',
        borderRadius: 'var(--border-radius-lg)',
        marginTop: 'var(--spacing-xxxxl)',
        display: 'flex',
        gap: '0',
        marginBottom: 'var(--spacing-xxxl)',
      }}
    >
      {options.map((option) => {
        const isActive = activeValue === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: isActive ? 'var(--tab-activeBg)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--border-radius-lg)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-normal)',
              letterSpacing: '0.4px',
              color: isActive ? 'var(--tab-activeText)' : 'var(--tab-inactiveText)',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'var(--transition-fast)',
              boxShadow: 'none',
              opacity: 1,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.opacity = '0.7';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
