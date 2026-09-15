import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { randomUUID } from 'crypto';
import { insertPhoto } from '@/lib/db';
import { detectImage } from '@/lib/image-type';
import { hasRole } from '@/lib/session';

const MAX_FILE_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  // Either passcode may upload — the guest code is the one printed beside the
  // venue QR. This is also what stops the endpoint being an open file drop for
  // anyone who happens to find the URL.
  if (!(await hasRole('guest', 'couple'))) {
    return NextResponse.json({ error: 'Please enter the passcode first.' }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get('photo');
  const name = typeof form?.get('name') === 'string' ? String(form.get('name')).trim() : '';
  const caption = typeof form?.get('caption') === 'string' ? String(form.get('caption')).trim() : '';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Please choose a photo to upload.' }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'That photo is too large (8MB max).' }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: 'Please tell us your name.' }, { status: 400 });
  }

  // Read once, then identify from the bytes themselves — `file.type` is whatever
  // the client chose to send and is not evidence of anything. Everything after
  // this point uses the detected type, so a forged header cannot influence the
  // stored extension or the content-type we later serve the object back with.
  const buffer = await file.arrayBuffer();
  const detected = detectImage(buffer);
  if (!detected) {
    return NextResponse.json({ error: 'Please upload a JPEG, PNG, WEBP or HEIC photo.' }, { status: 400 });
  }

  const key = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${detected.ext}`;

  try {
    const { env } = getCloudflareContext();
    await env.EVENT_PHOTOS.put(key, buffer, {
      httpMetadata: { contentType: detected.mime }
    });
    await insertPhoto(key, name, caption);
  } catch (err) {
    console.error('photo upload failed', err);
    return NextResponse.json(
      { error: 'Something went wrong uploading your photo. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
