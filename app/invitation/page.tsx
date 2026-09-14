import type { Metadata } from 'next';
import { Suspense } from 'react';
import InvitationSheet from '@/components/wedding/InvitationSheet';
import { COUPLE } from '@/content/wedding';

export const metadata: Metadata = {
  title: `Invitation — ${COUPLE.partner1} & ${COUPLE.partner2}`
};

export default function InvitationPage() {
  return (
    <Suspense fallback={null}>
      <InvitationSheet />
    </Suspense>
  );
}
