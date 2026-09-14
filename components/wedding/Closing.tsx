'use client';

import { useEffect, useRef } from 'react';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';
import DonationLinks from './DonationLinks';
import styles from './Closing.module.css';
import { COUPLE, HASHTAG, HAS_DONATION_LINK, LOGO, VENUE, WEDDING_DATE } from '@/content/wedding';

export default function Closing() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = window.innerWidth < 700 || (navigator.hardwareConcurrency ?? 8) <= 4;
    if (reduced || lite) return;
    let raf = 0;
    const apply = () => {
      const wrap = wrapRef.current;
      const img = imgRef.current;
      if (!wrap || !img) return;
      const r = wrap.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const y = Math.max(-6, Math.min((window.innerHeight - r.top) * 0.05 - 18, 46));
        img.style.transform = `translate3d(0, ${y}px, 0)`;
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={wrapRef}
      style={css('position:relative;min-height:82svh;display:flex;align-items:flex-end;overflow:hidden')}
    >
      {/* The section background stays near-black (#1f1c18) as a fallback behind
          the image while it loads — the image itself now covers the section
          edge-to-edge, so this no longer shows through once painted. */}
      <div style={css('position:absolute;inset:0;background:#1f1c18')} />
      <div
        ref={imgRef}
        style={css('position:absolute;top:0;left:0;right:0;height:112%;will-change:transform;opacity:.5')}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO.src}
          alt={LOGO.alt}
          style={css('width:100%;height:100%;object-fit:cover;object-position:50% 50%;display:block')}
        />
      </div>
      <div
        style={css(
          'position:absolute;inset:0;background:linear-gradient(to bottom,rgba(24,21,17,.55) 0%,rgba(24,21,17,.65) 55%,rgba(24,21,17,.92) 100%);pointer-events:none'
        )}
      />
      <div
        style={css(
          'position:relative;width:100%;padding:clamp(60px,12vh,120px) clamp(20px,5vw,72px) clamp(34px,6vh,58px);display:flex;flex-direction:column;gap:clamp(26px,4vw,40px)'
        )}
      >
        <div className={styles.content}>
          <Reveal
            as="h2"
            style={css(
              "margin:0;max-width:22ch;font:300 clamp(34px,7vw,86px)/1.05 'Cormorant Garamond',serif;color:#faf7f1;letter-spacing:-.015em;text-wrap:balance"
            )}
          >
            We can&apos;t wait to celebrate with you.
          </Reveal>
          <Reveal
              style={css(
                  'display:flex;flex-direction:column;gap:16px;padding:clamp(28px,4vw,44px);border:1px solid rgba(154,111,76,.4);background:rgba(154,111,76,.08);min-width:0'
              )}
          >
          <span style={css("font:500 10px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#9a6f4c")}>
            Gifts
          </span>
            <p style={css("margin:0;font:300 17px/1.7 'Jost',sans-serif;color:rgba(250,247,241,.62);max-width:52ch")}>
              Your presence is the gift.
              {HAS_DONATION_LINK
                  ? " If you'd still like to give something, you're welcome to below."
                  : ' If you insist, the registry link is in your invitation email.'}
            </p>
            {HAS_DONATION_LINK && (
                <Reveal style={css('display:flex;flex-direction:column;gap:12px;align-items:flex-start')}>
              <span style={css("font:400 10px/1.8 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.62)")}>
                Support us
              </span>
                  <DonationLinks dark />
                </Reveal>
            )}
          </Reveal>

        </div>
        <div
          style={css(
            'display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(250,247,241,.2);padding-top:22px'
          )}
        >
          <span style={css("font:400 10px/1.8 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.62)")}>
            {COUPLE.partner1} &amp; {COUPLE.partner2} · {WEDDING_DATE.shortLabel} · {VENUE.city} ·{' '}
            {/* The strip is uppercase by design; the tag opts out so its word
                breaks survive — #ALIGNEDINLOVE reads as one long word. */}
            <span style={css('text-transform:none;letter-spacing:.2em;color:#c39a72')}>{HASHTAG.tag}</span>
          </span>
          <a href="#top" style={css("font:400 10px/1 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;color:rgba(250,247,241,.62)")}>
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
