import type { ReactNode } from 'react';

// The one place that knows the couple's names, the date, the venue and the
// story copy. Every component that used to hardcode one of these imports it
// from here instead — see the components in `components/wedding/` for the
// call sites this replaced.

export const COUPLE = {
  partner1: 'Aisha',
  partner2: 'Abdul'
};

export const WEDDING_DATE = {
  /** Feeds the live countdown — must stay in sync with the label fields below. */
  iso: '2026-11-21T14:00:00+01:00',
  weekday: 'Saturday',
  day: '21',
  month: 'November',
  year: '2026',
  label: 'Saturday 21 November 2026',
  shortLabel: '21 . 11 . 2026',
  doorsTime: '1:15 pm',
  ceremonyTime: '2:00 pm',
  rsvpDeadline: '24 October 2026'
};

export const VENUE = {
  name: 'Rainbow Event Marquee',
  /** The neighbourhood, for the Travel copy that talks about the area rather than the building. */
  district: 'Garki',
  city: 'Abuja',
  shortAddress: 'Area 8, Garki, Abuja',
  fullAddress: 'Area 8, Plot 1193a, off Southern Parkway, Garki, Abuja, Federal Capital Territory, Nigeria',
  /**
   * APPROXIMATE — the centre of Area 8, Garki, not a surveyed pin for Plot
   * 1193a. Only the map marker and the "estimate my drive" straight-line
   * distance use these; the two map links below are built from the address
   * text, so directions stay correct regardless. Replace with the exact pair
   * from a dropped pin in Google Maps when you have it.
   */
  lat: 9.0322,
  lng: 7.4869,
  mapPopupHtml: '<strong>Rainbow Event Marquee</strong><br>Area 8, Garki, Abuja',
  googleMapsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Rainbow+Event+Marquee%2C+Area+8%2C+Plot+1193a%2C+off+Southern+Parkway%2C+Garki%2C+Abuja',
  appleMapsUrl:
    'https://maps.apple.com/?daddr=Rainbow+Event+Marquee%2C+Area+8%2C+Plot+1193a%2C+off+Southern+Parkway%2C+Garki%2C+Abuja&dirflg=d'
};

/**
 * The fallback drive times Travel.tsx quotes when a visitor declines to share
 * their location. Estimates, not measurements — adjust once you have driven it.
 */
export const TRAVEL_REFERENCE = {
  cityCentre: { label: 'Central Business District', minutes: 10 },
  airport: { label: 'Nnamdi Azikiwe International Airport', minutes: 40 }
};

/**
 * The gold interlocking-monogram lockup — "A A", a heart, and the hashtag
 * baked into the artwork itself. It ships on a solid near-black background,
 * so it only reads cleanly over dark surfaces. Placed full-size in the mobile
 * nav drawer (`components/wedding/Header.tsx`, background already
 * near-black), as a small badge with its own matching dark background in the
 * desktop header brand mark (same file, replacing the old "A & A" text), as
 * the closing section's own background (`components/wedding/Closing.tsx`),
 * and cropped for the browser tab icon (`app/icon.jpg`). See
 * `public/images/README.md` for the file this points at.
 */
export const LOGO = {
  src: '/images/logo-mark.jpg',
  alt: `${COUPLE.partner1} & ${COUPLE.partner2} monogram`
};

export const DRESS_CODE = {
  label: 'Formal / cocktail',
  note: 'Warm neutrals, deep greens and gold are very welcome.'
};

/**
 * The wedding hashtag. `tag` carries its own '#' and its own capitalisation —
 * anywhere it lands inside uppercase-styled copy, the call site must override
 * `text-transform`, or guests get #ALIGNEDINLOVE and lose the word breaks.
 *
 * Rendered by `components/wedding/Hashtag.tsx`, which is the only place that
 * decides how it looks. Set `exploreUrl` to a real feed
 * (e.g. 'https://www.instagram.com/explore/tags/alignedinlove/') to turn the
 * chip into a link; left null it copies the tag to the clipboard instead, so
 * it never sends a guest to an empty feed before the day.
 */
export const HASHTAG: { tag: string; invite: string; exploreUrl: string | null } = {
  tag: '#AlignedInLove',
  invite: 'Post your photographs with it and we will find every one.',
  exploreUrl: null
};

