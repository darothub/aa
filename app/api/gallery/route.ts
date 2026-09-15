import { NextResponse } from 'next/server';
import { listPhotos } from '@/lib/db';
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
