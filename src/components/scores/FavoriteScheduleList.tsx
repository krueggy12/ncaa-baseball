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
    <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-50 dark:border-gray-700/30 last:border-b-0">
      {/* Team logo */}
      <TeamLogo
        src={game.team.logo}
        alt={game.team.name}
        abbreviation={game.team.abbreviation}
        size={24}
      />

      {/* Matchup info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium w-3 shrink-0">
            {game.isHome ? 'vs' : '@'}
          </span>
          <TeamLogo
            src={game.opponent.logo}
            alt={game.opponent.displayName}
            abbreviation={game.opponent.abbreviation}
            size={20}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {game.opponent.displayName}
          </span>
        </div>
      </div>

      {/* Result / Time / Live */}
      <div className="shrink-0 text-right">
        {isLive ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse-live" />
            <span className="text-xs font-bold text-live">LIVE</span>
            {game.teamScore != null && game.opponentScore != null && (
              <span className="text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-300 ml-0.5">
                {game.teamScore}-{game.opponentScore}
              </span>
            )}
          </div>
        ) : isCompleted && game.teamScore != null && game.opponentScore != null ? (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
              game.isWin
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {game.isWin ? 'W' : 'L'}
            </span>
            <span className="text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-300">
              {game.teamScore}-{game.opponentScore}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-400 dark:text-gray-500">{time}</span>
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
          <div key={i} className="h-14 bg-white dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (dateGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming games for your favorites.</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          Add teams from the Team Directory to see their schedules here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 pb-4 space-y-3 mt-1">
      {dateGroups.map(group => (
        <div key={group.dateKey}>
          <div className="flex items-center gap-2 py-1.5">
            {group.isToday && (
              <span className="w-2 h-2 rounded-full bg-royal" />
            )}
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${
              group.isToday
                ? 'text-royal dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {group.dateLabel}
            </h3>
            <span className="text-[10px] text-gray-300 dark:text-gray-600">
              {group.games.length} game{group.games.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {group.games.map((game, idx) => (
              <ScheduleRow key={`${game.id}-${game.team.id}-${idx}`} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
