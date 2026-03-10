interface DiamondProps {
  onFirst: boolean;
  onSecond: boolean;
  onThird: boolean;
  size?: number;
}

export default function DiamondGraphic({ onFirst, onSecond, onThird, size = 36 }: DiamondProps) {
  const s = size;
  const mid = s / 2;
  const d = s * 0.3;

  const occupied = '#f59e0b';
  const empty = 'rgba(255,255,255,0.15)';
  const occupiedStroke = '#fbbf24';
  const emptyStroke = 'rgba(255,255,255,0.2)';

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="shrink-0">
      {/* Second base (top) */}
      <rect
        x={mid - 4} y={mid - d - 4}
        width={8} height={8}
        transform={`rotate(45 ${mid} ${mid - d})`}
        fill={onSecond ? occupied : empty}
        stroke={onSecond ? occupiedStroke : emptyStroke}
        strokeWidth={1.5}
      />
      {/* Third base (left) */}
      <rect
        x={mid - d - 4} y={mid - 4}
        width={8} height={8}
        transform={`rotate(45 ${mid - d} ${mid})`}
        fill={onThird ? occupied : empty}
        stroke={onThird ? occupiedStroke : emptyStroke}
        strokeWidth={1.5}
      />
      {/* First base (right) */}
      <rect
        x={mid + d - 4} y={mid - 4}
        width={8} height={8}
        transform={`rotate(45 ${mid + d} ${mid})`}
        fill={onFirst ? occupied : empty}
        stroke={onFirst ? occupiedStroke : emptyStroke}
        strokeWidth={1.5}
      />
    </svg>
  );
}
