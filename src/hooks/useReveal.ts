import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type React from 'react';

type RevealState = 'below' | 'visible' | 'above';

export function useReveal(delay = 0): {
  ref: React.RefObject<HTMLDivElement | null>;
  revealClass: string;
  revealStyle: CSSProperties;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>('below');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible');
        } else if (entry.boundingClientRect.top < 0) {
          setState('above');
        } else {
          setState('below');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -16px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    revealClass: `reveal reveal-${state}`,
    revealStyle: { transitionDelay: state === 'visible' ? `${delay}ms` : '0ms' },
  };
}
