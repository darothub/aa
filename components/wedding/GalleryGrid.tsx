'use client';

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
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

// Far enough that a tap, or the small drift of a finger pressing a button, is
// never read as a swipe.
const SWIPE_MIN_PX = 48;

/**
 * Which way a finger drag should move the carousel: 1 for next, -1 for previous,
 * 0 for "not a swipe". Dragging left pulls the next photo in from the right, so
 * the photos travel with the finger.
 *
 * A drag that is more vertical than horizontal is ignored rather than rounded to
 * the nearer axis — on a phone that gesture is someone trying to scroll or
 * dismiss, and turning it into a photo change feels like a misfire.
 */
export function swipeDirection(dx: number, dy: number, min = SWIPE_MIN_PX): -1 | 0 | 1 {
  if (Math.abs(dx) < min) return 0;
  if (Math.abs(dx) <= Math.abs(dy)) return 0;
  return dx < 0 ? 1 : -1;
}

export default function GalleryGrid({
  onCountChange
}: {
  /** Reports the current total photo count up to the page, for a top-of-screen counter. */
  onCountChange?: (count: number) => void;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  // The open photo is tracked by id, not by position. listPhotos orders newest
  // first, so every upload the 15s poll picks up shifts all existing indices
  // down by one — an index would silently start pointing at a different photo
  // while someone was looking at it, which is precisely what happens during a
  // reception when uploads are arriving.
  const [openId, setOpenId] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch('/api/gallery')
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
    // Mount-only: the poll above is what keeps this current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolved fresh on every render, so a reordered list moves the window rather
  // than changing what is inside it. -1 means the open photo is no longer in the
  // list at all, which closes the viewer rather than leaving it showing nothing.
  const openIndex = openId === null ? -1 : photos.findIndex((p) => p.id === openId);
  const current = openIndex === -1 ? null : photos[openIndex];

  const step = useCallback(
    (delta: number) => {
      if (openIndex === -1 || photos.length === 0) return;
      const next = photos[(openIndex + delta + photos.length) % photos.length];
      setOpenId(next.id);
    },
    [openIndex, photos]
  );

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dir = swipeDirection(t.clientX - start.x, t.clientY - start.y);
    if (dir !== 0) step(dir);
  };

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, step]);

  // Keeps the page from scrolling behind the overlay — the same treatment the
  // splash gives itself. Keyed on whether the viewer is open rather than on
  // `current`, which is a fresh object after every poll and would otherwise
  // unlock and relock the body every 15 seconds.
  const isOpen = current !== null;
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

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
              onClick={() => setOpenId(photo.id)}
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
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={css(
            // touch-action keeps the browser's own horizontal gestures (edge
            // swipe to go back, chief among them) from eating the swipe.
            'position:fixed;inset:0;z-index:80;background:rgba(20,17,14,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:clamp(16px,4vw,40px);touch-action:pan-y'
          )}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenId(null)}
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
              {current.uploaderName} · {String(openIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
          </div>

          <div style={css('display:flex;align-items:center;gap:16px')}>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              style={css(
                "appearance:none;cursor:pointer;width:46px;height:46px;border:1px solid rgba(250,247,241,.4);background:none;color:#faf7f1;font:300 17px/1 'Jost',sans-serif;border-radius:50%"
              )}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
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
