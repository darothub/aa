'use client';

import { css } from '@/lib/css';
import { LOGO } from '@/content/wedding';

/**
 * The one loading indicator this project uses everywhere it needs one — the
 * monogram itself, slowly rotating, rather than a generic ring or bar. Kept
 * as a single component so every loading state in the app reaches for the
 * same mark instead of each screen inventing its own spinner.
 */
export default function LogoSpinner({ size = 28, label }: { size?: number; label?: string }) {
  return (
    <span
      role="status"
      aria-label={label || 'Loading'}
      style={css('display:inline-flex;align-items:center;gap:10px')}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO.src}
        alt=""
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          animation: 'logoSpinnerSpin 1.1s linear infinite'
        }}
      />
      {label && (
        <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:rgba(31,28,24,.55)")}>{label}</span>
      )}
      <style>{`
        @keyframes logoSpinnerSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}
