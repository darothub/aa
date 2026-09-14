import type { ReactNode } from 'react';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';
import Hashtag from './Hashtag';
import { COUPLE, DRESS_CODE, HASHTAG, VENUE, WEDDING_DATE } from '@/content/wedding';

// Flip these to true once the real schedule and guest-info copy are ready to publish.
const TIMELINE_READY = false;
const GUEST_INFO_READY = false;
// Flip to true to bring the "Good to know" column back.
const SHOW_GOOD_TO_KNOW = false;

const TIMELINE = [
  { time: WEDDING_DATE.doorsTime, what: 'Doors open — seating and refreshments' },
  { time: WEDDING_DATE.ceremonyTime, what: 'Ceremony begins, promptly' },
  { time: '3:15 pm', what: 'Photographs and cocktails on the terrace' },
  { time: '5:00 pm', what: 'Reception and dinner service' },
  { time: '7:30 pm', what: 'Speeches, then the first dance' },
  { time: '10:30 pm', what: 'Send-off, and the last shuttle home' }
];

const photographsBody: ReactNode = (
  <>
    Our photographer will find you — but the best pictures of a wedding are always the ones the guests take.{' '}
    {HASHTAG.invite}
    <br />
    <span style={css('display:inline-block;margin-top:12px')}>
      <Hashtag size={11} />
    </span>
  </>
);

const GUEST_INFO: Array<{ label: string; body: ReactNode }> = [
  { label: 'Parking', body: 'Complimentary valet and secure on-site parking from 12:45pm.' },
  { label: 'Shuttle & transport', body: 'Coaches depart Transcorp Hilton at 1:00pm and return at 10:30pm.' },
  {
    label: 'Nearby hotels',
    body: `Room blocks held at Transcorp Hilton and Fraser Suites — mention "${COUPLE.partner1} & ${COUPLE.partner2}" when booking.`
  },
  { label: 'Photographs', body: photographsBody },
  {
    label: 'Children',
    body: 'An adult celebration, with one exception: our nieces and nephews. Childcare available on request.'
  },
  { label: 'Dietary requirements', body: 'Halal throughout, with vegetarian and gluten-free menus. Tell us when you reply.' }
];

const comingSoonStyle = css("font:300 14.5px/1.7 'Jost',sans-serif;color:#6b6259;font-style:italic");

export default function Details() {
  return (
    <section
      id="details"
      style={css('scroll-margin-top:104px;padding:clamp(76px,12vw,150px) clamp(20px,5vw,72px);background:#efe8dd')}
    >
      <div style={css('max-width:1160px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(40px,6vw,72px)')}>
        <Reveal style={css('display:flex;flex-direction:column;gap:16px;max-width:40ch')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#9a6f4c")}>
            The details
          </p>
          <h2 style={css("margin:0;font:300 clamp(36px,6.5vw,72px)/1.02 'Cormorant Garamond',serif;letter-spacing:-.015em")}>
            Everything you need, nothing you don&apos;t.
          </h2>
        </Reveal>

        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:1px;background:rgba(31,28,24,.14)')}>
          {[
            { label: 'Date', big: <>{WEDDING_DATE.weekday}<br />{WEDDING_DATE.day} {WEDDING_DATE.month} {WEDDING_DATE.year}</> },
            { label: 'Ceremony', big: <>{WEDDING_DATE.ceremonyTime}<br />doors from {WEDDING_DATE.doorsTime}</> },
            {
              label: 'Venue',
              big: <>{VENUE.name}</>,
              small: VENUE.shortAddress + ', Nigeria'
            },
            {
              label: 'Dress code',
              big: <>{DRESS_CODE.label}</>,
              small: DRESS_CODE.note
            }
          ].map((card) => (
            <Reveal key={card.label} style={css('background:#efe8dd;padding:clamp(24px,3.4vw,38px);display:flex;flex-direction:column;gap:10px')}>
              <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#9a6f4c")}>
                {card.label}
              </span>
              <span style={css("font:300 clamp(24px,3vw,32px)/1.2 'Cormorant Garamond',serif")}>{card.big}</span>
              {card.small && (
                <span style={css("font:300 14px/1.7 'Jost',sans-serif;color:#6b6259")}>{card.small}</span>
              )}
            </Reveal>
          ))}
        </div>

        <div
          style={css(
            SHOW_GOOD_TO_KNOW
              ? 'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(32px,5vw,64px)'
              : 'display:grid;grid-template-columns:1fr;gap:clamp(32px,5vw,64px)'
          )}
        >
          <Reveal style={css('display:flex;flex-direction:column;gap:0')}>
            <h3 style={css("margin:0 0 22px;font:400 clamp(22px,2.8vw,28px)/1.2 'Cormorant Garamond',serif")}>
              The shape of the day
            </h3>
            {TIMELINE_READY ? (
              TIMELINE.map((row) => (
                <div key={row.time} style={css('display:flex;gap:20px;padding:14px 0;border-top:1px solid rgba(31,28,24,.12)')}>
                  <span style={css("flex:0 0 78px;font:400 13px/1.6 'Jost',sans-serif;color:#9a6f4c;font-variant-numeric:tabular-nums")}>
                    {row.time}
                  </span>
                  <span style={css("font:300 14.5px/1.6 'Jost',sans-serif;color:#3a352e")}>{row.what}</span>
                </div>
              ))
            ) : (
              <p style={comingSoonStyle}>Coming soon — we&apos;ll share the full schedule closer to the day.</p>
            )}
          </Reveal>
          {SHOW_GOOD_TO_KNOW && (
            <Reveal style={css('display:flex;flex-direction:column;gap:22px')}>
              <h3 style={css("margin:0;font:400 clamp(22px,2.8vw,28px)/1.2 'Cormorant Garamond',serif")}>Good to know</h3>
              {GUEST_INFO_READY ? (
                GUEST_INFO.map((item) => (
                  <div
                    key={item.label}
                    style={css('display:flex;flex-direction:column;gap:6px;padding-left:16px;border-left:1px solid rgba(154,111,76,.4)')}
                  >
                    <span style={css("font:500 10px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                      {item.label}
                    </span>
                    <span style={css("font:300 14.5px/1.7 'Jost',sans-serif;color:#3a352e")}>{item.body}</span>
                  </div>
                ))
              ) : (
                <p style={comingSoonStyle}>Coming soon — practical details will be posted here soon.</p>
              )}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
