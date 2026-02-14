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
        className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400 shrink-0"
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
