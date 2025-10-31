/**
 * Separator Component - Matches DS Coverage separator styles
 * Extends full width by using negative margins to break out of container padding
 */

import { h } from 'preact';

export interface SeparatorProps {
  /** Optional margin to break out of container (e.g. "-24px" to extend beyond 24px padding) */
  breakout?: string;
}

export const Separator = ({ breakout = '-24px' }: SeparatorProps) => {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: '#f5f5f5',  // --color-gray100
        width: '100vw',
        marginLeft: breakout,
      }}
    />
  );
};