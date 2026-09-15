/**
 * Identifies an uploaded image from its leading bytes rather than from the
 * `type` the browser reports on the File, which is client-supplied and trivial
 * to forge — without this, `/api/photos` will store any 8MB blob that claims to
 * be a JPEG, and the R2 bucket becomes an open file host.
 *
 * Sniffing also fixes a real false rejection: phones fairly often hand over a
 * HEIC as `application/octet-stream` or with an empty type, which a check
 * against the declared MIME turns away even though the photo is perfectly
 * valid. The bytes are the authority in both directions.
 */

export type DetectedImage = { mime: string; ext: string };

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, start + length));

const startsWith = (bytes: Uint8Array, signature: number[]) =>
  signature.every((byte, i) => bytes[i] === byte);

// ISO base-media brands that carry HEIF/HEIC payloads. `mif1`/`msf1` are the
// generic image/sequence brands iPhones emit alongside the `heic`/`heix` ones.
const HEIF_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'heif', 'mif1', 'msf1']);

export function detectImage(buffer: ArrayBuffer): DetectedImage | null {
  const bytes = new Uint8Array(buffer);
  // Shortest signature we check needs 12 bytes (WebP / HEIF brand).
  if (bytes.length < 12) return null;

  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { mime: 'image/jpeg', ext: 'jpg' };

  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mime: 'image/png', ext: 'png' };
  }

  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
    return { mime: 'image/webp', ext: 'webp' };
  }

  // HEIC/HEIF: an ISO base-media file whose box type at offset 4 is `ftyp`,
  // with the brand that follows naming a HEIF flavour.
  if (ascii(bytes, 4, 4) === 'ftyp' && HEIF_BRANDS.has(ascii(bytes, 8, 4))) {
    return { mime: 'image/heic', ext: 'heic' };
  }

  return null;
}
