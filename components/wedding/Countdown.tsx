'use client';

import { css } from '@/lib/css';
import { countdownMessage, useCountdown } from '@/lib/hooks';
import { WEDDING_DATE } from '@/content/wedding';

// Position, size, colour, animation and delay copied verbatim from the original
// falling-petal decoration so the countdown section reads identically.
const PETALS: Array<{ left: string; size: number; color: string; anim: string; duration: string; delay: string }> = [
  { left: '4%', size: 9, color: '#c39a72', anim: 'wsFall1', duration: '11s', delay: '0s' },
  { left: '11%', size: 13, color: '#e0c3a3', anim: 'wsFall2', duration: '15s', delay: '3.4s' },
  { left: '18%', size: 7, color: '#f0e3d3', anim: 'wsFall3', duration: '9.5s', delay: '1.2s' },
  { left: '25%', size: 11, color: '#9a6f4c', anim: 'wsFall1', duration: '13s', delay: '5.6s' },
  { left: '32%', size: 8, color: '#c39a72', anim: 'wsFall2', duration: '10.5s', delay: '2.3s' },
  { left: '39%', size: 14, color: '#e0c3a3', anim: 'wsFall4', duration: '16s', delay: '7.1s' },
  { left: '46%', size: 6, color: '#f0e3d3', anim: 'wsFall1', duration: '8.5s', delay: '4.2s' },
  { left: '53%', size: 10, color: '#c39a72', anim: 'wsFall2', duration: '12s', delay: '0.6s' },
  { left: '60%', size: 12, color: '#9a6f4c', anim: 'wsFall1', duration: '14.5s', delay: '6.3s' },
  { left: '67%', size: 7, color: '#e0c3a3', anim: 'wsFall2', duration: '9s', delay: '2.9s' },
  { left: '74%', size: 9, color: '#c39a72', anim: 'wsFall1', duration: '11.5s', delay: '8.2s' },
  { left: '81%', size: 13, color: '#f0e3d3', anim: 'wsFall4', duration: '15.5s', delay: '1.9s' },
  { left: '88%', size: 8, color: '#e0c3a3', anim: 'wsFall2', duration: '10s', delay: '5.1s' },
  { left: '94%', size: 11, color: '#c39a72', anim: 'wsFall3', duration: '13.5s', delay: '3.7s' },
  { left: '7%', size: 6, color: '#9a6f4c', anim: 'wsFall3', duration: '17s', delay: '9.4s' },
  { left: '36%', size: 7, color: '#e0c3a3', anim: 'wsFall4', duration: '18s', delay: '11.2s' },
  { left: '64%', size: 6, color: '#c39a72', anim: 'wsFall3', duration: '16.5s', delay: '10.1s' },
  { left: '86%', size: 7, color: '#f0e3d3', anim: 'wsFall4', duration: '19s', delay: '12.6s' }
];

function two(n: number) {
  return String(n).padStart(2, '0');
}

export default function Countdown() {
  // null until the first client-side tick fires (see useCountdown) — before
  // that, both server and client render the same "counting down" label with
  // no digits and no message, so there's nothing for hydration to disagree on.
  const c = useCountdown(WEDDING_DATE.iso);
  const { message, subMessage } = c ? countdownMessage(c) : { message: ' ', subMessage: ' ' };

  return (
    <section
      id="countdown"
      style={css(
        'scroll-margin-top:104px;position:relative;overflow:hidden;background:#1f1c18;padding:clamp(70px,11vw,130px) clamp(20px,5vw,72px)'
      )}
    >
      <div aria-hidden="true" style={css('position:absolute;inset:0;pointer-events:none;overflow:hidden')}>
        {PETALS.map((p, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: 0,
              borderRadius: '62% 38% 55% 45% / 55% 58% 42% 45%',
              animation: `${p.anim} ${p.duration} linear ${p.delay} infinite`
            }}
          />
        ))}
      </div>

      <div
        style={css(
          'position:relative;max-width:1160px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:clamp(26px,4vw,44px);text-align:center'
        )}
      >
        <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#c39a72")}>
          Counting down
        </p>

        {c && !c.past && (
          <div style={css('display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(4px,2.5vw,20px)')}>
            {[
              { label: 'Days', value: String(c.days), color: '#faf7f1' },
              { label: 'Hours', value: two(c.hours), color: '#faf7f1' },
              { label: 'Minutes', value: two(c.minutes), color: '#faf7f1' },
              { label: 'Seconds', value: two(c.seconds), color: '#c39a72' }
            ].map((unit, i, arr) => (
              <div key={unit.label} style={css('display:flex;align-items:center')}>
                <div
                  style={css(
                    'display:flex;flex-direction:column;align-items:center;gap:10px;min-width:clamp(70px,20vw,150px)'
                  )}
                >
                  <span
                    style={{
                      ...css("font:300 clamp(46px,13vw,120px)/1 'Cormorant Garamond',serif;font-variant-numeric:tabular-nums"),
                      color: unit.color
                    }}
                  >
                    {unit.value}
                  </span>
                  <span
                    style={css(
                      "font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.5)"
                    )}
                  >
                    {unit.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={css(
                      "align-self:center;font:300 clamp(30px,8vw,72px)/1 'Cormorant Garamond',serif;color:rgba(195,154,114,.5)"
                    )}
                  >
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p
          style={css(
            "margin:0;max-width:26ch;font:italic 300 clamp(22px,3.6vw,40px)/1.35 'Cormorant Garamond',serif;color:#faf7f1;text-wrap:pretty"
          )}
        >
          {message}
        </p>
        <p
          style={css(
            "margin:0;max-width:44ch;font:300 clamp(13px,1.5vw,15px)/1.8 'Jost',sans-serif;color:rgba(250,247,241,.52)"
          )}
        >
          {subMessage}
        </p>
      </div>
    </section>
  );
}
