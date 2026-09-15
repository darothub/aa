import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { COUPLE, VENUE, WEDDING_DATE } from '@/content/wedding';

const title = `${COUPLE.partner1} & ${COUPLE.partner2} — ${WEDDING_DATE.label}`;
const description = `Join ${COUPLE.partner1} and ${COUPLE.partner2} as they celebrate their wedding at ${VENUE.name} in ${VENUE.city} on ${WEDDING_DATE.label}.`;

export const metadata: Metadata = {
  title,
  description,
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

export default function RootLayout({ children }: { children: ReactNode }) {
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
      <body>{children}</body>
    </html>
  );
}
