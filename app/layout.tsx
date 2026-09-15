import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { COUPLE, WEDDING_DATE } from '@/content/wedding';
import { RoleProvider } from '@/lib/role-context';
import { currentRole } from '@/lib/session';

const title = `${COUPLE.partner1} & ${COUPLE.partner2} — ${WEDDING_DATE.label}`;
// Deliberately vague about where. This is the only copy that reaches someone
// without a passcode — it is what a link preview shows in a chat thread — so it
// gives the occasion and the date and withholds the venue, which is the detail
// a gated site exists to keep among invited guests.
const description = `${COUPLE.partner1} and ${COUPLE.partner2} are getting married on ${WEDDING_DATE.label}. Strictly by invitation.`;

export const metadata: Metadata = {
  title,
  description,
  // The whole site sits behind a passcode; there is nothing here to index.
  robots: { index: false, follow: false },
  icons: {
    icon: '/images/logo-mark.jpg',
    apple: '/images/logo-mark.jpg'
  },
  openGraph: {
    title,
    description,
    images: ['/images/hero-couple.jpg'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/hero-couple.jpg']
  }
};

export const viewport = {
  themeColor: '#f7f3ec'
};

// Reads the session cookie to pass the role down, so pages render per request.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const role = await currentRole();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <RoleProvider role={role}>{children}</RoleProvider>
      </body>
    </html>
  );
}
