import type { GameState } from '../../types/game';

interface StatusBadgeProps {
  state: GameState;
  detail: string;
}

export default function StatusBadge({ state, detail }: StatusBadgeProps) {
  if (state === 'in') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-d1red/15 ring-1 ring-d1red/30">
        <span className="w-1.5 h-1.5 rounded-full bg-d1red animate-glow-live shrink-0" />
        <span className="text-[10px] font-black text-d1red uppercase tracking-wide">{detail}</span>
      </div>
    );
  }

  if (state === 'post') {
    return (
      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">
        {detail}
      </span>
    );
  }

  return (
    <span className="text-[10px] font-bold text-royal-bright/70 uppercase tracking-wide">
      {detail}
    </span>
  );
}
