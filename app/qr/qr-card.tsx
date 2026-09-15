'use client';

import { css } from '@/lib/css';
import GalleryQrCode from '@/components/wedding/GalleryQrCode';
import { COUPLE, HASHTAG } from '@/content/wedding';

/**
 * Laid out to be printed, not browsed: everything sits in one centred card,
 * and the surrounding chrome is left off so a browser's print dialog produces
 * something you can cut out and stand on a table.
 */
export default function QrCard({ guestPasscode }: { guestPasscode: string | null }) {
  return (
    <div
      style={css(
        'min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:#faf7f1'
      )}
    >
      <div
        style={css(
          'display:flex;flex-direction:column;align-items:center;gap:26px;padding:clamp(34px,6vw,56px);border:1px solid rgba(31,28,24,.18);background:#faf7f1;text-align:center;max-width:460px;width:100%'
        )}
      >
        <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#c39a72")}>
          {COUPLE.partner1} &amp; {COUPLE.partner2}
        </p>

        <h1 style={css("margin:0;font:300 clamp(28px,5vw,40px)/1.1 'Cormorant Garamond',serif;color:#1f1c18")}>
          Share your photos
        </h1>

        <GalleryQrCode size={320} label="Scan with your phone camera" />

        {guestPasscode && (
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(31,28,24,.5)")}>
              Your code
            </span>
            <span style={css("font:300 26px/1.2 'Cormorant Garamond',serif;color:#1f1c18;letter-spacing:.12em")}>
              {guestPasscode}
            </span>
          </div>
        )}

        <p style={css("margin:0;max-width:30ch;font:300 13px/1.7 'Jost',sans-serif;color:rgba(31,28,24,.55)")}>
          Photographs you add go straight to {COUPLE.partner1} and {COUPLE.partner2}.
        </p>

        <span style={css("font:500 11px/1 'Jost',sans-serif;letter-spacing:.16em;color:#9a6f4c")}>
          {HASHTAG.tag}
        </span>
      </div>
    </div>
  );
}
