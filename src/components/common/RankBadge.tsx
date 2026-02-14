interface RankBadgeProps {
  rank?: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
  if (!rank) return null;
  return (
    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-4 text-right tabular-nums shrink-0">
      {rank}
    </span>
  );
}
