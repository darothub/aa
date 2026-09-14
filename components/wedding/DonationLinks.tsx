'use client';

import { css } from '@/lib/css';
import { DONATION_LINKS, type DonationLink } from '@/content/wedding';

const linkStyleLight = css(
  "font:500 13px/1 'Jost',sans-serif;text-decoration:underline;color:#9a6f4c"
);
const linkStyleDark = css(
  "font:500 13px/1 'Jost',sans-serif;text-decoration:underline;color:#c39a72"
);

const pillStyleLight = css(
  "display:inline-block;text-decoration:none;cursor:pointer;padding:10px 18px;font:500 11px/1 'Jost',sans-serif;letter-spacing:.1em;text-transform:uppercase;border:1px solid #9a6f4c;color:#9a6f4c;background:transparent"
);
const pillStyleDark = css(
  "display:inline-block;text-decoration:none;cursor:pointer;padding:10px 18px;font:500 11px/1 'Jost',sans-serif;letter-spacing:.1em;text-transform:uppercase;border:1px solid #c39a72;color:#c39a72;background:transparent"
);

/**
 * Renders whichever of DONATION_LINKS.foreign / .ngn are actually set. Zero
 * set: renders nothing. Each option is its own direct link straight to that
 * hosted payment page — one click, no intermediate "continue" step, and no
 * local selection state to manage.
 *
 * `dark` swaps the brown accent for the lighter gold already used on
 * Closing's near-black background, so the link stays legible there.
 */
export default function DonationLinks({ dark = false }: { dark?: boolean }) {
  const options = [DONATION_LINKS.foreign, DONATION_LINKS.ngn].filter(
    (link): link is DonationLink => link !== null
  );

  if (options.length === 0) return null;
  if (options.length === 1) {
    return (
      <a href={options[0].url} target="_blank" rel="noopener" style={dark ? linkStyleDark : linkStyleLight}>
        {options[0].label}
      </a>
    );
  }

  return (
    <span style={css('display:inline-flex;flex-wrap:wrap;gap:10px')}>
      {options.map((opt) => (
        <a key={opt.label} href={opt.url} target="_blank" rel="noopener" style={dark ? pillStyleDark : pillStyleLight}>
          {opt.label}
        </a>
      ))}
    </span>
  );
}
