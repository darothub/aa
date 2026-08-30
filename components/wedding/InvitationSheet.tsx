'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { css } from '@/lib/css';

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
            <div style={css('display:flex;flex-direction:column;align-items:center;gap:12px')}>
              <div
                style={css(
                  "width:54px;height:54px;border:1px solid rgba(154,111,76,.5);border-radius:50%;display:flex;align-items:center;justify-content:center;font:400 19px/1 'Cormorant Garamond',serif;color:#9a6f4c;letter-spacing:.04em"
                )}
              >
                A&nbsp;A
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
              Aishat <span style={css('font-style:italic;color:#9a6f4c')}>&amp;</span> Abdul
            </h1>

            <p style={css("margin:0;max-width:42ch;font:300 clamp(14px,1.7vw,16px)/1.85 'Jost',sans-serif;color:#6b6259;text-wrap:pretty")}>
              request the pleasure of your company as they are joined in marriage — and would be honoured to have you
              beside them.
            </p>

            <div style={css('width:52px;height:1px;background:rgba(154,111,76,.45)')} />

            <div style={css('display:flex;align-items:stretch;gap:clamp(16px,4vw,34px);flex-wrap:wrap;justify-content:center')}>
              <div style={css('display:flex;flex-direction:column;align-items:center;gap:4px;min-width:88px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#a89d8f")}>
                  Saturday
                </span>
                <span style={css("font:300 clamp(30px,6vw,46px)/1 'Cormorant Garamond',serif;color:#1f1c18")}>21</span>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#a89d8f")}>
                  November
                </span>
              </div>
              <div style={css('width:1px;background:rgba(31,28,24,.14)')} />
              <div style={css('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-width:88px')}>
                <span style={css("font:300 clamp(26px,5vw,38px)/1 'Cormorant Garamond',serif;color:#1f1c18")}>2026</span>
                <span style={css("font:400 12px/1 'Jost',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#6b6259")}>
                  2:00 in the afternoon
                </span>
              </div>
            </div>

            <div style={css('width:52px;height:1px;background:rgba(154,111,76,.45)')} />

            <div style={css('display:flex;flex-direction:column;align-items:center;gap:7px')}>
              <h2 style={css("margin:0;font:400 clamp(21px,3.4vw,29px)/1.2 'Cormorant Garamond',serif;color:#1f1c18")}>
                Aso Rock Banquet Hall
              </h2>
              <p style={css("margin:0;font:300 14px/1.7 'Jost',sans-serif;color:#6b6259")}>
                Asokoro District, Abuja, Nigeria
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
                  Formal / cocktail. Warm neutrals, deep greens and gold are very welcome.
                </span>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:6px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                  Arrival
                </span>
                <span style={css("font:300 13.5px/1.65 'Jost',sans-serif;color:#3a352e")}>
                  Doors from 1:15pm. Ceremony begins promptly at 2:00pm. Parking on site.
                </span>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:6px')}>
                <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                  Kindly reply
                </span>
                <span style={css("font:300 13.5px/1.65 'Jost',sans-serif;color:#3a352e")}>
                  By 24 October 2026 — <a href="/#rsvp">rsvp online</a> or +234 000 000 0000.
                </span>
              </div>
            </div>

            <p style={css("margin:clamp(8px,2vw,16px) 0 0;font:italic 300 clamp(15px,2.2vw,19px)/1.6 'Cormorant Garamond',serif;color:#6b6259")}>
              We cannot wait to celebrate with you.
            </p>
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
