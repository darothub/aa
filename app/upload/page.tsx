import type { Metadata } from 'next';
import UploadClient from './upload-client';
import { COUPLE } from '@/content/wedding';

export const metadata: Metadata = {
  title: `Share your photos — ${COUPLE.partner1} & ${COUPLE.partner2}`
};

export default function UploadPage() {
  return <UploadClient />;
}
