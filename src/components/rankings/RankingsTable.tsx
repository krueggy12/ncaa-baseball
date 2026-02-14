import type { RankedTeam } from '../../types/game';
import { useFavorites } from '../../context/FavoritesContext';
import TeamLogo from '../common/TeamLogo';
import TrendIndicator from './TrendIndicator';

interface Props {
  rankings: RankedTeam[];
}

export default function RankingsTable({ rankings }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (rankings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
        Rankings not available.
      </div>
    );
  }

  return (
    <div className="px-3 pb-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
          <span className="w-8 text-center">#</span>
          <span className="w-6" />
          <span className="flex-1 pl-2">Team</span>
          <span className="w-16 text-center">Record</span>
          <span className="w-6" />
        </div>

        {rankings.map(team => {
          const fav = isFavorite(team.teamId);
          const diff = Math.abs(team.rank - team.previousRank);
          return (
            <div
              key={team.teamId}
              className={`flex items-center px-4 py-2.5 border-b border-gray-50 dark:border-gray-700/50 ${
                fav ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
              }`}
            >
              <span className="w-8 text-center text-sm font-bold tabular-nums text-gray-700 dark:text-gray-300">
                {team.rank}
              </span>
              <div className="w-6 flex justify-center">
                <TrendIndicator trend={team.trend} diff={diff > 0 ? diff : undefined} />
              </div>
              <div className="flex items-center gap-2 flex-1 pl-2 min-w-0">
                <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={28} />
                <div className="min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">
                    {team.displayName}
                  </span>
                </div>
              </div>
              <span className="w-16 text-center text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                {team.record}
              </span>
              <button
                onClick={() => toggleFavorite(team.teamId)}
                className="w-6 flex justify-center"
                aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className={`w-4 h-4 ${fav ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
