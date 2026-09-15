import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GalleryClient from './gallery-client';
import { hasRole } from '@/lib/session';
import { COUPLE } from '@/content/wedding';

export const metadata: Metadata = {
  title: `Gallery — ${COUPLE.partner1} & ${COUPLE.partner2}`,
  robots: { index: false, follow: false }
};

export default async function GalleryPage() {
  // A guest is already past the splash, so this is the check that matters.
  // notFound() rather than a "forbidden" page: the route simply does not exist
  // for anyone without the couple's code.
  if (!(await hasRole('couple'))) notFound();
  return <GalleryClient />;
}
