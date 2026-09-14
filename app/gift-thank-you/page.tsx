import type { Metadata } from 'next';
import Link from 'next/link';
import { css } from '@/lib/css';
import { COUPLE, LOGO } from '@/content/wedding';

export const metadata: Metadata = {
  title: `Thank you — ${COUPLE.partner1} & ${COUPLE.partner2}`
};

/**
 * Static landing page for Stripe/Paystack to redirect a guest back to after
 * a hosted payment completes. Both providers' hosted checkout pages accept a
 * post-payment redirect URL configured on the link itself (Stripe: the
 * Payment Link's "After payment" setting in its dashboard; Paystack:
 * the link's callback/success URL) — nothing in this repo can set that,
 * since the link is created and owned entirely on the provider's site. Once
 * a DONATION_LINKS entry is created, point its "after payment" redirect at
 * this page's URL.
 */
export default function GiftThankYouPage() {
  return (
    <main
      style={css(
        'min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:48px 24px;text-align:center;background:#faf7f1;color:#1f1c18'
      )}
    >
      <img
        src={LOGO.src}
        alt={LOGO.alt}
        style={css('width:64px;height:64px;border-radius:9999px;object-fit:cover')}
      />
      <h1 style={css("font:400 32px/1.2 'Cormorant Garamond',serif;margin:0")}>
        Thank you
      </h1>
      <p style={css("font:400 16px/1.6 'Jost',sans-serif;max-width:440px;color:#5a5248;margin:0")}>
        Your gift means the world to {COUPLE.partner1} and {COUPLE.partner2}. Thank you for
        celebrating with us.
      </p>
      <Link
        href="/"
        style={css(
          "font:500 13px/1 'Jost',sans-serif;text-decoration:underline;color:#9a6f4c;margin-top:8px"
        )}
      >
        Return to the wedding site
      </Link>
    </main>
  );
}
