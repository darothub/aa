/**
 * Passcode sessions for the two audiences the site serves.
 *
 * `guest` is the code printed alongside the venue QR — it unlocks the site and
 * the photo upload. `couple` is private to Aisha and Abdul and additionally
 * unlocks the gallery of what guests have sent in.
 *
 * The session is an HMAC-signed cookie rather than anything stored server-side:
 * there is no session table to keep, and the Worker can verify a request on its
 * own. Signing matters — an unsigned `role=couple` cookie would be trivially
 * forged by anyone who opened devtools. Every private route verifies this on
 * the server; the splash overlay is only how a passcode gets entered, and hiding
 * a React component protects nothing on its own.
 */

export type Role = 'guest' | 'couple';

export const SESSION_COOKIE = 'aa_session';
const SESSION_DAYS = 30;

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return base64url(new Uint8Array(sig));
}

/** Length-independent compare, so a wrong guess leaks nothing through timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signSession(role: Role, secret: string): Promise<string> {
  const expires = Date.now() + SESSION_DAYS * 864e5;
  const payload = `${role}.${expires}`;
  return `${payload}.${await hmac(payload, secret)}`;
}

export async function verifySession(value: string | undefined, secret: string): Promise<Role | null> {
  if (!value) return null;
  const parts = value.split('.');
  if (parts.length !== 3) return null;
  const [role, expires, sig] = parts;
  if (role !== 'guest' && role !== 'couple') return null;

  const expected = await hmac(`${role}.${expires}`, secret);
  if (!safeEqual(sig, expected)) return null;
  if (!Number(expires) || Number(expires) < Date.now()) return null;

  return role;
}

/**
 * Which role a passcode buys, or null if it matches neither. Both comparisons
 * always run: returning early on a guest match would let the response time
 * distinguish "matched guest" from "matched nothing".
 *
 * Matching ignores case and surrounding whitespace. These codes are read off a
 * printed card and typed on a phone — where the keyboard's own capitalisation,
 * or a trailing space from a paste, is far likelier than an attacker — and the
 * guest code is semi-public by design anyway, so case adds no protection worth
 * the support calls it causes at a venue.
 *
 * toUpperCase() and not toLocaleUpperCase(): the former is locale-independent,
 * so a phone set to Turkish cannot turn an `i` into `İ` and lock its owner out.
 */
function normalise(value: string): string {
  return value.trim().toUpperCase();
}

export function roleForPasscode(
  input: string,
  codes: { guest?: string; couple?: string }
): Role | null {
  const given = normalise(input);
  const isCouple = !!codes.couple && safeEqual(given, normalise(codes.couple));
  const isGuest = !!codes.guest && safeEqual(given, normalise(codes.guest));
  if (isCouple) return 'couple';
  if (isGuest) return 'guest';
  return null;
}

/**
 * Clears the session. Same attributes as sessionCookie — a browser only
 * replaces a cookie when Path and the flags match, so an expiry written with
 * different attributes leaves the original sitting there.
 */
export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export function sessionCookie(value: string): string {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  // HttpOnly so client script cannot read or forge it; Lax keeps it attached to
  // ordinary navigations (including a QR scan landing on /upload) while leaving
  // it off cross-site POSTs.
  return `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}
