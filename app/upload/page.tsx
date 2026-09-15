import type { Metadata } from 'next';
import UploadClient from './upload-client';
import { COUPLE } from '@/content/wedding';

export const metadata: Metadata = {
  title: `Share your photos — ${COUPLE.partner1} & ${COUPLE.partner2}`
};

// Open to everyone who made it past the splash; the API re-checks the session
// on the request that actually stores anything.
export default function UploadPage() {
  return <UploadClient />;
}
