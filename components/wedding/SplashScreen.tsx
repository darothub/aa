'use client';

import { useEffect } from 'react';
import { css } from '@/lib/css';
import { useCountdown, useFirstVisitSplash } from '@/lib/hooks';
import { LOGO, WEDDING_DATE } from '@/content/wedding';

function two(n: number) {
  return String(n).padStart(2, '0');
}

/** First-visit-only intro overlay: logo + countdown, gone for good once seen (see useFirstVisitSplash). */
export default function SplashScreen() {
  const { visible, closing } = useFirstVisitSplash();
  const c = useCountdown(WEDDING_DATE.iso);

  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        ...css(
          'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;background:#1f1c18;transition:opacity .5s ease,transform .5s ease'
        ),
        opacity: closing ? 0 : 1,
        transform: closing ? 'scale(1.03)' : 'scale(1)'
      }}
    >
      <span
        dir="rtl"
        lang="ar"
        style={css(
          "position:absolute;top:clamp(20px,5vh,48px);left:50%;transform:translateX(-50%);font:400 clamp(16px,4vw,22px)/1.4 'Amiri','Traditional Arabic',serif;color:#faf7f1;text-align:center;white-space:nowrap"
        )}
      >
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </span>

      <div style={css('width:96px;height:96px;border-radius:14px;overflow:hidden;background:#1f1c18')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO.src} alt={LOGO.alt} style={css('width:100%;height:100%;object-fit:contain')} />
      </div>

      {!c.past && (
        <div style={css('display:flex;gap:clamp(6px,3vw,20px)')}>
          {[
            { label: 'Days', value: String(c.days) },
            { label: 'Hours', value: two(c.hours) },
            { label: 'Min', value: two(c.minutes) },
            { label: 'Sec', value: two(c.seconds) }
          ].map((unit) => (
            <div key={unit.label} style={css('display:flex;flex-direction:column;align-items:center;gap:6px')}>
              <span
                style={{
                  ...css("font:300 clamp(28px,7vw,44px)/1 'Cormorant Garamond',serif;font-variant-numeric:tabular-nums"),
                  color: '#faf7f1'
                }}
              >
                {unit.value}
              </span>
              <span
                style={css(
                  "font:500 8px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.5)"
                )}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
