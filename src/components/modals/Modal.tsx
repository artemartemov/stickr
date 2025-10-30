import { h, ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ComponentChildren;
  maxWidth?: 'sm' | 'lg';
  footer?: ComponentChildren;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'sm', footer }: ModalProps) {
  if (!isOpen) return null;

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-primary)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
        {title && (
          <div
            style={{
              fontSize: 'var(--font-size-xxl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-xl)',
              padding: 'var(--spacing-xxxl)',
              paddingBottom: '0',
              paddingRight: 'var(--spacing-xxxl)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing-normal)',
            }}
          >
            {title}
          </div>
        )}

        <div
          style={{
            fontSize: 'var(--font-size-base)',
            lineHeight: 'var(--line-height-normal)',
            padding: 'var(--spacing-xxxl)',
            paddingTop: title ? 'var(--spacing-xl)' : 'var(--spacing-xxxl)',
            overflowY: 'auto',
            flex: '1 1 auto',
          }}
        >
          {children}
        </div>

        {footer && (
          <div style={{
            borderTop: 'none',
            padding: '0',
            background: 'var(--bg-primary)',
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--spacing-xxl)',
            right: 'var(--spacing-xxl)',
            width: 'var(--icon-size-sm)',
            height: 'var(--icon-size-sm)',
            borderRadius: 'var(--border-radius-full)',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          ×
        </button>
    </div>
  );
}
