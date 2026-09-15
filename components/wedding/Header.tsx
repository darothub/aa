'use client';

import { useEffect, useRef, useState } from 'react';
import { useSolidNav } from '@/lib/hooks';
import { css } from '@/lib/css';
import { HASHTAG, LOGO, WEDDING_DATE } from '@/content/wedding';

const NAV_LINKS = [
  { href: '#countdown', label: 'Countdown' },
  { href: '#story', label: 'Our story' },
  { href: '#details', label: 'Details' },
  { href: '#travel', label: 'Getting there' },
  { href: '#invitation', label: 'Invitation' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/upload', label: 'Add photos' }
];

export default function Header() {
  const solid = useSolidNav();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const headerRef = useRef<HTMLElement>(null);

  // The header's own height changes as it switches between its transparent
  // (taller) and solid (shorter) states. Every anchor-linked section sets its
  // scroll-margin-top from this measured value, so an in-page nav click lands
  // exactly under the fixed header instead of leaving a gap that reveals the
  // tail of the section above, or hiding the target under the header.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setVar = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <header
        data-nav
        ref={headerRef}
        {...(solid ? { 'data-solid': '' } : {})}
        style={css(
          'position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:16px;transition:background .5s ease,padding .5s ease,box-shadow .5s ease,backdrop-filter .5s ease'
        )}
      >
        <a href="#top" style={css('display:flex;align-items:center;gap:10px;color:inherit')}>
          {/* The logo artwork carries its own near-black background baked in,
              which clashes with the header's own background as it transitions
              between transparent-over-photo and solid cream on scroll. Giving
              it a fixed near-black badge of its own — rather than letting the
              image sit directly on the header — makes that background a
              deliberate part of the mark instead of a seam that shifts under it. */}
          <span
            style={css(
              'display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;background:#1f1c18;overflow:hidden;flex-shrink:0'
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO.src}
              alt="Aisha and Abdul"
              style={css('width:100%;height:100%;object-fit:contain')}
            />
          </span>
          <span
            style={css(
              "font:400 8.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;opacity:.7"
            )}
          >
            {WEDDING_DATE.shortLabel}
          </span>
        </a>

        <nav data-desk style={css('align-items:center;gap:clamp(18px,2.4vw,34px)')}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={css(
                "font:400 11px/1 'Jost',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:inherit;opacity:.82;transition:opacity .3s ease"
              )}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#rsvp"
            data-cta
            style={css(
              "padding:12px 22px;font:500 11px/1 'Jost',sans-serif;letter-spacing:.2em;text-transform:uppercase;transition:background .4s ease,color .4s ease,border-color .4s ease"
            )}
          >
            RSVP
          </a>
        </nav>

        <button
          data-mob
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          style={css(
            'appearance:none;background:none;border:0;cursor:pointer;padding:10px;flex-direction:column;gap:6px;align-items:flex-end;color:inherit'
          )}
        >
          <span style={css('display:block;width:26px;height:1px;background:currentColor')} />
          <span style={css('display:block;width:18px;height:1px;background:currentColor')} />
        </button>
      </header>

      <div
        data-menu
        {...(open ? { 'data-open': '' } : {})}
        style={css(
          'position:fixed;inset:0;z-index:70;background:#1f1c18;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;overflow-y:auto'
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          style={css(
            "position:absolute;top:24px;right:22px;appearance:none;background:none;border:0;cursor:pointer;color:#faf7f1;font:300 30px/1 'Jost',sans-serif"
          )}
        >
          ×
        </button>
        {/* The drawer's own background (#1f1c18) is close enough to the
            artwork's near-black background that the seam is invisible without
            needing a blend mode. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO.src}
          alt="Aisha and Abdul — AlignedInLove"
          style={css('width:min(46vw,164px);height:auto;margin-bottom:4px')}
        />
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={close}
            style={css("font:300 30px/1 'Cormorant Garamond',serif;color:#faf7f1")}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#rsvp"
          onClick={close}
          style={css(
            "margin-top:14px;padding:16px 34px;border:1px solid rgba(250,247,241,.4);font:500 11px/1 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#faf7f1"
          )}
        >
          RSVP
        </a>
        <span
          style={css(
            "margin-top:6px;font:400 11px/1 'Jost',sans-serif;letter-spacing:.22em;color:rgba(250,247,241,.45)"
          )}
        >
          {HASHTAG.tag}
        </span>
      </div>
    </>
  );
}
