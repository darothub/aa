import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Streams an uploaded photo straight out of the R2 bucket. Exists because R2
 * buckets aren't public by default and this project has no CDN domain
 * pointed at one — routing reads through the Worker (which already holds
 * the binding) avoids provisioning anything beyond the bucket itself.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const objectKey = key.join('/');

  const { env } = getCloudflareContext();
  const object = await env.EVENT_PHOTOS.get(objectKey);
  if (!object) return new Response('Not found', { status: 404 });

  return new Response(object.body, {
    headers: {
      'content-type': object.httpMetadata?.contentType || 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable'
    }
  });
}
