import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { COUPLE, VENUE, WEDDING_DATE } from '@/content/wedding';

export const metadata: Metadata = {
  title: `${COUPLE.partner1} & ${COUPLE.partner2} — ${WEDDING_DATE.label}`,
  description: `Join ${COUPLE.partner1} and ${COUPLE.partner2} as they celebrate their wedding at ${VENUE.name} in ${VENUE.city} on ${WEDDING_DATE.label}.`,
  icons: {
    icon: '/images/logo-monogram.jpg',
    apple: '/images/logo-monogram.jpg'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
