import type { RankedTeam } from '../../types/game';
import { useFavorites } from '../../context/FavoritesContext';
import TeamLogo from '../common/TeamLogo';
import TrendIndicator from './TrendIndicator';

interface Props {
  rankings: RankedTeam[];
}

const MEDAL_COLORS: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

export default function RankingsTable({ rankings }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (rankings.length === 0) {
    return (
      <div className="text-center py-16 text-white/25 text-sm">
        Rankings not available.
      </div>
    );
  }

  return (
    <div className="px-3 pb-6">
      <div className="flex items-center px-3 py-1.5 mb-1 text-[10px] font-black uppercase tracking-widest text-white/20">
        <span className="w-8 text-center">#</span>
        <span className="w-6" />
        <span className="flex-1 pl-2">Team</span>
        <span className="w-16 text-center">Record</span>
        <span className="w-7" />
      </div>

      <div className="rounded-md overflow-hidden border border-white/[0.06]">
        {rankings.map((team, idx) => {
          const fav = isFavorite(team.teamId);
          const diff = Math.abs(team.rank - team.previousRank);
          const rankColor = MEDAL_COLORS[team.rank] ?? 'text-white/50';

          return (
            <div
              key={team.teamId}
              className={`flex items-center px-3 py-2.5 border-b border-white/[0.04] last:border-b-0 transition-colors duration-150 ${
                fav
                  ? 'bg-amber-400/5'
                  : idx % 2 === 0
                  ? 'bg-surface-dark'
                  : 'bg-[#0a1122]'
              }`}
            >
              <span className={`w-8 text-center text-sm font-black tabular-nums ${rankColor}`}>
                {team.rank}
              </span>
              <div className="w-6 flex justify-center">
                <TrendIndicator trend={team.trend} diff={diff > 0 ? diff : undefined} />
              </div>
              <div className="flex items-center gap-2 flex-1 pl-2 min-w-0">
                <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={30} />
                <div className="min-w-0">
                  <span className={`text-[13px] font-bold truncate block ${fav ? 'text-amber-300' : 'text-white/90'}`}>
                    {team.displayName}
                  </span>
                </div>
              </div>
              <span className="w-16 text-center text-[11px] font-semibold text-white/40 tabular-nums">
                {team.record}
              </span>
              <button
                onClick={() => toggleFavorite(team.teamId)}
                className="w-7 flex justify-center ml-1"
                aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className={`w-4 h-4 transition-colors ${fav ? 'text-amber-400' : 'text-white/15 hover:text-white/40'}`}
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

      <p className="text-[10px] text-white/20 text-center mt-3 px-2">
        D1Baseball Media Poll — updated weekly.
      </p>
    </div>
  );
}
