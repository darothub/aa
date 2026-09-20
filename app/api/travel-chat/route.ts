import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import Anthropic from '@anthropic-ai/sdk';
import { COUPLE, DRESS_CODE, HASHTAG, HAS_DONATION_LINK, TRAVEL_REFERENCE, VENUE, WEDDING_DATE } from '@/content/wedding';

const MAX_MESSAGE_LENGTH = 300;
const MAX_HISTORY = 8;
const MODEL = 'claude-haiku-4-5-20251001';

type ChatMsg = { role: 'user' | 'assistant'; text: string };

/** The pre-encoded destination query both map URLs already use — reused so a
 * personalised directions link always points at the same place as the plain
 * ones, with no chance of the two drifting apart. */
const DESTINATION_QUERY = VENUE.googleMapsUrl.split('destination=')[1];

/**
 * Interpolates only the structured travel facts already shown on the page —
 * no guest input goes into the prompt except their question, so the model
 * has nothing to work with beyond what a guest could already read here.
 */
function buildSystemPrompt(isFirstTurn: boolean): string {
  return [
    `You are AA, the official wedding assistant for ${COUPLE.partner1} & ${COUPLE.partner2}'s wedding (${HASHTAG.tag}) on ${WEDDING_DATE.label}. You answer guests' frequently asked questions about the wedding — venue, timing, dress code, travel, gifts, and sharing photos.`,
    isFirstTurn
      ? "This is the guest's first message in this conversation. Open your reply with a short, warm one-sentence introduction using this exact format: \"Hi 👋🏿, I am AA, the wedding assistant for " +
        COUPLE.partner1 +
        " & " +
        COUPLE.partner2 +
        "'s big day. Ask me anything!\" Then answer their question."
      : "This is a continuing conversation — do not reintroduce yourself, just answer the question.",
    'Answer ONLY using the facts listed below. Keep answers to 2-3 short sentences.',
    "If a question asks for anything not covered by these facts (cost, timing changes, dietary needs, RSVP submission, anything else), say you don't have that detail and suggest the guest contact the couple directly. Never guess or invent an address, time, price, or instruction.",
    '',
    'FACTS:',
    `- Venue: ${VENUE.name}, ${VENUE.fullAddress}`,
    `- Neighbourhood: ${VENUE.district}, ${VENUE.city}`,
    `- Doors open: ${WEDDING_DATE.doorsTime}; ceremony begins: ${WEDDING_DATE.ceremonyTime}`,
    `- RSVP deadline: ${WEDDING_DATE.rsvpDeadline}`,
    `- Dress code: ${DRESS_CODE.label} — ${DRESS_CODE.note}`,
    `- Gifts: ${HAS_DONATION_LINK ? 'a gift/registry link is shared with guests separately (in the invitation or on this page) — say to look there rather than reading out a URL' : 'the registry link is in the invitation email'}`,
    `- Sharing photos: guests can post to the event gallery on this website, and are encouraged to tag posts with ${HASHTAG.tag}`,
    `- Distance from ${TRAVEL_REFERENCE.cityCentre.label}: about ${TRAVEL_REFERENCE.cityCentre.minutes} minutes`,
    `- Distance from ${TRAVEL_REFERENCE.airport.label}: about ${TRAVEL_REFERENCE.airport.minutes} minutes`,
    `- Google Maps directions to the venue: ${VENUE.googleMapsUrl}`,
    `- Apple Maps directions to the venue: ${VENUE.appleMapsUrl}`,
    '',
    'DIRECTIONS FROM A GUEST\'S LOCATION:',
    "If the guest tells you where they are travelling from (a place name, neighbourhood, or address), do not say you lack specific directions — instead reply with a personalised link built from the two templates below, replacing <ORIGIN> with exactly what the guest said, URL-encoded with + in place of spaces (for example \"Wuse 2\" becomes \"Wuse+2\"):",
    `- Google Maps: https://www.google.com/maps/dir/?api=1&origin=<ORIGIN>&destination=${DESTINATION_QUERY}`,
    `- Apple Maps: https://maps.apple.com/?saddr=<ORIGIN>&daddr=${DESTINATION_QUERY}&dirflg=d`,
    'Only fill in <ORIGIN> with what the guest actually typed — never invent or guess a starting point. If they have not said where they are coming from, share the two plain venue links above instead.',
    '',
    'PARKING & SHUTTLE:',
    'For questions about parking or shuttle availability, do not say you lack information. Instead, suggest the guest search "parking near me" or "closest bus stop near [venue location]" on Google Maps to see current, real-time options near the venue. The information changes frequently and Google Maps will have the most up-to-date options.',
    '',
    'LINKING TO SECTIONS ALREADY ON THIS PAGE:',
    "Several of the facts above are also shown as a full section further down this same page. When your answer is about one of those topics, end your reply with exactly one button token in this format: [[link:Short Label|#section-id]] — do not describe it as a URL, do not wrap it in a sentence, just append the token. Use only these ids, matched to what the guest actually asked about:",
    '- Dress code / attire: #details',
    '- RSVP: #rsvp',
    '- Map, directions: #travel',
    '- Gifts / registry: #closing',
    '- Guest book messages: #guestbook',
    '- Countdown / the date: #countdown',
    "- Sharing photos: this lives on a separate page, so use [[link:View the gallery|/gallery]] instead of a #section-id.",
    'Add at most one such token per reply, only when it is directly relevant, and never invent a section id not listed here.'
  ].join('\n');
}

function sanitizeHistory(input: unknown): ChatMsg[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m): m is ChatMsg =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.text === 'string' &&
        m.text.trim().length > 0 &&
        m.text.length <= MAX_MESSAGE_LENGTH
    )
    .slice(-MAX_HISTORY);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Please ask a shorter question.' }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return NextResponse.json({ error: 'The wedding assistant is not available right now.' }, { status: 500 });
  }

  const history = sanitizeHistory(body?.history);
  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: buildSystemPrompt(history.length === 0),
      messages: [
        ...history.map((m) => ({ role: m.role, content: m.text })),
        { role: 'user' as const, content: message }
      ]
    });

    const reply = response.content
      .find((block): block is Anthropic.TextBlock => block.type === 'text')
      ?.text?.trim();

    if (!reply) {
      return NextResponse.json({ error: 'Could not reach the wedding assistant right now.' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('travel-chat request failed', err);
    return NextResponse.json({ error: 'Could not reach the wedding assistant right now.' }, { status: 500 });
  }
}
