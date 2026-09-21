import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';
import { BRIDAL_TRAIN, BRIDAL_TRAIN_READY } from '@/content/wedding';

// Shown while the roster isn't final — enough cards to suggest a full train
// without claiming a headcount nobody has confirmed yet.
const PLACEHOLDER_COUNT = 6;

// Rotates through the site's own palette so the placeholder row reads as
// "part of this page" rather than generic grey circles, without implying any
// particular person — no name or photo is attached to any of these yet.
const AVATAR_COLORS = ['#c9a978', '#9a6f4c', '#b1502f', '#8a9a7c', '#6b6259', '#a6785a'];

// Every other card sits lower, so the horizontal row reads as a zig-zag
// instead of a flat strip.
const ZIGZAG_OFFSET = '30px';

const comingSoonStyle = css(
  "font:300 13px/1.5 'Jost',sans-serif;font-style:italic;background-image:linear-gradient(90deg,#6b6259 0%,#6b6259 42%,#c9a978 50%,#6b6259 58%,#6b6259 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;animation:bridalTrainShimmer 3.4s linear infinite"
);

/** A small five-petal rose/flower motif that tucks over one corner of a
 * frame. Purely decorative — it carries no data and needs no alt text. */
function FlowerAccent({ corner, color }: { corner: 'top-left' | 'bottom-right'; color: string }) {
  const pos =
    corner === 'top-left' ? 'top:-14px;left:-14px' : 'bottom:-14px;right:-14px';
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      style={css(`position:absolute;${pos};z-index:2;filter:drop-shadow(0 2px 3px rgba(31,28,24,.18))`)}
    >
      <g transform="translate(18,18)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-7" rx="5.5" ry="8" fill={color} opacity="0.92" transform={`rotate(${deg})`} />
        ))}
        <circle r="4.5" fill="#faf7f1" />
      </g>
    </svg>
  );
}

/** A generic person silhouette on a tinted rectangle — stands in for a real
 * photo until the roster is final, without guessing at who belongs there. */
function PlaceholderAvatar({ index }: { index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      style={css(
        `width:100%;aspect-ratio:3/4;border-radius:10px;background:${color};display:flex;align-items:center;justify-content:center`
      )}
    >
      <svg width="34%" height="34%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" fill="rgba(250,247,241,.9)" />
        <path d="M4 20.5c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="rgba(250,247,241,.9)" />
      </svg>
    </div>
  );
}

export default function BridalTrain() {
  const showRoster = BRIDAL_TRAIN_READY && BRIDAL_TRAIN.length > 0;

  return (
    <section
      id="bridal-train"
      style={css('scroll-margin-top:var(--header-h, 80px);padding:clamp(76px,12vw,150px) clamp(20px,5vw,72px);background:#f7f3ec')}
    >
      <style>{`
        @keyframes bridalTrainShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
      <div style={css('max-width:1160px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(40px,6vw,64px)')}>
        <Reveal style={css('display:flex;flex-direction:column;gap:16px;max-width:48ch')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#9a6f4c")}>
            The wedding party
          </p>
          <h2 style={css("margin:0;font:400 clamp(28px,4.2vw,44px)/1.15 'Cormorant Garamond',serif;color:#1f1c18")}>
            Meet the bridal train
          </h2>
          <p style={css("margin:0;font:300 15px/1.7 'Jost',sans-serif;color:rgba(31,28,24,.62)")}>
            The friends and family standing beside us on the day — bridesmaids and groomsmen alike.
          </p>
        </Reveal>

        {showRoster ? (
          <div
            style={css(
              `display:flex;align-items:flex-start;overflow-x:auto;overflow-y:visible;scroll-snap-type:x proximity;gap:clamp(28px,3.6vw,40px);padding:10px 4px calc(${ZIGZAG_OFFSET} + 16px);-webkit-overflow-scrolling:touch`
            )}
          >
            {BRIDAL_TRAIN.map((member, i) => {
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <Reveal
                  key={member.id}
                  style={css(
                    `flex:0 0 clamp(150px,20vw,190px);scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;margin-top:${i % 2 === 1 ? ZIGZAG_OFFSET : '0'}`
                  )}
                >
                  <div
                    style={css(
                      'position:relative;width:100%;aspect-ratio:3/4;border-radius:10px;overflow:visible;background:#e9e1d3'
                    )}
                  >
                    <div style={css('width:100%;height:100%;border-radius:10px;overflow:hidden')}>
                      {member.photo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.photo}
                          alt={member.name}
                          style={css('width:100%;height:100%;object-fit:cover')}
                        />
                      )}
                    </div>
                    <FlowerAccent corner={i % 2 === 0 ? 'top-left' : 'bottom-right'} color={color} />
                  </div>
                  <p style={css("margin:0;font:500 15px/1.3 'Jost',sans-serif;color:#1f1c18")}>{member.name}</p>
                  <p style={css("margin:0;font:300 12.5px/1.3 'Jost',sans-serif;color:rgba(31,28,24,.55)")}>{member.role}</p>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div
            aria-hidden="true"
            style={css(
              `display:flex;align-items:flex-start;overflow-x:auto;overflow-y:visible;scroll-snap-type:x proximity;gap:clamp(28px,3.6vw,40px);padding:10px 4px calc(${ZIGZAG_OFFSET} + 16px);-webkit-overflow-scrolling:touch`
            )}
          >
            {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={i}
                style={css(
                  `flex:0 0 clamp(150px,20vw,190px);scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;margin-top:${i % 2 === 1 ? ZIGZAG_OFFSET : '0'}`
                )}
              >
                <div style={css('position:relative;width:100%')}>
                  <PlaceholderAvatar index={i} />
                  <FlowerAccent
                    corner={i % 2 === 0 ? 'top-left' : 'bottom-right'}
                    color={AVATAR_COLORS[(i + 2) % AVATAR_COLORS.length]}
                  />
                </div>
                <p style={comingSoonStyle}>Coming soon</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