/**
 * Copy for the guest book section (`components/wedding/GuestBook.tsx`),
 * which saves each message to the `guestbook_messages` table via
 * `/api/guestbook`.
 */
export const GUESTBOOK = {
  heading: 'Messages for the couple',
  subhead: `Leave ${COUPLE.partner1} & ${COUPLE.partner2} a note — it becomes part of the story.`,
  namePlaceholder: 'Your name',
  messagePlaceholder: 'Write a few words for the couple…',
  submitLabel: 'Leave a message',
  successNote: 'Thank you — your message has been saved.',
  emptyState: 'Be the first to leave a message.'
};

export type DonationLink = { url: string; label: string };

/**
 * Hosted payment links for the "gifts" line, rendered by
 * `components/wedding/DonationLinks.tsx`. Each is independently optional:
 *
 * - Both null (the default): the "registry link is in your invitation
 *   email" text is shown instead, unchanged.
 * - One set: that link renders directly, no toggle.
 * - Both set: guests see both links side by side and pick whichever card
 *   they're paying with, so the money lands in the account that matches
 *   the link they chose.
 *
 * Nothing here talks to a server — these are hosted payment-provider pages
 * (a Stripe Payment Link, a Paystack payment page, etc.) created outside
 * this codebase. Paste the finished URL in; there is no code left to write
 * once you have both links.
 */
export const DONATION_LINKS: { foreign: DonationLink | null; ngn: DonationLink | null } = {
  foreign: { url: 'https://donate.stripe.com/8x2fZj60RfNC5p8gWV4ko00', label: 'Support (€/£/$)' },
  ngn: { url: 'https://paystack.shop/pay/8596j15rdz', label: 'Support (₦)' }
};

/**
 * Precomputed once so callers don't each restate the "is there a live
 * payment link" check independently — this used to be copy-pasted into both
 * Details.tsx and Closing.tsx as the donation panel moved between sections,
 * and drifted out of sync with the actual render site in the process.
 */
export const HAS_DONATION_LINK = Boolean(DONATION_LINKS.foreign || DONATION_LINKS.ngn);

/**
 * The full-bleed photo/video at the top of Hero.tsx. `poster` is required —
 * it's what renders on first paint, while the browser decides whether to
 * play `video`, and it's the only thing that renders at all until a real
 * video file exists. Set `video` to a path under `/public/images` (e.g.
 * '/images/hero-couple.mp4') to play it instead once that file is dropped
 * in; Hero.tsx falls back to the poster image if the browser can't play it,
 * or if the visitor has requested reduced motion.
 */
export const HERO_MEDIA: { video: string | null; poster: string } = {
  video: '/images/hero-couple.mp4',
  poster: '/images/hero-couple.jpg'
};

export type StorySlide = {
  id: string;
  era: string;
  title: string;
  body: ReactNode;
  placeholder: string;
  /** Vertical focal point for the cropped photo, as a CSS object-position Y value. Defaults to '50%' (centered) when omitted. */
  focalY?: string;
};

/**
 * Copy and config for the live event gallery
 * (`app/gallery/page.tsx`, `components/wedding/GalleryGrid.tsx`,
 * `components/wedding/PhotoUpload.tsx`). Photos guests upload there go to
 * R2 (the `EVENT_PHOTOS` binding in `wrangler.toml`) and are listed via
 * `/api/photos`.
 *
 * `googlePhotosAlbumUrl` is a secondary, always-available place to post
 * photos — create a shared Google Photos album, turn on "anyone with the
 * link can add photos", and paste the share URL here. Left null, the
 * gallery page just omits that option.
 */
/**
 * The passcode screen every visitor lands on (`components/wedding/SplashGate.tsx`).
 * The guest code goes on the invitation and beside the venue QR; the couple's
 * is private and additionally unlocks the gallery. Both are Worker secrets
 * (GUEST_PASSCODE / COUPLE_PASSCODE), never values in this file.
 *
 * Wording stays neutral about there being more than one code — a guest should
 * never be told they are holding the lesser one.
 */
