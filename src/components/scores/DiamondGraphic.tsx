interface DiamondProps {
  onFirst: boolean;
  onSecond: boolean;
  onThird: boolean;
  size?: number;
}

export default function DiamondGraphic({ onFirst, onSecond, onThird, size = 36 }: DiamondProps) {
  const s = size;
  const mid = s / 2;
  const d = s * 0.3; // diamond offset from center

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="shrink-0">
      {/* Second base */}
      <rect
        x={mid - 4} y={mid - d - 4}
        width={8} height={8}
        transform={`rotate(45 ${mid} ${mid - d})`}
        fill={onSecond ? '#f59e0b' : 'transparent'}
        stroke={onSecond ? '#f59e0b' : '#9ca3af'}
        strokeWidth={1.5}
      />
      {/* Third base */}
      <rect
        x={mid - d - 4} y={mid - 4}
        width={8} height={8}
        transform={`rotate(45 ${mid - d} ${mid})`}
        fill={onThird ? '#f59e0b' : 'transparent'}
        stroke={onThird ? '#f59e0b' : '#9ca3af'}
        strokeWidth={1.5}
      />
      {/* First base */}
      <rect
        x={mid + d - 4} y={mid - 4}
        width={8} height={8}
        transform={`rotate(45 ${mid + d} ${mid})`}
        fill={onFirst ? '#f59e0b' : 'transparent'}
        stroke={onFirst ? '#f59e0b' : '#9ca3af'}
        strokeWidth={1.5}
      />
    </svg>
  );
}
