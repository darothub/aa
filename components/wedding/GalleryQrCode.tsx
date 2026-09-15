'use client';

import { useEffect, useRef } from 'react';
import { css } from '@/lib/css';

/**
 * Renders a QR code that opens `/upload` on a phone — the thing a guest
 * scans at the venue to jump straight to the upload form, without typing a
 * URL. It points at `/upload` rather than `/gallery` so a scan lands on the
 * form itself; the gallery is where the uploaded photos are read back.
 *
 * Follows the same dynamic-import + manual <img> pattern already used by
 * `InvitationTeaser.tsx` for the invitation QR, so the `qrcode` package
 * (already a dependency) stays a client-only cost.
 */
export default function GalleryQrCode({ label }: { label?: string }) {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const QRCode = (await import('qrcode')).default;
      const url = new URL('/upload', window.location.origin).href;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 132,
        margin: 1,
        color: { dark: '#1f1c18', light: '#faf7f1' }
      });
      if (cancelled || !qrRef.current) return;
      qrRef.current.innerHTML = '';
      const img = document.createElement('img');
      img.src = dataUrl;
      img.width = 132;
      img.height = 132;
      img.alt = 'QR code linking to the photo upload page';
      qrRef.current.appendChild(img);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={css('display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center')}>
      <div ref={qrRef} style={css('width:132px;height:132px;background:#faf7f1')} />
      <span style={css("font:400 12px/1.6 'Jost',sans-serif;color:rgba(31,28,24,.55);max-width:20ch")}>
        {label ?? 'Scan to upload your photos from your phone'}
      </span>
    </div>
  );
}
