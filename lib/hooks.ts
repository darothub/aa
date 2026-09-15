'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export function useSolidNav(threshold = 90): boolean {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return solid;
}

/** Scroll-linked transform on a ref, skipped for reduced-motion and low-power devices. */
export function useScrollTransform(ref: RefObject<HTMLElement>, compute: (scrollY: number) => number): void {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = window.innerWidth < 700 || (navigator.hardwareConcurrency ?? 8) <= 4;
    if (reduced || lite) return;
    let raf = 0;
    const apply = () => {
      const node = ref.current;
      if (node) node.style.transform = `translate3d(0, ${compute(window.scrollY)}px, 0)`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref, compute]);
}

export type CountdownState = {
  past: boolean;
  sameDay: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calcCountdown(iso: string): CountdownState {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const d = target - now;
  if (d <= 0) {
    return { past: true, sameDay: now - target < 864e5, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    past: false,
    sameDay: false,
    days: Math.floor(d / 864e5),
    hours: Math.floor(d / 36e5) % 24,
    minutes: Math.floor(d / 6e4) % 60,
    seconds: Math.floor(d / 1e3) % 60
  };
}

// Starts at a fixed placeholder so server and first client render agree (Date.now()
// would otherwise differ between the server render and the client hydration render,
// and the mismatched days/hours/minutes/seconds text is what trips React's hydration
// error). The real value is filled in by the effect right after mount, then refreshed
// every second — the same "false-until-mount" pattern Hero.tsx uses for its video flag.
const INITIAL_COUNTDOWN: CountdownState = { past: false, sameDay: false, days: 0, hours: 0, minutes: 0, seconds: 0 };

export function useCountdown(iso: string): CountdownState {
  const [state, setState] = useState<CountdownState>(INITIAL_COUNTDOWN);
  useEffect(() => {
    setState(calcCountdown(iso));
    const id = setInterval(() => setState(calcCountdown(iso)), 1000);
    return () => clearInterval(id);
  }, [iso]);
  return state;
}

export function countdownMessage(c: CountdownState): { message: string; subMessage: string } {
  if (c.past && c.sameDay) {
    return {
      message: 'Today. It is finally today.',
      subMessage: 'Doors from 1:15pm, ceremony at 2:00. Come as you are, only slightly better dressed.'
    };
  }
  if (c.past) {
    return {
      message: 'We did it — thank you for being there.',
      subMessage: 'Photographs are on their way. Every one of you made that room what it was.'
    };
  }
  if (c.days > 100) {
    return {
      message: `${c.days} days until we make it official.`,
      subMessage: 'Plenty of time. Which is exactly what we said 100 days ago.'
    };
  }
  if (c.days > 30) {
    return {
      message: `${c.days} days until we make it official.`,
      subMessage: 'Strictly by invitation'
    };
  }
  if (c.days > 7) {
    return {
      message: `Just ${c.days} days to go.`,
      subMessage: 'The tailor has been paid. The playlist is nearly settled. Nearly.'
    };
  }
  if (c.days > 1) {
    return {
      message: `${c.days} days. We are counting on you.`,
      subMessage: 'Bring comfortable shoes and a tissue. Possibly two.'
    };
  }
  return {
    message: 'Tomorrow. Actually tomorrow.',
    subMessage: 'We have run out of ways to say it — so, see you there.'
  };
}

/** Mirrors the original data-reveal / data-shown pattern: reveal once, on first intersection. */
export function useRevealOnce<T extends HTMLElement>(): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    io.observe(node);
    const t = setTimeout(() => {
      if (node.getBoundingClientRect().top < window.innerHeight) setShown(true);
    }, 120);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return [ref, shown];
}
