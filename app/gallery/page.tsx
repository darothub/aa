import type { Metadata } from 'next';
import GalleryClient from './gallery-client';
import { COUPLE } from '@/content/wedding';

export const metadata: Metadata = {
  title: `Gallery — ${COUPLE.partner1} & ${COUPLE.partner2}`
};

export default function GalleryPage() {
  return <GalleryClient />;
}
