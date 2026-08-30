'use client';

import { useEffect, useRef } from 'react';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';

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
      <div style={css('position:absolute;inset:0;background:#1f1c18')} />
      <div ref={imgRef} style={css('position:absolute;top:0;left:0;right:0;height:112%;will-change:transform;opacity:.92')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/closing-photo.jpg"
          alt="Aishat and Abdul"
          style={css('width:100%;height:100%;object-fit:cover;display:block')}
        />
      </div>
      <div
        style={css(
          'position:absolute;inset:0;background:linear-gradient(to bottom,rgba(24,21,17,.45) 0%,rgba(24,21,17,.6) 55%,rgba(24,21,17,.9) 100%);pointer-events:none'
        )}
      />
      <div
        style={css(
          'position:relative;width:100%;padding:clamp(60px,12vh,120px) clamp(20px,5vw,72px) clamp(34px,6vh,58px);display:flex;flex-direction:column;gap:clamp(26px,4vw,40px)'
        )}
      >
        <Reveal
          as="h2"
          style={css(
            "margin:0;max-width:22ch;font:300 clamp(34px,7vw,86px)/1.05 'Cormorant Garamond',serif;color:#faf7f1;letter-spacing:-.015em;text-wrap:balance"
          )}
        >
          We can&apos;t wait to celebrate with you.
        </Reveal>
        <div
          style={css(
            'display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(250,247,241,.2);padding-top:22px'
          )}
        >
          <span style={css("font:400 10px/1.8 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.62)")}>
            Aishat &amp; Abdul · 21 . 11 . 2026 · Abuja
          </span>
          <a href="#top" style={css("font:400 10px/1 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;color:rgba(250,247,241,.62)")}>
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
