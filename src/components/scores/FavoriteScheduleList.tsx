import type { DateGroup, FavoriteGame } from '../../hooks/useFavoriteSchedules';
import TeamLogo from '../common/TeamLogo';

interface Props {
  dateGroups: DateGroup[];
  isLoading: boolean;
}

function ScheduleRow({ game }: { game: FavoriteGame }) {
  const isCompleted = game.state === 'post';
  const isLive = game.state === 'in';

  const time = (() => {
    try {
      const d = new Date(game.date);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  })();

  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/[0.04] last:border-b-0">
      <TeamLogo src={game.team.logo} alt={game.team.name} abbreviation={game.team.abbreviation} size={24} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/30 font-bold w-4 shrink-0">
            {game.isHome ? 'vs' : '@'}
          </span>
          <TeamLogo src={game.opponent.logo} alt={game.opponent.displayName} abbreviation={game.opponent.abbreviation} size={18} />
          <span className="text-[13px] font-semibold text-white/80 truncate">
            {game.opponent.displayName}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        {isLive ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-d1red animate-glow-live" />
            <span className="text-[11px] font-black text-d1red">LIVE</span>
            {game.teamScore != null && game.opponentScore != null && (
              <span className="text-[11px] font-bold tabular-nums text-white/60 ml-0.5">
                {game.teamScore}–{game.opponentScore}
              </span>
            )}
          </div>
        ) : isCompleted && game.teamScore != null && game.opponentScore != null ? (
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
              game.isWin
                ? 'bg-emerald-400/15 text-emerald-400'
                : 'bg-d1red/15 text-d1red'
            }`}>
              {game.isWin ? 'W' : 'L'}
            </span>
            <span className="text-[11px] font-bold tabular-nums text-white/50">
              {game.teamScore}–{game.opponentScore}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-white/30 font-medium">{time}</span>
        )}
      </div>
    </div>
  );
}

export default function FavoriteScheduleList({ dateGroups, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="px-3 pb-4 space-y-2 mt-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 rounded-xl animate-shimmer border border-white/[0.05]" />
        ))}
      </div>
    );
  }

  if (dateGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>
        <p className="text-white/40 text-sm font-bold">No upcoming games.</p>
        <p className="text-white/20 text-[11px] mt-1.5 font-medium">
          Add teams from the Team Directory to track them here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 pb-4 space-y-3 mt-1">
      {dateGroups.map(group => (
        <div key={group.dateKey}>
          <div className="flex items-center gap-2 py-1.5 px-1">
            {group.isToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-royal shadow-[0_0_6px_rgba(52,116,230,0.7)]" />
            )}
            <h3 className={`text-[10px] font-black uppercase tracking-[0.18em] ${
              group.isToday ? 'text-royal-bright' : 'text-white/25'
            }`}>
              {group.dateLabel}
            </h3>
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-[10px] font-bold text-white/20">
              {group.games.length}
            </span>
          </div>
          <div className="rounded-md overflow-hidden border border-white/[0.06] bg-surface-dark">
            {group.games.map((game, idx) => (
              <ScheduleRow key={`${game.id}-${game.team.id}-${idx}`} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