export const GATE = {
  hint: 'Enter the code from your invitation to come in.',
  label: 'Invitation code',
  placeholder: 'Your code',
  submit: 'Enter',
  checking: 'Checking…',
  error: "That code doesn't look right — check your invitation."
};

export const GALLERY = {
  heading: 'Photographs from the day',
  subhead: 'Everything guests have sent in from the day, in one place.',
  uploadNamePlaceholder: 'Your name',
  uploadCaptionPlaceholder: 'Add a caption (optional)',
  submitLabel: 'Upload photo',
  emptyState: 'No photos yet — be the first to add one.',
  uploadHeading: 'Share your photos',
  uploadSubhead:
    'Taken something you love? Send it straight to Aisha and Abdul.',
  viewGalleryLabel: 'See everyone’s photos',
  googlePhotosAlbumUrl: null as string | null,
  googlePhotosLabel: 'View the shared Google Photos album'
};

export const STORY_SLIDES: StorySlide[] = [
  {
    id: 'story-1',
    era: '2023 — The beginning',
    title: 'The First Tulips 🌷',
    body: "Long phone calls.\n" +
        "Big dreams. Travel plans. Likes, dislikes… and, of course, the very important height compatibility check.\n" +
        "\n" +
        "Then came Porto the first meeting, the first moments that turned all those conversations into something real.\n" +
        "\n" +
        "And somewhere in the middle of it all came the first tulips. 🌷\n" +
        "\n" +
        "A simple bunch of flowers, perhaps, but they became a little marker of the beginning when curiosity was becoming friendship, friendship was becoming affection, and two people were starting to realise that this story might actually be going somewhere.\n" +
        "\n" +
        "The adventure had officially begun… with Porto, plenty of conversation, and a few tulips along for the ride.",
    placeholder: '2023 — The beginning — photo'
  },
  {
    id: 'story-2',
    era: '2024 — The sea calls',
    title: 'Titanic ✈️🌊',
    body: 'New streets, new views, shared adventures, plenty of laughter, and the first real taste of what it felt like to explore the world side by side. It was no longer just conversations about places we wanted to see; we were finally making those memories together.\n' +
        '\n' +
        'For a while, the waters felt beautifully calm.\n' +
        '\n' +
        'But every good voyage eventually meets a little turbulence.\n' +
        '\n' +
        'There were stronger waves, unexpected turns, and moments when sailing together required more than laughter and good weather. We had to learn how to listen better, understand each other differently, and hold steady when the sea wasn\'t quite as peaceful.\n' +
        '\n' +
        'And somehow, we did.\n' +
        '\n' +
        'The waves came, the ship rocked, but the journey continued.\n' +
        '\n' +
        'Malta may have been our first trip together, but 2024 became the year we learned that travelling together was easy when the sun was shining  and loving together meant learning how to navigate the storms too.',
    placeholder: '2024 — The treat, the gifts and travels — photo',
    focalY: '35%'
  },
  {
    id: 'story-3',
    era: '2025 — Home coming',
    title: 'Labe igi Orombo',
    body: 'By 2025, we were no longer inexperienced sailors. We had learned the waters, understood our ship better, and most importantly, understood each other.\n' +
        '\n' +
        'The waves no longer frightened us. We knew that rough seas would come and go, but we also knew how to navigate them together. This was the year we steadied the ship more experienced, more confident, and much less afraid of whatever the ocean might bring.',
    placeholder: '2025 — Home coming — photo'
  },
  {
    id: 'story-4',
    era: '2026 — The question',
    title: 'Asked badly, answered immediately',
    body: 'And now, we sail further.\n' +
        '\n' +
        'We have reached a place where we understand that love is not always about perfect weather or endless smooth sailing. Sometimes we are offshore, discovering new waters together; sometimes we return to shore to rest, reflect, and find our footing.\n' +
        '\n' +
        'But wherever the journey takes us, we are no longer bothered by every change in the tide.\n' +
        '\n' +
        'We have travelled far enough together to know that the beauty was never simply in having calm waters.\n' +
        '\n' +
        'It was in learning how to sail them together.',
    placeholder: '2025 — The question — photo'
  },
  {
    id: 'story-5',
    era: '2026 — November',
    title: 'Everyone we love, one room',
    body: 'The love story continues',
    placeholder: '2026 — November — photo'
  }
];
