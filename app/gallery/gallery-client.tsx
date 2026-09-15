'use client';

import { useState } from 'react';
import { css } from '@/lib/css';
import Header from '@/components/wedding/Header';
import GalleryGrid from '@/components/wedding/GalleryGrid';
import GalleryQrCode from '@/components/wedding/GalleryQrCode';
import { useTimeReached } from '@/lib/hooks';
import { COUPLE, GALLERY } from '@/content/wedding';

// Lets the QR be forced on in a deployed environment before the day, for a
// smoke test, without shipping a build that shows it to guests. Read via the
// NEXT_PUBLIC_ prefix so it is inlined into the client bundle at build time.
const QR_FORCED = process.env.NEXT_PUBLIC_SHOW_GALLERY_QR === '1';

export default function GalleryClient() {
  const [count, setCount] = useState<number | null>(null);

  // Hidden in production until the morning of the wedding: before then there is
  // nothing to photograph, and a QR that works but leads nowhere useful just
  // invites stray uploads. Always on outside production so it stays workable.
  const dayReached = useTimeReached(GALLERY.qrLiveFrom);
  const showQr = process.env.NODE_ENV !== 'production' || QR_FORCED || dayReached;

  return (
    <div style={{ position: 'relative', width: '100%', background: '#faf7f1', minHeight: '100vh' }}>
      <Header />

      <main
        style={css(
          'max-width:900px;margin:0 auto;padding:clamp(120px,16vw,160px) clamp(20px,5vw,40px) clamp(76px,10vw,120px);display:flex;flex-direction:column;gap:clamp(40px,6vw,64px)'
        )}
      >
        <div style={css('display:flex;flex-direction:column;gap:16px')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#c39a72")}>
            {COUPLE.partner1} &amp; {COUPLE.partner2}
          </p>
          <h1 style={css("margin:0;font:300 clamp(36px,6.5vw,64px)/1.02 'Cormorant Garamond',serif;color:#1f1c18;letter-spacing:-.015em")}>
            {GALLERY.heading}
          </h1>
          <p style={css("margin:0;max-width:52ch;font:300 clamp(14.5px,1.6vw,16px)/1.8 'Jost',sans-serif;color:rgba(31,28,24,.6)")}>
            {GALLERY.subhead}
          </p>
          {count !== null && count > 0 && (
            <p style={css("margin:0;font:500 11px/1 'Jost',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#9a6f4c")}>
              {count} photo{count === 1 ? '' : 's'} uploaded so far
            </p>
          )}
        </div>

        {showQr && (
          <div
            style={css(
              'display:flex;justify-content:center;padding:clamp(20px,3vw,32px);border:1px solid rgba(31,28,24,.14)'
            )}
          >
            <GalleryQrCode />
          </div>
        )}

        <GalleryGrid onCountChange={setCount} />

        {GALLERY.googlePhotosAlbumUrl && (
          <a
            href={GALLERY.googlePhotosAlbumUrl}
            target="_blank"
            rel="noreferrer"
            style={css(
              "align-self:flex-start;font:400 13px/1.6 'Jost',sans-serif;letter-spacing:.04em;color:#9a6f4c;text-decoration:underline;text-underline-offset:4px"
            )}
          >
            {GALLERY.googlePhotosLabel} →
          </a>
        )}
      </main>
    </div>
  );
}
