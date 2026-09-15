import { NextResponse, type NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';

/**
 * The passcode gate. This runs before any page is rendered, which is the whole
 * point of doing it here rather than in a layout: a layout that declines to
 * render `children` still causes Next to render the page segment and serialise
 * it into the RSC payload, so the locked page's own HTML carried the venue, the
 * schedule and the rest of the copy in plain view-source. Rewriting here means
 * the page component never runs and none of its content reaches the response.
 *
 * Presentation-level hiding — a nav link behind a role check, an element with
 * `hidden` — is cosmetic and can be undone in devtools. This cannot: there is
 * nothing to reveal, because nothing was sent.
 */

// Reachable without a session: the gate itself, the endpoint that grants one,
// and the static assets the gate needs to render.
const PUBLIC_PATHS = ['/welcome', '/api/unlock'];

// Additionally require the couple's code.
const COUPLE_PATHS = ['/gallery', '/api/gallery', '/qr'];

function isUnder(pathname: string, roots: string[]) {
  return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Secrets are Worker bindings, not process env — `process.env.SESSION_SECRET`
  // reads as undefined here, which would send every request to the gate.
  const { env } = getCloudflareContext();
  const secret = env.SESSION_SECRET;

  if (isUnder(pathname, PUBLIC_PATHS)) return NextResponse.next();

  const role = secret
    ? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
    : null;

  // An API caller wants a status and JSON, not a page of HTML: rewriting these
  // to the gate would answer a fetch with 200 and a splash screen.
  const isApi = pathname.startsWith('/api/');

  if (!role) {
    if (isApi) {
      return NextResponse.json({ error: 'Please enter the passcode first.' }, { status: 401 });
    }
    // Rewrite, not redirect: the visitor keeps the URL they asked for, so
    // entering the code lands them where they were going.
    return NextResponse.rewrite(new URL('/welcome', request.url));
  }

  if (isUnder(pathname, COUPLE_PATHS) && role !== 'couple') {
    // 404 rather than 403 — a guest is told the route does not exist, not that
    // it exists and is barred, which is the kinder read as well as the safer one.
    return isApi
      ? NextResponse.json({ error: 'Not found.' }, { status: 404 })
      : NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next's own build output and the assets the gate itself
  // needs. `icon.jpg` is the app/icon.jpg favicon: the browser asks for it
  // before anyone has entered a code, and gating it served the gate's HTML as
  // the tab icon. These carry no private content — the monogram and the photo
  // already act as the public link preview.
  matcher: ['/((?!_next/static|_next/image|images/|favicon.ico|icon.jpg).*)']
};
