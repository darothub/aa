import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import QrCard from './qr-card';
import { hasRole } from '@/lib/session';
import { COUPLE } from '@/content/wedding';

export const metadata: Metadata = {
  title: `Photo QR — ${COUPLE.partner1} & ${COUPLE.partner2}`,
  robots: { index: false, follow: false }
};

/**
 * The card to print for the venue: the QR that opens /upload, with the guest
 * code spelled out beneath it for anyone whose camera will not read a code.
 *
 * Couple-only, for one reason worth stating — it shows the guest passcode in
 * plain text. That is the point (you cannot print a code you cannot see), but
 * it means this page must never be reachable without the couple's own code.
 */
export default async function QrPage() {
  if (!(await hasRole('couple'))) notFound();

  const { env } = getCloudflareContext();
  return <QrCard guestPasscode={env.GUEST_PASSCODE ?? null} />;
}
