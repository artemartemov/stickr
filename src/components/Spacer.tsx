/**
 * Spacer Component - Matches DS Coverage .block spacing utilities
 * Creates vertical spacing between elements
 */

import { h } from 'preact';

export interface SpacerProps {
  /** Height of the spacer */
  size: 2 | 4 | 8 | 16 | 24;
}

export const Spacer = ({ size }: SpacerProps) => {
  return (
    <div
      style={{
        width: '80%',
        height: `${size}px`,
        margin: 0,
        padding: 0,
      }}
    />
  );
};
