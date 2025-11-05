import { h, ComponentChildren } from 'preact';

// Define our own StyleProps to avoid deprecated JSXInternal.CSSProperties
type StyleProps = {
  [key: string]: string | number | undefined;
};

type TextVariant =
  | 'body'
  | 'body-sm'
  | 'heading-section'
  | 'heading-subsection'
  | 'card-heading'
  | 'label'
  | 'value'
  | 'metric-large'
  | 'code';

interface TextProps {
  variant?: TextVariant;
  children: ComponentChildren;
  style?: StyleProps;
  as?: 'p' | 'span' | 'div' | 'label';
}

const variantStyles: Record<TextVariant, StyleProps> = {
  body: {
    fontSize: 'var(--type-body-fontSize)',
    lineHeight: 'var(--type-body-lineHeight)',
    color: 'var(--text-primary)',
  },
  'body-sm': {
    fontSize: 'var(--type-body-sm-fontSize)',
    lineHeight: 'var(--type-body-sm-lineHeight)',
    color: 'var(--text-primary)',
  },
  'heading-section': {
    fontSize: 'var(--type-heading-section-fontSize)',
    fontWeight: 'var(--type-heading-section-fontWeight)',
    letterSpacing: 'var(--type-heading-section-letterSpacing)',
    textTransform: 'var(--type-heading-section-textTransform)' as any,
    color: 'var(--text-primary)',
  },
  'heading-subsection': {
    fontSize: 'var(--type-heading-subsection-fontSize)',
    fontWeight: 'var(--type-heading-subsection-fontWeight)',
    color: 'var(--text-primary)',
  },
  'card-heading': {
    fontSize: 'var(--card-heading-fontSize)',
    fontWeight: 'var(--card-heading-fontWeight)',
    textTransform: 'var(--card-heading-textTransform)' as any,
    color: 'var(--text-primary)',
  },
  label: {
    fontSize: 'var(--section-label-fontSize)',
    fontWeight: 'var(--section-label-fontWeight)',
    letterSpacing: 'var(--section-label-letterSpacing)',
    textTransform: 'var(--section-label-textTransform)' as any,
    color: 'var(--text-secondary)',
  },
  value: {
    fontSize: 'var(--section-value-fontSize)',
    fontWeight: 'var(--section-value-fontWeight)',
    color: 'var(--text-tertiary)',
    fontFeatureSettings: 'var(--section-value-fontFeatureSettings)' as any,
  },
  'metric-large': {
    fontSize: 'var(--metric-large-fontSize)',
    fontWeight: 'var(--metric-large-fontWeight)',
    color: 'var(--text-primary)',
    fontFeatureSettings: 'var(--metric-large-fontFeatureSettings)' as any,
  },
  code: {
    fontFamily: 'var(--type-code-fontFamily)',
    fontSize: 'var(--type-code-fontSize)',
    color: 'var(--text-secondary)',
  },
};

export function Text({ variant = 'body', children, style, as = 'span' }: TextProps) {
  const Component = as;
  const combinedStyle = {
    ...variantStyles[variant],
    ...style,
  };

  return <Component style={combinedStyle}>{children}</Component>;
}
