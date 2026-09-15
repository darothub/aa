import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { roleForPasscode, sessionCookie, signSession } from '@/lib/auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { passcode?: unknown } | null;
  const passcode = typeof body?.passcode === 'string' ? body.passcode.trim() : '';

  if (!passcode) {
    return NextResponse.json({ error: 'Please enter the passcode.' }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  const secret = env.SESSION_SECRET;
  if (!secret) {
    console.error('SESSION_SECRET is not set');
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  const role = roleForPasscode(passcode, { guest: env.GUEST_PASSCODE, couple: env.COUPLE_PASSCODE });
  if (!role) {
    // Deliberately vague, and identical for both codes: a wrong guess should not
    // reveal whether it was close to the guest code or the couple's.
    return NextResponse.json({ error: "That passcode doesn't look right." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role });
  res.headers.set('set-cookie', sessionCookie(await signSession(role, secret)));
  return res;
}
