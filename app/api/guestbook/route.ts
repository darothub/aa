import { NextResponse } from 'next/server';
import { insertMessage, listMessages } from '@/lib/db';

const MAX_MESSAGE_LENGTH = 500;

/**
 * Catches obvious junk (empty, a single repeated character, no letters at
 * all) without trying to judge whether a short, real message is
 * "meaningful" — that call is left to the person writing it.
 */
function isMeaningful(message: string): boolean {
  if (message.length < 3 || message.length > MAX_MESSAGE_LENGTH) return false;
  if (!/[a-zA-Z]/.test(message)) return false;
  if (/^(.)\1*$/.test(message)) return false;
  return true;
}

export async function GET() {
  try {
    const messages = await listMessages();
    return NextResponse.json({ messages });
  } catch (err) {
    console.error('guestbook list failed', err);
    return NextResponse.json({ error: 'Could not load messages right now.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please tell us your name.' }, { status: 400 });
  }
  if (!isMeaningful(message)) {
    return NextResponse.json(
      { error: 'Please write a short message for the couple.' },
      { status: 400 }
    );
  }

  try {
    await insertMessage(name, message);
  } catch (err) {
    console.error('guestbook insert failed', err);
    return NextResponse.json(
      { error: 'Something went wrong saving your message. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
