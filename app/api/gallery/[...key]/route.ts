import { getCloudflareContext } from '@opennextjs/cloudflare';
import { hasRole } from '@/lib/session';

/**
 * Streams an uploaded photo out of R2 for the couple only. This is the route
 * that actually matters for privacy: gating the gallery page while leaving the
 * bytes readable would mean anyone holding a URL could still fetch the photo.
 *
 * Lives under /api/gallery rather than /api/photos so the whole private surface
 * sits on one path prefix, leaving POST /api/photos open for guests uploading.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  if (!(await hasRole('couple'))) return new Response('Not found', { status: 404 });

  const { key } = await params;
  const objectKey = key.join('/');

  const { env } = getCloudflareContext();
  const object = await env.EVENT_PHOTOS.get(objectKey);
  if (!object) return new Response('Not found', { status: 404 });

  return new Response(object.body, {
    headers: {
      'content-type': object.httpMetadata?.contentType || 'application/octet-stream',
      // Private: these must never be held in a shared cache, only the viewer's own.
      'cache-control': 'private, max-age=31536000, immutable'
    }
  });
}
