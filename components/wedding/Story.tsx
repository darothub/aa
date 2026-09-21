'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';
import { STORY_SLIDES } from '@/content/wedding';

export default function Story() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const dragState = useRef<{ x0: number; dx: number } | null>(null);

  const go = (i: number) => setIndex(((i % STORY_SLIDES.length) + STORY_SLIDES.length) % STORY_SLIDES.length);

  useEffect(() => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${-index * 100}%,0,0)`;
  }, [index]);

  const onPointerDown = (e: ReactPointerEvent) => {
    dragState.current = { x0: e.clientX, dx: 0 };
    trackRef.current?.setAttribute('data-dragging', '');
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const drag = dragState.current;
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!drag || !vp || !track) return;
    drag.dx = e.clientX - drag.x0;
    const base = -index * vp.clientWidth;
    track.style.transform = `translate3d(${base + drag.dx * 0.9}px,0,0)`;
  };
  const endDrag = () => {
    const drag = dragState.current;
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!drag || !vp || !track) return;
    track.removeAttribute('data-dragging');
    const t = Math.min(120, vp.clientWidth * 0.16);
    if (drag.dx < -t) go(index + 1);
    else if (drag.dx > t) go(index - 1);
    else track.style.transform = `translate3d(${-index * 100}%,0,0)`;
    dragState.current = null;
  };

  return (
    <section
      id="story"
      style={css('scroll-margin-top:var(--header-h, 80px);padding:clamp(76px,12vw,150px) clamp(20px,5vw,72px);background:#f7f3ec')}
    >
      <div style={css('max-width:1160px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(38px,6vw,72px)')}>
        <Reveal style={css('display:flex;flex-direction:column;gap:18px;max-width:44ch')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#9a6f4c")}>
            Our love story
          </p>
          <h2 style={css("margin:0;font:300 clamp(36px,6.5vw,72px)/1.02 'Cormorant Garamond',serif;letter-spacing:-.015em")}>
            Four years, one beautiful journey.
          </h2>
          <p style={css("margin:0;font:300 clamp(15px,1.7vw,17px)/1.8 'Jost',sans-serif;color:#6b6259;text-wrap:pretty")}>
            What began with long phone conversations, shared dreams, and finally meeting in Porto became a story of laughter, friendship,
            growth, and resilience. From calm waters to difficult waves, we learned how to steady the ship together and now,
            wherever life takes us, we keep sailing forward side by side.
          </p>
        </Reveal>

        <Reveal style={css('position:relative')}>
          <div
            ref={viewportRef}
            style={css('position:relative;overflow:hidden;cursor:grab;touch-action:pan-y')}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
          >
            <div data-story-track ref={trackRef}>
              {STORY_SLIDES.map((slide) => (
                <article
                  key={slide.id}
                  data-story-slide
                  style={css(
                    'flex:0 0 100%;min-width:100%;box-sizing:border-box;display:grid;grid-template-columns:1fr;gap:clamp(22px,3.5vw,52px);align-items:center;padding-right:clamp(0px,1vw,12px)'
                  )}
                >
                  <div style={css('position:relative;aspect-ratio:4/5;background:#e8e1d6')}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/${slide.id}.jpg`}
                      alt={slide.placeholder}
                      style={css(
                        `width:100%;height:100%;object-fit:cover;object-position:50% ${slide.focalY ?? '50%'};display:block`
                      )}
                    />
                  </div>
                  <div style={css('display:flex;flex-direction:column;gap:14px')}>
                    <span style={css("font:500 10px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#9a6f4c")}>
                      {slide.era}
                    </span>
                    <h3 style={css("margin:0;font:300 clamp(27px,4.2vw,48px)/1.1 'Cormorant Garamond',serif;text-wrap:balance")}>
                      {slide.title}
                    </h3>
                    <p style={css("margin:0;font:300 clamp(14.5px,1.6vw,16.5px)/1.85 'Jost',sans-serif;color:#6b6259;text-wrap:pretty")}>
                      {slide.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div
            style={css(
              'display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-top:clamp(22px,3vw,36px);padding-top:clamp(18px,2.5vw,26px);border-top:1px solid rgba(31,28,24,.14)'
            )}
          >
            <div style={css('display:flex;align-items:center;gap:9px')}>
              {STORY_SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  data-dot
                  {...(i === index ? { 'data-selected': '' } : {})}
                  onClick={() => go(i)}
                  aria-label={`Go to chapter ${i + 1}`}
                  style={css(
                    'appearance:none;cursor:pointer;border:0;padding:0;width:14px;height:4px;border-radius:2px;background:rgba(31,28,24,.24);transition:width .4s ease,background .4s ease'
                  )}
                />
              ))}
            </div>
            <div style={css('display:flex;align-items:center;gap:14px')}>
              <span style={css("font:400 11px/1 'Jost',sans-serif;letter-spacing:.2em;color:#a89d8f;font-variant-numeric:tabular-nums")}>
                {String(index + 1).padStart(2, '0')} / {String(STORY_SLIDES.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous chapter"
                style={css(
                  "appearance:none;cursor:pointer;width:46px;height:46px;border:1px solid rgba(31,28,24,.24);background:none;color:#1f1c18;font:300 17px/1 'Jost',sans-serif;border-radius:50%;transition:border-color .35s ease,background .35s ease"
                )}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next chapter"
                style={css(
                  "appearance:none;cursor:pointer;width:46px;height:46px;border:1px solid rgba(31,28,24,.24);background:none;color:#1f1c18;font:300 17px/1 'Jost',sans-serif;border-radius:50%;transition:border-color .35s ease,background .35s ease"
                )}
              >
                →
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
