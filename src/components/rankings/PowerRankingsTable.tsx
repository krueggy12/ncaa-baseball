import type { PowerRankedTeam } from '../../types/game';
import { useFavorites } from '../../context/FavoritesContext';
import TeamLogo from '../common/TeamLogo';

interface Props {
  rankings: PowerRankedTeam[];
}

export default function PowerRankingsTable({ rankings }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (rankings.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--c-text-50)] text-sm">
        Power rankings not available.
      </div>
    );
  }

  return (
    <div className="px-3 pb-4">
      <div className="bg-[var(--c-surface)] rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--c-text-40)] border-b border-[var(--c-border)]">
          <span className="w-8 text-center">#</span>
          <span className="flex-1 pl-2">Team</span>
          <span className="w-14 text-center">Record</span>
          <span className="w-12 text-center">RD/G</span>
          <span className="w-10 text-center">Score</span>
          <span className="w-6" />
        </div>

        {rankings.map(team => {
          const fav = isFavorite(team.teamId);
          const rdColor =
            team.runDiffPerGame > 2
              ? 'text-emerald-600 dark:text-emerald-400'
              : team.runDiffPerGame < -1
              ? 'text-red-500 dark:text-red-400'
              : 'text-[var(--c-text-50)]';
          const rdLabel = team.runDiffPerGame > 0
            ? `+${team.runDiffPerGame}`
            : `${team.runDiffPerGame}`;

          return (
            <div
              key={team.teamId}
              className={`flex items-center px-4 py-2.5 border-b border-[var(--c-border-faint)] last:border-b-0 ${
                fav ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
              }`}
            >
              <span className="w-8 text-center text-sm font-bold tabular-nums text-[var(--c-text-80)]">
                {team.rank}
              </span>
              <div className="flex items-center gap-2 flex-1 pl-2 min-w-0">
                <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={28} />
                <div className="min-w-0">
                  <span className="text-sm font-medium text-[var(--c-text)] truncate block">
                    {team.displayName}
                  </span>
                </div>
              </div>
              <span className="w-14 text-center text-xs text-[var(--c-text-50)] tabular-nums">
                {team.record}
              </span>
              <span className={`w-12 text-center text-xs font-medium tabular-nums ${rdColor}`}>
                {rdLabel}
              </span>
              <span className="w-10 text-center text-xs font-bold text-royal tabular-nums">
                {team.powerScore}
              </span>
              <button
                onClick={() => toggleFavorite(team.teamId)}
                className="w-6 flex justify-center"
                aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className={`w-4 h-4 ${fav ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--c-text-30)]'}`}
                  viewBox="0 0 20 20"
                  fill={fav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-[var(--c-text-40)] text-center mt-3 px-2">
        Score = 60% win % + 40% run differential per game (normalized). Min. {10} games.
      </p>
    </div>
  );
}
