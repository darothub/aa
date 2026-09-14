# Photos to drop in here

The prototype's `<image-slot>` component only stores dropped photos inside the
omelette design tool's own bridge/sidecar file — they never became real image
files, so nothing could be carried over automatically. Add real files here
with these exact names and the site will pick them up:

- `hero-couple.jpg` — hero section, full-bleed photo of the couple
- `story-1.jpg` through `story-5.jpg` — the five "our story" carousel slides
- `closing-photo.jpg` — full-bleed closing section photo
- `logo-mark.jpg` — the gold "A A" monogram lockup, shown in the mobile nav
  drawer (see `content/wedding.ts`'s `LOGO` constant). Ships on a solid
  near-black background, so it only reads cleanly over dark surfaces — don't
  reuse it on the invitation sheet or details card without checking the
  background first.

Any reasonably large landscape/portrait JPEG or WebP works; the CSS already
handles cropping via `object-fit: cover`.

## Optional: video instead of the hero photo

The hero section can play a video instead of `hero-couple.jpg`. Drop an
`.mp4` in here and point `HERO_MEDIA.video` at it in
`web/content/wedding.ts` (e.g. `'/images/hero-video.mp4'`) — `hero-couple.jpg`
stays required either way, since it's what renders before the video is
configured, while it loads, and if the visitor's browser can't play it or
has requested reduced motion.
