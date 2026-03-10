import type { Top25Team } from '../../types/game';
import { useFavorites } from '../../context/FavoritesContext';
import TeamLogo from '../common/TeamLogo';

interface Props {
  rankings: Top25Team[];
}

const MEDAL_COLORS: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

export default function Top25Table({ rankings }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (rankings.length === 0) {
    return (
      <div className="text-center py-16 text-white/25 text-sm">
        Rankings not available.
      </div>
    );
  }

  const maxScore = Math.max(...rankings.map(t => t.compositeScore));

  return (
    <div className="px-3 pb-6">
      {/* Column headers */}
      <div className="flex items-center px-3 py-1.5 mb-1 text-[10px] font-black uppercase tracking-widest text-white/20">
        <span className="w-8 text-center">#</span>
        <span className="flex-1 pl-2">Team</span>
        <span className="w-14 text-center">W-L</span>
        <span className="w-12 text-center">ELO</span>
        <span className="w-14 text-center">Score</span>
        <span className="w-7" />
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
        {rankings.map((team, idx) => {
          const fav = isFavorite(team.teamId);
          const rdColor =
            team.runDiffPerGame > 2
              ? 'text-emerald-400'
              : team.runDiffPerGame < -1
              ? 'text-red-400'
              : 'text-white/40';
          const rankColor = MEDAL_COLORS[team.rank] ?? 'text-white/50';
          const scoreWidth = Math.round((team.compositeScore / maxScore) * 100);
          const isTop3 = team.rank <= 3;

          return (
            <div
              key={team.teamId}
              className={`flex items-center px-3 py-2.5 border-b border-white/[0.04] last:border-b-0 transition-colors duration-150 ${
                fav
                  ? 'bg-amber-400/5'
                  : isTop3
                  ? 'bg-royal/[0.04]'
                  : idx % 2 === 0
                  ? 'bg-surface-dark'
                  : 'bg-[#0a1122]'
              }`}
            >
              {/* Rank */}
              <span className={`w-8 text-center text-sm font-black tabular-nums ${rankColor}`}>
                {team.rank}
              </span>

              {/* Team */}
              <div className="flex items-center gap-2 flex-1 pl-2 min-w-0">
                <div className={`${isTop3 ? 'p-0.5 rounded-lg bg-white/5' : ''}`}>
                  <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={30} />
                </div>
                <div className="min-w-0">
                  <span className={`text-[13px] font-bold truncate block ${fav ? 'text-amber-300' : 'text-white/90'}`}>
                    {team.displayName}
                  </span>
                  <span className={`text-[10px] font-medium ${rdColor}`}>
                    {team.runDiffPerGame > 0 ? `+${team.runDiffPerGame}` : team.runDiffPerGame} RD/G
                  </span>
                </div>
              </div>

              {/* Record */}
              <span className="w-14 text-center text-[11px] font-semibold text-white/40 tabular-nums">
                {team.wins}–{team.losses}
              </span>

              {/* ELO */}
              <span className="w-12 text-center text-[11px] font-semibold text-white/40 tabular-nums">
                {team.elo}
              </span>

              {/* Score bar */}
              <div className="w-14 flex flex-col items-center gap-1">
                <span className="text-[11px] font-black text-royal-bright tabular-nums">
                  {team.compositeScore}
                </span>
                <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-royal to-royal-bright"
                    style={{ width: `${scoreWidth}%` }}
                  />
                </div>
              </div>

              {/* Favorite toggle */}
              <button
                onClick={() => toggleFavorite(team.teamId)}
                className="w-7 flex justify-center ml-1 shrink-0"
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
        D1 Diamond composite ranking — ELO + run differential. Min. 5 games played.
      </p>
    </div>
  );
}
