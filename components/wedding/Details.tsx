import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';

const TIMELINE = [
  { time: '1:15 pm', what: 'Doors open — seating and refreshments' },
  { time: '2:00 pm', what: 'Ceremony begins, promptly' },
  { time: '3:15 pm', what: 'Photographs and cocktails on the terrace' },
  { time: '5:00 pm', what: 'Reception and dinner service' },
  { time: '7:30 pm', what: 'Speeches, then the first dance' },
  { time: '10:30 pm', what: 'Send-off, and the last shuttle home' }
];

const GUEST_INFO = [
  { label: 'Parking', body: 'Complimentary valet and secure on-site parking from 12:45pm.' },
  { label: 'Shuttle & transport', body: 'Coaches depart Transcorp Hilton at 1:00pm and return at 10:30pm.' },
  {
    label: 'Nearby hotels',
    body: 'Room blocks held at Transcorp Hilton and Fraser Suites — mention "Aishat & Abdul" when booking.'
  },
  { label: 'Gifts', body: 'Your presence is the gift. If you insist, the registry link is in your invitation email.' },
  {
    label: 'Children',
    body: 'An adult celebration, with one exception: our nieces and nephews. Childcare available on request.'
  },
  { label: 'Dietary requirements', body: 'Halal throughout, with vegetarian and gluten-free menus. Tell us when you reply.' }
];

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
            { label: 'Date', big: <>Saturday<br />21 November 2026</> },
            { label: 'Ceremony', big: <>2:00 pm<br />doors from 1:15</> },
            {
              label: 'Venue',
              big: <>Aso Rock<br />Banquet Hall</>,
              small: 'Asokoro District, Abuja, Nigeria'
            },
            {
              label: 'Dress code',
              big: <>Formal /<br />cocktail</>,
              small: 'Warm neutrals, deep greens and gold very welcome.'
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

        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(32px,5vw,64px)')}>
          <Reveal style={css('display:flex;flex-direction:column;gap:0')}>
            <h3 style={css("margin:0 0 22px;font:400 clamp(22px,2.8vw,28px)/1.2 'Cormorant Garamond',serif")}>
              The shape of the day
            </h3>
            {TIMELINE.map((row) => (
              <div key={row.time} style={css('display:flex;gap:20px;padding:14px 0;border-top:1px solid rgba(31,28,24,.12)')}>
                <span style={css("flex:0 0 78px;font:400 13px/1.6 'Jost',sans-serif;color:#9a6f4c;font-variant-numeric:tabular-nums")}>
                  {row.time}
                </span>
                <span style={css("font:300 14.5px/1.6 'Jost',sans-serif;color:#3a352e")}>{row.what}</span>
              </div>
            ))}
          </Reveal>
          <Reveal style={css('display:flex;flex-direction:column;gap:22px')}>
            <h3 style={css("margin:0;font:400 clamp(22px,2.8vw,28px)/1.2 'Cormorant Garamond',serif")}>Good to know</h3>
            {GUEST_INFO.map((item) => (
              <div
                key={item.label}
                style={css('display:flex;flex-direction:column;gap:6px;padding-left:16px;border-left:1px solid rgba(154,111,76,.4)')}
              >
                <span style={css("font:500 10px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#9a6f4c")}>
                  {item.label}
                </span>
                <span style={css("font:300 14.5px/1.7 'Jost',sans-serif;color:#3a352e")}>{item.body}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
