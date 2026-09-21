'use client';

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import { css } from '@/lib/css';
import { GALLERY } from '@/content/wedding';
import LogoSpinner from './LogoSpinner';

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

// Purely decorative — shows the shape the real grid will take once photos
// start arriving. Count is arbitrary, just enough to fill a few rows across
// typical widths without looking like a fixed, meaningful number.
const PLACEHOLDER_CELL_COUNT = 8;

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

type PendingDelete = { ids: number[]; message: string };

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

  // Selection is off by default so a normal visit just browses; the couple
  // switches it on to clean up the gallery, then off again.
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  // Replaces window.confirm — a browser confirm() can't carry the site's own
  // look, and on some mobile browsers renders behind other fixed overlays.
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const load = useCallback((cancelledRef?: { current: boolean }) => {
    return fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (cancelledRef?.current) return;
        const list: Photo[] = data.photos ?? [];
        setPhotos(list);
        onCountChange?.(list.length);
      })
      .catch(() => {
        if (!cancelledRef?.current) setPhotos((prev) => prev);
      })
      .finally(() => {
        if (!cancelledRef?.current) setLoading(false);
      });
    // Mount-only poll interval below is what keeps this current; onCountChange
    // is a stable setter from the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cancelledRef = { current: false };
    load(cancelledRef);
    const id = setInterval(() => load(cancelledRef), POLL_MS);
    return () => {
      cancelledRef.current = true;
      clearInterval(id);
    };
  }, [load]);

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

  // The confirm dialog gets the same treatment: lock scroll and let Escape
  // dismiss it, same as the lightbox above.
  const isConfirming = pendingDelete !== null;
  useEffect(() => {
    if (!isConfirming) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPendingDelete(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isConfirming]);

  const toggleSelected = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteIds = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0 || deleting) return;
      setDeleting(true);
      setDeleteError('');
      try {
        const res = await fetch('/api/gallery', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.error || 'Could not delete.');
        }
        const removed = new Set(ids);
        // onCountChange updates a DIFFERENT component's state (GalleryClient's
        // `count`). Calling it from inside the setPhotos updater ran it during
        // React's render phase and triggered "Cannot update a component while
        // rendering a different component" — it has to run as its own
        // statement, after the updater, not inside it.
        let nextCount = 0;
        setPhotos((prev) => {
          const next = prev.filter((p) => !removed.has(p.id));
          nextCount = next.length;
          return next;
        });
        onCountChange?.(nextCount);
        setSelected((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
        if (openId !== null && removed.has(openId)) setOpenId(null);
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : 'Could not delete.');
      } finally {
        setDeleting(false);
      }
    },
    [deleting, onCountChange, openId]
  );

  const deleteOne = (id: number) => {
    setPendingDelete({ ids: [id], message: 'Delete this photo?' });
  };

  const deleteSelected = () => {
    if (selected.size === 0) return;
    setPendingDelete({
      ids: Array.from(selected),
      message: `Delete ${selected.size} photo${selected.size === 1 ? '' : 's'}?`
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { ids } = pendingDelete;
    setPendingDelete(null);
    void deleteIds(ids);
  };

  return (
    <div style={css('display:flex;flex-direction:column;gap:20px')}>
      {loading && photos.length === 0 && (
        <div style={css('display:flex;justify-content:center;padding:40px 0')}>
          <LogoSpinner label="Loading photos…" />
        </div>
      )}

      {!loading && photos.length === 0 && (
        <>
          <p style={css("margin:0;font:300 15px/1.7 'Jost',sans-serif;color:rgba(31,28,24,.5)")}>
            {GALLERY.emptyState}
          </p>
          <div
            aria-hidden="true"
            style={css(
              'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px'
            )}
          >
            {Array.from({ length: PLACEHOLDER_CELL_COUNT }).map((_, i) => (
              <div
                key={i}
                style={css(
                  'aspect-ratio:1/1;border:1px dashed rgba(31,28,24,.2);border-radius:2px;background:rgba(31,28,24,.03)'
                )}
              />
            ))}
          </div>
        </>
      )}

      {photos.length > 0 && (
        <div style={css('display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap')}>
          <button
            type="button"
            onClick={() => {
              setSelecting((prev) => !prev);
              setSelected(new Set());
              setDeleteError('');
            }}
            style={css(
              `appearance:none;cursor:pointer;border:1px solid rgba(31,28,24,.28);background:${
                selecting ? '#1f1c18' : 'none'
              };color:${selecting ? '#faf7f1' : '#1f1c18'};padding:9px 16px;font:500 10px/1 'Jost',sans-serif;letter-spacing:.14em;text-transform:uppercase;border-radius:3px`
            )}
          >
            {selecting ? 'Cancel' : 'Select photos'}
          </button>

          {selecting && (
            <div style={css('display:flex;align-items:center;gap:14px')}>
              {deleting ? (
                <LogoSpinner size={20} label="Deleting…" />
              ) : (
                <>
                  {deleteError && (
                    <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#b1502f")}>{deleteError}</span>
                  )}
                  <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:rgba(31,28,24,.55)")}>
                    {selected.size} selected
                  </span>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    disabled={selected.size === 0}
                    style={css(
                      `appearance:none;cursor:${
                        selected.size === 0 ? 'default' : 'pointer'
                      };border:1px solid #b1502f;background:none;color:#b1502f;padding:9px 16px;font:500 10px/1 'Jost',sans-serif;letter-spacing:.14em;text-transform:uppercase;border-radius:3px;opacity:${
                        selected.size === 0 ? 0.4 : 1
                      }`
                    )}
                  >
                    Delete selected
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div
          style={css(
            'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px'
          )}
        >
          {photos.map((photo) => {
            const isSelected = selected.has(photo.id);
            return (
              <div
                key={photo.id}
                className="gallery-cell"
                style={css(
                  `position:relative;background:#e8e1d6;aspect-ratio:1/1;overflow:hidden;border-radius:2px;${
                    isSelected ? 'outline:3px solid #9a6f4c;outline-offset:-3px' : ''
                  }`
                )}
              >
                <button
                  type="button"
                  onClick={() => (selecting ? toggleSelected(photo.id) : setOpenId(photo.id))}
                  aria-label={photo.caption || `Photo from ${photo.uploaderName}`}
                  style={css(
                    'appearance:none;cursor:pointer;padding:0;border:0;background:none;width:100%;height:100%;display:block'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption || `Photo from ${photo.uploaderName}`}
                    loading="lazy"
                    style={css('width:100%;height:100%;object-fit:cover;display:block')}
                  />

                  {photo.caption && (
                    <span
                      className="gallery-cell-caption"
                      style={css(
                        "position:absolute;inset:0;display:flex;align-items:flex-end;padding:10px;background:linear-gradient(180deg,transparent 50%,rgba(20,17,14,.82) 100%);opacity:0;transition:opacity .2s ease;text-align:left"
                      )}
                    >
                      <span style={css("font:400 12px/1.4 'Jost',sans-serif;color:#faf7f1")}>
                        {photo.caption}
                      </span>
                    </span>
                  )}
                </button>

                {selecting && (
                  <span
                    aria-hidden="true"
                    style={css(
                      `position:absolute;top:8px;left:8px;width:20px;height:20px;border-radius:50%;border:1.5px solid #faf7f1;background:${
                        isSelected ? '#9a6f4c' : 'rgba(20,17,14,.35)'
                      };box-shadow:0 1px 4px rgba(0,0,0,.3)`
                    )}
                  />
                )}

                {!selecting && (
                  <button
                    type="button"
                    onClick={() => deleteOne(photo.id)}
                    aria-label="Delete photo"
                    title="Delete photo"
                    className="gallery-cell-delete"
                    style={css(
                      "position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;border:none;cursor:pointer;background:rgba(20,17,14,.55);color:#faf7f1;font:400 14px/1 'Jost',sans-serif;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease"
                    )}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
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

          <button
            type="button"
            onClick={() => deleteOne(current.id)}
            aria-label="Delete photo"
            style={css(
              "position:absolute;top:20px;left:20px;appearance:none;cursor:pointer;border:1px solid rgba(250,247,241,.5);background:none;color:#faf7f1;padding:8px 14px;font:500 10px/1 'Jost',sans-serif;letter-spacing:.14em;text-transform:uppercase;border-radius:3px"
            )}
          >
            Delete
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

      {pendingDelete && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="gallery-delete-confirm-heading"
          style={css(
            'position:fixed;inset:0;z-index:90;background:rgba(20,17,14,.6);display:flex;align-items:center;justify-content:center;padding:20px'
          )}
          onClick={() => setPendingDelete(null)}
        >
          <div
            style={css(
              "width:100%;max-width:360px;background:#faf7f1;border:1px solid rgba(31,28,24,.14);border-radius:6px;padding:clamp(24px,5vw,32px);display:flex;flex-direction:column;gap:20px;box-shadow:0 18px 48px rgba(20,17,14,.28)"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={css('display:flex;flex-direction:column;gap:8px;text-align:center')}>
              <span
                style={css(
                  "font:500 10px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#9a6f4c"
                )}
              >
                Remove photo
              </span>
              <h2
                id="gallery-delete-confirm-heading"
                style={css("margin:0;font:400 22px/1.25 'Cormorant Garamond',serif;color:#1f1c18")}
              >
                {pendingDelete.message}
              </h2>
              <p style={css("margin:0;font:300 13px/1.6 'Jost',sans-serif;color:rgba(31,28,24,.55)")}>
                This can't be undone — the photo is removed from the gallery and from storage.
              </p>
            </div>
            <div style={css('display:flex;gap:10px;justify-content:center')}>
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                style={css(
                  "appearance:none;cursor:pointer;flex:1;border:1px solid rgba(31,28,24,.28);background:none;color:#1f1c18;padding:11px 16px;font:500 10px/1 'Jost',sans-serif;letter-spacing:.14em;text-transform:uppercase;border-radius:3px"
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={css(
                  "appearance:none;cursor:pointer;flex:1;border:1px solid #b1502f;background:#b1502f;color:#faf7f1;padding:11px 16px;font:500 10px/1 'Jost',sans-serif;letter-spacing:.14em;text-transform:uppercase;border-radius:3px"
                )}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-cell:hover .gallery-cell-caption,
        .gallery-cell:hover .gallery-cell-delete {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
