import type { Metadata } from 'next';
import { Suspense } from 'react';
import InvitationSheet from '@/components/wedding/InvitationSheet';

export const metadata: Metadata = {
  title: 'Invitation — Aishat & Abdul'
};

export default function InvitationPage() {
  return (
    <Suspense fallback={null}>
      <InvitationSheet />
    </Suspense>
  );
}
