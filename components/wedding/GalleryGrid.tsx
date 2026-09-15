'use client';

import { useEffect, useState } from 'react';
import { css } from '@/lib/css';
import { GALLERY } from '@/content/wedding';

type Photo = {
  id: number;
  url: string;
  uploaderName: string;
  caption: string | null;
  createdAt: string;
};

// Polls rather than opening a socket: the guest list and traffic here are
// small enough that a 15s refetch reads as "live" without needing a
// realtime channel this project has nowhere else to host.
const POLL_MS = 15000;

export default function GalleryGrid({
  refreshSignal,
  onCountChange
}: {
  refreshSignal?: number;
  /** Reports the current total photo count up to the page, for a top-of-screen counter. */
  onCountChange?: (count: number) => void;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch('/api/photos')
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          const list: Photo[] = data.photos ?? [];
          setPhotos(list);
          onCountChange?.(list.length);
        })
        .catch(() => {
          if (!cancelled) setPhotos((prev) => prev);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // refreshSignal deliberately re-runs this effect on demand — e.g. right
    // after this visitor's own upload — instead of waiting up to POLL_MS.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, photos.length]);

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <div style={css('display:flex;flex-direction:column;gap:20px')}>
      {!loading && photos.length === 0 && (
        <p style={css("margin:0;font:300 15px/1.7 'Jost',sans-serif;color:rgba(31,28,24,.5)")}>
          {GALLERY.emptyState}
        </p>
      )}

      {photos.length > 0 && (
        <div
          style={css(
            'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px'
          )}
        >
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={photo.caption || `Photo from ${photo.uploaderName}`}
              style={css(
                'appearance:none;cursor:pointer;padding:0;border:0;background:#e8e1d6;aspect-ratio:1/1;overflow:hidden;border-radius:2px'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || `Photo from ${photo.uploaderName}`}
                loading="lazy"
                style={css('width:100%;height:100%;object-fit:cover;display:block')}
              />
            </button>
          ))}
        </div>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          style={css(
            'position:fixed;inset:0;z-index:80;background:rgba(20,17,14,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:clamp(16px,4vw,40px)'
          )}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
            style={css(
              "position:absolute;top:20px;right:20px;appearance:none;background:none;border:0;cursor:pointer;color:#faf7f1;font:300 30px/1 'Jost',sans-serif"
            )}
          >
            ×
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.caption || `Photo from ${current.uploaderName}`}
            style={css('max-width:min(90vw,900px);max-height:72vh;object-fit:contain;display:block')}
          />

          <div style={css('display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center')}>
            {current.caption && (
              <p style={css("margin:0;max-width:60ch;font:300 15px/1.6 'Jost',sans-serif;color:#faf7f1")}>
                {current.caption}
              </p>
            )}
            <span
              style={css(
                "font:500 10px/1 'Jost',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(250,247,241,.6)"
              )}
            >
              {current.uploaderName} · {String(openIndex! + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
          </div>

          <div style={css('display:flex;align-items:center;gap:16px')}>
            <button
              type="button"
              onClick={() => setOpenIndex((openIndex! - 1 + photos.length) % photos.length)}
              aria-label="Previous photo"
              style={css(
                "appearance:none;cursor:pointer;width:46px;height:46px;border:1px solid rgba(250,247,241,.4);background:none;color:#faf7f1;font:300 17px/1 'Jost',sans-serif;border-radius:50%"
              )}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setOpenIndex((openIndex! + 1) % photos.length)}
              aria-label="Next photo"
              style={css(
                "appearance:none;cursor:pointer;width:46px;height:46px;border:1px solid rgba(250,247,241,.4);background:none;color:#faf7f1;font:300 17px/1 'Jost',sans-serif;border-radius:50%"
              )}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
