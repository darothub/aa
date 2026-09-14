'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '@/lib/css';
import { HASHTAG } from '@/content/wedding';

type Tone = 'light' | 'dark';

/** The two backgrounds the page alternates between: #1f1c18 and #efe8dd/#faf7f1. */
const TONES: Record<Tone, { ink: string; line: string }> = {
  light: { ink: '#faf7f1', line: 'rgba(250,247,241,.32)' },
  dark: { ink: '#9a6f4c', line: 'rgba(154,111,76,.42)' }
};

/**
 * The wedding hashtag as a small bordered chip. Tapping it copies the tag, so
 * a guest composing a post on their phone never has to retype it — the one
 * interaction this element can usefully offer. `text-transform:none` is set
 * deliberately: several of the places this sits are uppercase by design, and
 * #ALIGNEDINLOVE is much harder to read than #AlignedInLove.
 */
export default function Hashtag({ tone = 'dark', size = 12 }: { tone?: Tone; size?: number }) {
  const { ink, line } = TONES[tone];
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const chrome = css(
    `display:inline-flex;align-items:center;gap:10px;padding:9px 15px;border:1px solid ${line};color:${ink};font:500 ${size}px/1 'Jost',sans-serif;letter-spacing:.16em;text-transform:none;white-space:nowrap`
  );

  if (HASHTAG.exploreUrl) {
    return (
      <a href={HASHTAG.exploreUrl} target="_blank" rel="noopener" style={chrome}>
        {HASHTAG.tag}
      </a>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(HASHTAG.tag);
    } catch {
      // No clipboard (insecure context, or the guest declined): leave the
      // label alone rather than claiming a copy that did not happen.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${HASHTAG.tag} to your clipboard`}
      style={{ ...chrome, appearance: 'none', background: 'none', cursor: 'pointer' }}
    >
      <span>{HASHTAG.tag}</span>
      <span
        aria-hidden="true"
        style={css(
          `font:400 8.5px/1 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;opacity:.6;color:${ink}`
        )}
      >
        {copied ? 'copied' : 'copy'}
      </span>
    </button>
  );
}
