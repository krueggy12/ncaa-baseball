import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className = '' }: Props) {
  const { ref, revealClass, revealStyle } = useReveal(delay);

  return (
    <div ref={ref} className={`${revealClass}${className ? ` ${className}` : ''}`} style={revealStyle}>
      {children}
    </div>
  );
}
