import type { Metadata } from 'next';
import SplashGate from '@/components/wedding/SplashGate';

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

/**
 * The gate, served in place of whatever page was requested (see middleware.ts).
 * It is its own route so that the requested page is never rendered — rendering
 * it and hiding it would leave its content in the RSC payload.
 */
export default function WelcomePage() {
  return <SplashGate />;
}
