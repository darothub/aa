# Photos to drop in here

The prototype's `<image-slot>` component only stores dropped photos inside the
omelette design tool's own bridge/sidecar file — they never became real image
files, so nothing could be carried over automatically. Add real files here
with these exact names and the site will pick them up:

- `hero-couple.jpg` — hero section, full-bleed photo of the couple
- `story-1.jpg` through `story-5.jpg` — the five "our story" carousel slides
- `closing-photo.jpg` — full-bleed closing section photo

Any reasonably large landscape/portrait JPEG or WebP works; the CSS already
handles cropping via `object-fit: cover`.
