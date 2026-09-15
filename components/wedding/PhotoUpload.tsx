'use client';

import { useRef, useState, type FormEvent } from 'react';
import { css } from '@/lib/css';
import { GALLERY } from '@/content/wedding';

type Result = { uploaded: number; failed: number };

export default function PhotoUpload({ onUploaded }: { onUploaded?: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState('');
  // null when idle; {done, total} while a batch is in flight, so the button can
  // say which photo of how many is going up rather than a generic spinner.
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const submitting = progress !== null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const files = Array.from(fileRef.current?.files ?? []);

    if (trimmedName.length < 2) {
      setError('Please tell us your name.');
      return;
    }
    if (files.length === 0) {
      setError('Please choose at least one photo to upload.');
      return;
    }

    setError('');
    setResult(null);
    setProgress({ done: 0, total: files.length });

    // Sent one at a time on purpose: /api/photos takes a single file per
    // request, and a phone on venue wifi uploading eight photos at once tends
    // to stall them all. Sequential keeps the progress count honest and lets a
    // single bad file fail without taking the rest of the batch with it.
    let uploaded = 0;
    let failed = 0;
    let lastError = '';

    for (const [i, file] of files.entries()) {
      try {
        const body = new FormData();
        body.set('name', trimmedName);
        body.set('caption', caption.trim());
        body.set('photo', file);

        const res = await fetch('/api/photos', { method: 'POST', body });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.error || 'Upload failed.');
        }
        uploaded += 1;
      } catch (err) {
        failed += 1;
        lastError = err instanceof Error ? err.message : 'Upload failed.';
      }
      setProgress({ done: i + 1, total: files.length });
    }

    setProgress(null);
    setResult({ uploaded, failed });

    if (uploaded > 0) {
      setCaption('');
      setFileNames([]);
      if (fileRef.current) fileRef.current.value = '';
      onUploaded?.();
    }
    // Only surface the underlying message when nothing got through — on a
    // partial batch the summary below already says how many missed.
    if (uploaded === 0 && failed > 0) setError(lastError);
  };

  const buttonLabel = progress
    ? progress.total > 1
      ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…`
      : 'Uploading…'
    : fileNames.length > 1
      ? `Upload ${fileNames.length} photos`
      : GALLERY.submitLabel;

  return (
    <form onSubmit={onSubmit} noValidate style={css('display:flex;flex-direction:column;gap:18px;text-align:left')}>
      <label style={css('display:flex;flex-direction:column;gap:9px')}>
        <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(31,28,24,.55)")}>
          Name
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder={GALLERY.uploadNamePlaceholder}
          autoComplete="name"
          style={css(
            "appearance:none;width:100%;box-sizing:border-box;background:none;border:0;border-bottom:1px solid rgba(31,28,24,.28);padding:12px 0;font:300 clamp(17px,2.2vw,21px)/1.4 'Cormorant Garamond',serif;color:#1f1c18"
          )}
        />
      </label>

      <label style={css('display:flex;flex-direction:column;gap:9px')}>
        <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(31,28,24,.55)")}>
          Caption
        </span>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={GALLERY.uploadCaptionPlaceholder}
          style={css(
            "appearance:none;width:100%;box-sizing:border-box;background:none;border:0;border-bottom:1px solid rgba(31,28,24,.28);padding:12px 0;font:300 clamp(17px,2.2vw,21px)/1.4 'Cormorant Garamond',serif;color:#1f1c18"
          )}
        />
        {fileNames.length > 1 && (
          <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:rgba(31,28,24,.5)")}>
            Applied to all {fileNames.length} photos.
          </span>
        )}
      </label>

      <label style={css('display:flex;flex-direction:column;gap:9px')}>
        <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:rgba(31,28,24,.55)")}>
          Photos
        </span>
        {/* No `capture` attribute on purpose: it makes phones open the camera
            straight away, but guests are almost always adding shots they have
            already taken. Leaving it off lets the OS offer both its camera and
            the photo library, and `multiple` lets them pick a batch at once. */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={(e) => {
            setFileNames(Array.from(e.target.files ?? []).map((f) => f.name));
            setError('');
            setResult(null);
          }}
          style={css("font:300 15px/1.6 'Jost',sans-serif;color:#1f1c18")}
        />
        {fileNames.length > 0 && (
          <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:rgba(31,28,24,.5)")}>
            {fileNames.length === 1 ? fileNames[0] : `${fileNames.length} photos selected`}
          </span>
        )}
      </label>

      {error && <span style={css("font:400 12px/1.5 'Jost',sans-serif;color:#b1502f")}>{error}</span>}

      <button
        type="submit"
        disabled={submitting}
        style={css(
          "align-self:flex-start;appearance:none;cursor:pointer;border:1px solid #1f1c18;background:#1f1c18;color:#faf7f1;padding:18px 36px;font:500 11px/1 'Jost',sans-serif;letter-spacing:.26em;text-transform:uppercase;transition:background .45s ease,color .45s ease"
        )}
      >
        {buttonLabel}
      </button>

      {result && result.uploaded > 0 && (
        <p style={css("margin:0;font:400 13px/1.6 'Jost',sans-serif;color:#7a8a6f")}>
          Thank you — {result.uploaded === 1 ? 'your photo is' : `${result.uploaded} photos are`} live in the
          gallery.
          {result.failed > 0 &&
            ` ${result.failed} couldn't be uploaded — you can try ${result.failed === 1 ? 'it' : 'them'} again.`}
        </p>
      )}
    </form>
  );
}
