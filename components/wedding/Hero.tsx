'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '@/lib/css';
import { useScrollTransform } from '@/lib/hooks';
import Hashtag from './Hashtag';
import { COUPLE, HERO_MEDIA, VENUE, WEDDING_DATE } from '@/content/wedding';

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  useScrollTransform(imgRef, (y) => Math.min(y * 0.07, 30));

  // Starts false so server and first client render agree (no video source
  // exists on the server to check against); flips to true on mount if a
  // video is configured and the visitor hasn't asked for reduced motion.
  const [playVideo, setPlayVideo] = useState(false);
  useEffect(() => {
    if (!HERO_MEDIA.video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) setPlayVideo(true);
  }, []);

  return (
    <section
      id="top"
      style={css(
        'position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:#1f1c18'
      )}
    >
      <div style={css('position:absolute;inset:0;overflow:hidden')}>
        <div
          ref={imgRef}
          style={css('position:absolute;top:0;left:0;right:0;height:122%;will-change:transform;opacity:.94')}
        >
          {playVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_MEDIA.poster}
              onError={() => setPlayVideo(false)}
              style={css('width:100%;height:100%;object-fit:cover;display:block')}
            >
              <source src={HERO_MEDIA.video!} type="video/mp4" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_MEDIA.poster}
                alt={`${COUPLE.partner1} and ${COUPLE.partner2}`}
                style={css('width:100%;height:100%;object-fit:cover;display:block')}
              />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={HERO_MEDIA.poster}
              alt={`${COUPLE.partner1} and ${COUPLE.partner2}`}
              style={css('width:100%;height:100%;object-fit:cover;display:block')}
            />
          )}
        </div>
        <div
          style={css(
            'position:absolute;inset:0;background:linear-gradient(to bottom,rgba(24,21,17,.66) 0%,rgba(24,21,17,.5) 30%,rgba(24,21,17,.64) 72%,rgba(24,21,17,.9) 100%);pointer-events:none'
          )}
        />
        <div
          aria-hidden="true"
          style={css(
            'position:absolute;inset:0;background:linear-gradient(to right,rgba(24,21,17,.62) 0%,rgba(24,21,17,.38) 40%,rgba(24,21,17,0) 74%);pointer-events:none'
          )}
        />
      </div>

      <div
        style={css(
          'position:relative;padding:clamp(72px,11vh,150px) clamp(20px,5vw,72px) clamp(32px,5.5vh,66px);display:flex;flex-direction:column;gap:clamp(18px,3vw,34px);pointer-events:none'
        )}
      >
        <div style={css('display:flex;flex-direction:column;gap:10px;animation:wsFade 1.4s ease both')}>
          <p
            style={css(
              "margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.4em;text-transform:uppercase;color:rgba(250,247,241,.78)"
            )}
          >
            We&apos;re getting married
          </p>
          <h1
            style={css(
              "margin:0;font:300 clamp(40px,8.6vw,118px)/.92 'Cormorant Garamond',serif;color:#faf7f1;letter-spacing:-.02em"
            )}
          >
            {COUPLE.partner1}
            <br />
            <span
              style={css(
                'font-style:italic;font-size:.42em;line-height:1;color:rgba(250,247,241,.84);display:inline-block'
              )}
            >
              &amp;
            </span>
            <br />
            {COUPLE.partner2}
          </h1>
        </div>

        <div
          style={css(
            'display:flex;flex-direction:column;gap:clamp(18px,3vw,44px);justify-content:space-between;border-top:1px solid rgba(250,247,241,.22);padding-top:clamp(18px,3vw,26px);animation:wsRise 1.4s .3s ease both'
          )}
        >
          <div style={css('display:flex;gap:clamp(20px,4vw,56px);flex-wrap:wrap')}>
            <div style={css('display:flex;flex-direction:column;gap:7px')}>
              <span
                style={css(
                  "font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.6)"
                )}
              >
                The day
              </span>
              <span style={css("font:400 clamp(15px,2vw,19px)/1.4 'Jost',sans-serif;font-weight:300;color:#faf7f1")}>
                {WEDDING_DATE.label}
              </span>
            </div>
            <div style={css('display:flex;flex-direction:column;gap:7px')}>
              <span
                style={css(
                  "font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.6)"
                )}
              >
                The place
              </span>
              <span style={css("font:400 clamp(15px,2vw,19px)/1.4 'Jost',sans-serif;font-weight:300;color:#faf7f1")}>
                {VENUE.name}, {VENUE.city}
              </span>
            </div>
            {/* Third rail item, in the grammar the other two already established.
                pointer-events has to be re-enabled here: the whole overlay is
                inert so the parallax reads through it, same as the CTA below. */}
            <div style={css('display:flex;flex-direction:column;gap:7px;align-items:flex-start')}>
              <span
                style={css(
                  "font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,247,241,.6)"
                )}
              >
                The hashtag
              </span>
              <span style={css('pointer-events:auto;display:inline-flex')}>
                <Hashtag tone="light" size={12} />
              </span>
            </div>
          </div>
          <a
            href="#rsvp"
            style={css(
              "pointer-events:auto;align-self:flex-start;display:inline-flex;align-items:center;white-space:nowrap;gap:14px;padding:18px 34px;background:#faf7f1;color:#1f1c18;font:500 11px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;transition:background .45s ease,color .45s ease"
            )}
          >
            Join us <span style={css('font-size:14px;line-height:1')}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
