'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { css } from '@/lib/css';
import { COUPLE, DRESS_CODE, HASHTAG, LOGO, VENUE, WEDDING_DATE } from '@/content/wedding';

export default function InvitationSheet() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('print') === '1') {
      const t = setTimeout(() => window.print(), 700);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: #fff; }
          [data-noprint] { display: none !important; }
          [data-sheet] { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; border-radius: 0 !important; }
        }
      `}</style>
      <main
        style={css(
          'min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(20px,4vw,34px);padding:clamp(18px,5vw,56px) clamp(14px,4vw,40px);background:#e8e1d6'
        )}
      >
        <article
          data-sheet
          style={css(
            'position:relative;width:min(760px,100%);background:#faf7f1;box-shadow:0 40px 90px -50px rgba(31,28,24,.5),0 2px 6px rgba(31,28,24,.06);padding:clamp(34px,7vw,74px) clamp(22px,6vw,68px);overflow:hidden'
          )}
        >
          <div style={css('position:absolute;inset:clamp(12px,2.6vw,22px);border:1px solid rgba(154,111,76,.34);pointer-events:none')} />
          <div style={css('position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:clamp(18px,3vw,30px)')}>
            <p
              dir="rtl"
              lang="ar"
              style={css(
                "margin:0;font:400 clamp(15px,2.2vw,18px)/1.4 'Amiri','Traditional Arabic',serif;color:#9a6f4c;text-align:center"
              )}
            >
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <div style={css('display:flex;flex-direction:column;align-items:center;gap:12px')}>
              {/* The crest's own black backdrop, cropped to a circle, reads as a
                  wax seal pressed into the card rather than a stray photo. */}
              <div
                style={css(
                  'width:60px;height:60px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(154,111,76,.5),0 6px 16px -8px rgba(31,28,24,.45)'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LOGO.src}
                  alt={LOGO.alt}
                  style={css('width:100%;height:100%;object-fit:cover;object-position:50% 38%;display:block')}
                />
              </div>
              <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.34em;text-transform:uppercase;color:#9a6f4c")}>
                Together with our families
              </p>
            </div>

            <h1
              style={css(
                "margin:0;font:300 clamp(38px,9vw,86px)/1 'Cormorant Garamond',serif;color:#1f1c18;letter-spacing:-.015em;text-align:center;text-wrap:balance"
              )}
            >
              {COUPLE.partner1} <span style={css('font-style:italic;color:#9a6f4c')}>&amp;</span> {COUPLE.partner2}
            </h1>

            <p style={css("margin:0;max-width:42ch;font:300 clamp(14px,1.7vw,16px)/1.85 'Jost',sans-serif;color:#6b6259;text-wrap:pretty")}>
              request the pleasure of your company as they are joined in marriage — and would be honoured to have you
              beside them.
            </p>

            <div style={css('width:52px;height:1px;background:rgba(154,111,76,.45)')} />

            <div style={css('display:flex;align-items:stretch;gap:clamp(16px,4vw,34px);flex-wrap:wrap;justify-content:center')}>
              <div style={css('display:flex;flex-direction:column;align-items:center;gap:4px;min-width:88px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#a89d8f")}>
                  {WEDDING_DATE.weekday}
                </span>
                <span style={css("font:300 clamp(30px,6vw,46px)/1 'Cormorant Garamond',serif;color:#1f1c18")}>{WEDDING_DATE.day}</span>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#a89d8f")}>
                  {WEDDING_DATE.month}
                </span>
              </div>
              <div style={css('width:1px;background:rgba(31,28,24,.14)')} />
              <div style={css('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-width:88px')}>
                <span style={css("font:300 clamp(26px,5vw,38px)/1 'Cormorant Garamond',serif;color:#1f1c18")}>{WEDDING_DATE.year}</span>
                <span style={css("font:400 12px/1 'Jost',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#6b6259")}>
                  {WEDDING_DATE.ceremonyTime} in the afternoon
                </span>
              </div>
            </div>

            <div style={css('width:52px;height:1px;background:rgba(154,111,76,.45)')} />

            <div style={css('display:flex;flex-direction:column;align-items:center;gap:7px')}>
              <h2 style={css("margin:0;font:400 clamp(21px,3.4vw,29px)/1.2 'Cormorant Garamond',serif;color:#1f1c18")}>
                {VENUE.name}
              </h2>
              <p style={css("margin:0;font:300 14px/1.7 'Jost',sans-serif;color:#6b6259")}>
                {VENUE.fullAddress}
              </p>
            </div>

            <div
              style={css(
                'width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:clamp(14px,3vw,26px);margin-top:clamp(6px,1.6vw,14px);padding-top:clamp(18px,3vw,26px);border-top:1px solid rgba(31,28,24,.12);text-align:left'
              )}
            >
              <div style={css('display:flex;flex-direction:column;gap:6px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                  Attire
                </span>
                <span style={css("font:300 13.5px/1.65 'Jost',sans-serif;color:#3a352e")}>
                  {DRESS_CODE.label}. {DRESS_CODE.note}
                </span>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:6px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                  Arrival
                </span>
                <span style={css("font:300 13.5px/1.65 'Jost',sans-serif;color:#3a352e")}>
                  Doors from {WEDDING_DATE.doorsTime}. Ceremony begins promptly at {WEDDING_DATE.ceremonyTime}. Parking on site.
                </span>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:6px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                  Kindly reply
                </span>
                <span style={css("font:300 13.5px/1.65 'Jost',sans-serif;color:#3a352e")}>
                  By {WEDDING_DATE.rsvpDeadline} — <a href="/#rsvp">rsvp online</a> or +234 000 000 0000.
                </span>
              </div>
            </div>

            <p style={css("margin:clamp(8px,2vw,16px) 0 0;font:italic 300 clamp(15px,2.2vw,19px)/1.6 'Cormorant Garamond',serif;color:#6b6259")}>
              We cannot wait to celebrate with you.
            </p>

            {/* Printed, not interactive: the sheet leaves the browser, so this is
                plain text rather than the copy-to-clipboard chip. */}
            <div style={css('display:flex;flex-direction:column;align-items:center;gap:8px')}>
              <div style={css('width:30px;height:1px;background:rgba(154,111,76,.4)')} />
              <span style={css("font:500 9px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#a89d8f")}>
                Share the day
              </span>
              <span style={css("font:400 clamp(13px,1.8vw,15px)/1 'Jost',sans-serif;letter-spacing:.16em;color:#9a6f4c")}>
                {HASHTAG.tag}
              </span>
            </div>
          </div>
        </article>

        <div data-noprint style={css('display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center')}>
          <button
            type="button"
            onClick={() => window.print()}
            style={css(
              "appearance:none;cursor:pointer;border:1px solid #1f1c18;background:#1f1c18;color:#faf7f1;padding:15px 30px;font:500 11px/1 'Jost',sans-serif;letter-spacing:.22em;text-transform:uppercase;transition:background .4s ease,color .4s ease"
            )}
          >
            Download invitation
          </button>
          <a
            href="/"
            style={css(
              "padding:15px 30px;border:1px solid rgba(31,28,24,.28);font:500 11px/1 'Jost',sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#1f1c18;transition:border-color .4s ease,color .4s ease"
            )}
          >
            Back to the website
          </a>
        </div>
      </main>
    </>
  );
}
