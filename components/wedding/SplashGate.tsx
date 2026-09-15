'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { css } from '@/lib/css';
import { useCountdown } from '@/lib/hooks';
import { GATE, LOGO, WEDDING_DATE } from '@/content/wedding';

function two(n: number) {
  return String(n).padStart(2, '0');
}

/**
 * The splash screen, now also the way in. Same bismillah, monogram and
 * countdown the intro overlay always had, with a passcode field added — so the
 * first thing every visitor sees is the same screen, and guests are never shown
 * a door marked "not for you".
 *
 * Rendered by app/layout.tsx *instead of* the site whenever the request carries
 * no valid session. The page behind it is not hidden, it is never rendered, so
 * there is nothing in the DOM to re-enable and nothing in the HTML response to
 * read. Which passcode was used decides the role, and every private route
 * re-checks that server-side.
 */
export default function SplashGate() {
  const pathname = usePathname();
  const c = useCountdown(WEDDING_DATE.iso);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || GATE.error);
      }
      // A full navigation, not router.refresh(). Two reasons: arriving here by
      // the middleware's rewrite leaves the browser on the URL that was asked
      // for, but arriving at /welcome directly means refreshing just renders
      // the gate again — the code is accepted and the screen never changes.
      // And a hard load guarantees the middleware re-runs with the new cookie
      // instead of the router replaying a cached render of this page.
      window.location.assign(pathname === '/welcome' ? '/' : pathname);
    } catch (err) {
      setError(err instanceof Error ? err.message : GATE.error);
      setSubmitting(false);
    }
  };

  return (
    <div
      style={css(
        'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(20px,4vh,30px);padding:clamp(56px,12vh,96px) 24px 32px;background:#1f1c18;text-align:center;overflow-y:auto'
      )}
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

      <div style={css('width:88px;height:88px;border-radius:14px;overflow:hidden;background:#1f1c18;flex-shrink:0')}>
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
                  ...css("font:300 clamp(26px,6.5vw,40px)/1 'Cormorant Garamond',serif;font-variant-numeric:tabular-nums"),
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

      <p style={css("margin:0;max-width:32ch;font:300 clamp(13px,1.6vw,14.5px)/1.7 'Jost',sans-serif;color:rgba(250,247,241,.55)")}>
        {GATE.hint}
      </p>

      <form
        onSubmit={onSubmit}
        style={css('display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;max-width:290px')}
      >
        <input
          type="text"
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            setError('');
          }}
          placeholder={GATE.placeholder}
          aria-label={GATE.label}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          style={css(
            "appearance:none;width:100%;box-sizing:border-box;background:none;border:0;border-bottom:1px solid rgba(250,247,241,.3);padding:12px 0;text-align:center;font:300 20px/1.4 'Cormorant Garamond',serif;color:#faf7f1;letter-spacing:.14em"
          )}
        />
        {error && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#e0a08c")}>{error}</span>}
        <button
          type="submit"
          disabled={submitting}
          style={css(
            "appearance:none;cursor:pointer;border:1px solid rgba(250,247,241,.85);background:none;color:#faf7f1;padding:15px 36px;font:500 10.5px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase"
          )}
        >
          {submitting ? GATE.checking : GATE.submit}
        </button>
      </form>
    </div>
  );
}
