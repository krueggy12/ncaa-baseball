import type { GameState } from '../../types/game';

interface StatusBadgeProps {
  state: GameState;
  detail: string;
}

export default function StatusBadge({ state, detail }: StatusBadgeProps) {
  const base = 'text-[11px] font-semibold uppercase tracking-wide';

  if (state === 'in') {
    return (
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse-live" />
        <span className={`${base} text-live`}>{detail}</span>
      </div>
    );
  }

  if (state === 'post') {
    return <span className={`${base} text-gray-500 dark:text-gray-400`}>{detail}</span>;
  }

  return <span className={`${base} text-royal dark:text-blue-400`}>{detail}</span>;
}
