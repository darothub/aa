'use client';

import Link from 'next/link';
import { css } from '@/lib/css';
import Header from '@/components/wedding/Header';
import PhotoUpload from '@/components/wedding/PhotoUpload';
import { COUPLE, GALLERY } from '@/content/wedding';

/**
 * The page the gallery QR code points at. Deliberately just the form: a guest
 * scanning at the venue is standing up, on a phone, one-handed — the grid of
 * everyone else's photos lives at /gallery and is a link away rather than
 * something to scroll past before reaching the upload button.
 */
export default function UploadClient() {
  return (
    <div style={{ position: 'relative', width: '100%', background: '#faf7f1', minHeight: '100vh' }}>
      <Header />

      <main
        style={css(
          'max-width:620px;margin:0 auto;padding:clamp(120px,16vw,160px) clamp(20px,5vw,40px) clamp(76px,10vw,120px);display:flex;flex-direction:column;gap:clamp(32px,5vw,44px)'
        )}
      >
        <div style={css('display:flex;flex-direction:column;gap:16px')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#c39a72")}>
            {COUPLE.partner1} &amp; {COUPLE.partner2}
          </p>
          <h1 style={css("margin:0;font:300 clamp(36px,6.5vw,64px)/1.02 'Cormorant Garamond',serif;color:#1f1c18;letter-spacing:-.015em")}>
            {GALLERY.uploadHeading}
          </h1>
          <p style={css("margin:0;max-width:46ch;font:300 clamp(14.5px,1.6vw,16px)/1.8 'Jost',sans-serif;color:rgba(31,28,24,.6)")}>
            {GALLERY.uploadSubhead}
          </p>
        </div>

        <PhotoUpload />

        <Link
          href="/gallery"
          style={css(
            "align-self:flex-start;font:400 13px/1.6 'Jost',sans-serif;letter-spacing:.04em;color:#9a6f4c;text-decoration:underline;text-underline-offset:4px"
          )}
        >
          {GALLERY.viewGalleryLabel} →
        </Link>
      </main>
    </div>
  );
}
