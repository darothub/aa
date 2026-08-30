import type { CSSProperties } from 'react';

/**
 * Turns a literal `"prop:value;prop2:value2"` string — the exact style text
 * carried over from the original prototype markup — into a React style
 * object. Lets the port keep the design's inline styles verbatim instead of
 * hand-transcribing ~800 lines of them into object literals, which is where
 * transcription bugs would otherwise creep in.
 */
export function css(input: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of input.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!prop || !value) continue;
    const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = value;
  }
  return out as CSSProperties;
}
