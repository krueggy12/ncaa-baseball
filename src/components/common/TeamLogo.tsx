import { useState } from 'react';

interface TeamLogoProps {
  src: string;
  alt: string;
  abbreviation: string;
  size?: number;
}

export default function TeamLogo({ src, alt, abbreviation, size = 32 }: TeamLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-white/[0.07] border border-white/[0.08] text-[10px] font-black text-white/40 shrink-0 tracking-wide"
        style={{ width: size, height: size }}
      >
        {abbreviation.slice(0, 3)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 object-contain"
      onError={() => setFailed(true)}
    />
  );
}
