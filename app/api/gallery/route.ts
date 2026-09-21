import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { deletePhotos, listPhotos } from '@/lib/db';
import { hasRole } from '@/lib/session';

export async function GET() {
  if (!(await hasRole('couple'))) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  try {
    const photos = await listPhotos();
    return NextResponse.json({
      photos: photos.map((p) => ({
        id: p.id,
        url: `/api/gallery/${p.key}`,
        uploaderName: p.uploaderName,
        caption: p.caption,
        createdAt: p.createdAt
      }))
    });
  } catch (err) {
    console.error('photo list failed', err);
    return NextResponse.json({ error: 'Could not load photos right now.' }, { status: 500 });
  }
}

/**
 * Deletes one or more photos: the database row first, then the matching R2
 * object(s). Row-first so a photo can never outlive its own database record —
 * if the R2 delete then fails, the gallery has correctly stopped listing it
 * and an orphaned object is left in storage rather than a broken listed photo.
 */
export async function DELETE(request: Request) {
  if (!(await hasRole('couple'))) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown): id is number => typeof id === 'number')
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: 'No photos selected.' }, { status: 400 });
  }

  try {
    const keys = await deletePhotos(ids);
    const { env } = getCloudflareContext();
    await Promise.all(keys.map((key) => env.EVENT_PHOTOS.delete(key)));
    return NextResponse.json({ ok: true, deleted: keys.length });
  } catch (err) {
    console.error('photo delete failed', err);
    return NextResponse.json({ error: 'Could not delete photo(s) right now.' }, { status: 500 });
  }
}
