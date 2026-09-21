'use client';

import { useEffect, useRef } from 'react';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';
import { COUPLE, DRESS_CODE, LOGO, VENUE, WEDDING_DATE } from '@/content/wedding';

// Flip to true once the invitation copy (venue, timings, dress code) is confirmed and ready to publish.
const INVITATION_READY = false;

const comingSoonStyle = css(
  "font:300 14.5px/1.7 'Jost',sans-serif;font-style:italic;background-image:linear-gradient(90deg,#6b6259 0%,#6b6259 42%,#c9a978 50%,#6b6259 58%,#6b6259 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;animation:invitationShimmer 3.4s linear infinite"
);

export default function InvitationTeaser() {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!INVITATION_READY) return;
    let cancelled = false;
    (async () => {
      const QRCode = (await import('qrcode')).default;
      const url = new URL('/invitation', window.location.origin).href;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 108,
        margin: 1,
        color: { dark: '#1f1c18', light: '#faf7f1' }
      });
      if (cancelled || !qrRef.current) return;
      qrRef.current.innerHTML = '';
      const img = document.createElement('img');
      img.src = dataUrl;
      img.width = 108;
      img.height = 108;
      img.alt = 'QR code linking to the digital invitation';
      qrRef.current.appendChild(img);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="invitation" style={css('scroll-margin-top:var(--header-h, 80px);padding:clamp(76px,12vw,150px) clamp(20px,5vw,72px);background:#efe8dd')}>
      <style>{`
        @keyframes invitationShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
      <div style={css('max-width:1160px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(36px,5vw,60px)')}>
        <Reveal style={css('display:flex;flex-direction:column;gap:16px;max-width:42ch')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#9a6f4c")}>
            The invitation
          </p>
          <h2 style={css("margin:0;font:300 clamp(36px,6.5vw,72px)/1.02 'Cormorant Garamond',serif;letter-spacing:-.015em")}>
            Officially, and in writing.
          </h2>
        </Reveal>

        {INVITATION_READY ? (
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(28px,4vw,56px);align-items:center')}>
            <Reveal
              style={css(
                'position:relative;background:#faf7f1;box-shadow:0 40px 80px -50px rgba(31,28,24,.5);padding:clamp(30px,5vw,54px) clamp(22px,4vw,44px)'
              )}
            >
              <div style={css('position:absolute;inset:14px;border:1px solid rgba(154,111,76,.32);pointer-events:none')} />
              <div style={css('position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px')}>
                <p
                  dir="rtl"
                  lang="ar"
                  style={css(
                    "margin:0;font:400 15px/1.4 'Amiri','Traditional Arabic',serif;color:#9a6f4c;text-align:center"
                  )}
                >
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
                <div
                  style={css(
                    'width:46px;height:46px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(154,111,76,.5)'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LOGO.src}
                    alt={LOGO.alt}
                    style={css('width:100%;height:100%;object-fit:cover;object-position:50% 38%;display:block')}
                  />
                </div>
                <p style={css("margin:0;font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#9a6f4c")}>
                  Together with our families
                </p>
                <h3 style={css("margin:0;font:300 clamp(30px,5.6vw,50px)/1.05 'Cormorant Garamond',serif")}>
                  {COUPLE.partner1} <span style={css('font-style:italic;color:#9a6f4c')}>&amp;</span> {COUPLE.partner2}
                </h3>
                <div style={css('width:44px;height:1px;background:rgba(154,111,76,.45)')} />
                <p style={css("margin:0;font:300 14px/1.8 'Jost',sans-serif;color:#6b6259")}>
                  {WEDDING_DATE.label} · {WEDDING_DATE.ceremonyTime}
                  <br />
                  {VENUE.name}
                  <br />
                  {VENUE.shortAddress}
                </p>
                <p style={css("margin:0;font:300 12.5px/1.7 'Jost',sans-serif;color:#a89d8f")}>
                  {DRESS_CODE.label} · Kindly reply by {WEDDING_DATE.rsvpDeadline}
                </p>
              </div>
            </Reveal>

            <Reveal style={css('display:flex;flex-direction:column;gap:26px')}>
              <p style={css("margin:0;font:300 clamp(15px,1.7vw,17px)/1.85 'Jost',sans-serif;color:#6b6259;text-wrap:pretty")}>
                The full invitation — with venue, timings, attire, travel and reply details — opens as its own page, ready
                to save or print. Scan the code to open it on another device.
              </p>
              <div style={css('display:flex;flex-wrap:wrap;gap:14px;align-items:center')}>
                <a
                  href="/invitation?print=1"
                  target="_blank"
                  rel="noopener"
                  style={css(
                    "padding:17px 32px;background:#1f1c18;color:#faf7f1;font:500 11px/1 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;transition:background .45s ease"
                  )}
                >
                  Download invitation
                </a>
                <a
                  href="/invitation"
                  target="_blank"
                  rel="noopener"
                  style={css(
                    "padding:17px 32px;border:1px solid rgba(31,28,24,.26);color:#1f1c18;font:500 11px/1 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;transition:border-color .4s ease,color .4s ease"
                  )}
                >
                  View full invitation
                </a>
                <a
                  href="#rsvp"
                  style={css(
                    "padding:17px 32px;border:1px solid rgba(154,111,76,.5);color:#9a6f4c;font:500 11px/1 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;transition:border-color .4s ease,color .4s ease"
                  )}
                >
                  RSVP now
                </a>
              </div>
              <div style={css('display:flex;align-items:center;gap:20px;padding-top:6px')}>
                <div
                  ref={qrRef}
                  style={css(
                    'width:124px;height:124px;flex:0 0 auto;background:#faf7f1;border:1px solid rgba(31,28,24,.14);display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box'
                  )}
                />
                <div style={css('display:flex;flex-direction:column;gap:6px')}>
                  <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                    Scan to open
                  </span>
                  <span style={css("font:300 13.5px/1.7 'Jost',sans-serif;color:#6b6259;max-width:24ch")}>
                    Points straight to the digital invitation.
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        ) : (
          <Reveal
            style={css(
              'position:relative;background:#faf7f1;box-shadow:0 40px 80px -50px rgba(31,28,24,.5);padding:clamp(40px,6vw,64px) clamp(24px,5vw,48px);display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px'
            )}
          >
            <div style={css('position:absolute;inset:14px;border:1px solid rgba(154,111,76,.32);pointer-events:none')} />
            <div
              style={css(
                'position:relative;width:46px;height:46px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(154,111,76,.5)'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO.src}
                alt={LOGO.alt}
                style={css('width:100%;height:100%;object-fit:cover;object-position:50% 38%;display:block')}
              />
            </div>
            <span style={{ ...comingSoonStyle, position: 'relative', font: "300 clamp(24px,3vw,32px)/1.2 'Cormorant Garamond',serif" }}>
              Coming soon
            </span>
            <p style={css("position:relative;margin:0;font:300 14.5px/1.8 'Jost',sans-serif;color:#6b6259;max-width:38ch")}>
              The formal invitation — with venue, timings, attire and reply details — is being finalised. Check back soon.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
