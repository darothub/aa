import { NextResponse } from 'next/server';
import { insertRsvp, type Attending } from '@/lib/db';

function isAttending(value: unknown): value is Attending {
  return value === 'yes' || value === 'no';
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const attending = body?.attending;

  if (name.length < 2) {
    return NextResponse.json(
      { error: 'Please tell us your name as it appears on your invitation.' },
      { status: 400 }
    );
  }
  if (!isAttending(attending)) {
    return NextResponse.json({ error: 'Let us know if you can make it.' }, { status: 400 });
  }

  try {
    await insertRsvp(name, attending);
  } catch (err) {
    console.error('rsvp insert failed', err);
    return NextResponse.json(
      { error: 'Something went wrong saving your reply. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
