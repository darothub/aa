import { NextResponse } from 'next/server';
import { clearedSessionCookie } from '@/lib/auth';

/**
 * Ends the session. POST rather than GET so it cannot be triggered by something
 * merely loading a URL — an <img src="/api/leave"> in a guest book entry would
 * otherwise sign people out for sport.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set('set-cookie', clearedSessionCookie());
  return res;
}
