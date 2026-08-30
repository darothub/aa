'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRevealOnce } from '@/lib/hooks';

type Tag = 'div' | 'h2' | 'p';

export default function Reveal({
  as = 'div',
  children,
  style
}: {
  as?: Tag;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const [ref, shown] = useRevealOnce<HTMLElement>();
  const Tag = as as any;
  return (
    <Tag ref={ref} data-reveal="" {...(shown ? { 'data-shown': '' } : {})} style={style}>
      {children}
    </Tag>
  );
}
