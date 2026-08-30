'use client';

import { useState } from 'react';
import { useSolidNav } from '@/lib/hooks';
import { css } from '@/lib/css';

const NAV_LINKS = [
  { href: '#countdown', label: 'Countdown' },
  { href: '#story', label: 'Our story' },
  { href: '#details', label: 'Details' },
  { href: '#travel', label: 'Getting there' },
  { href: '#invitation', label: 'Invitation' }
];

export default function Header() {
  const solid = useSolidNav();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header
        data-nav
        {...(solid ? { 'data-solid': '' } : {})}
        style={css(
          'position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:16px;transition:background .5s ease,padding .5s ease,box-shadow .5s ease,backdrop-filter .5s ease'
        )}
      >
        <a href="#top" style={css('display:flex;flex-direction:column;gap:3px;color:inherit')}>
          <span style={css("font:400 20px/1 'Cormorant Garamond',serif;letter-spacing:.05em")}>A &amp; A</span>
          <span
            style={css(
              "font:400 8.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;opacity:.7"
            )}
          >
            21 . 11 . 26
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
      </div>
    </>
  );
}
