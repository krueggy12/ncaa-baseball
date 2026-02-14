import { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useScoreboard } from '../hooks/useScoreboard';
import { toESPNDate } from '../utils/dateUtils';
import { fetchESPN } from '../api/espnClient';
import { getTeamsUrl } from '../api/endpoints';
import { transformTeams, type ESPNTeam } from '../api/transformers';
import TeamSearchModal from '../components/favorites/TeamSearchModal';
import GameCard from '../components/scores/GameCard';
import TeamLogo from '../components/common/TeamLogo';

export default function FavoritesPage() {
  const { favoriteIds, removeFavorite } = useFavorites();
  const [showSearch, setShowSearch] = useState(false);
  const [teams, setTeams] = useState<ESPNTeam[]>([]);

  const today = toESPNDate(new Date());
  const { games } = useScoreboard(today);

  // Load team info for favorites
  useEffect(() => {
    if (favoriteIds.size === 0) return;
    fetchESPN(getTeamsUrl())
      .then(raw => setTeams(transformTeams(raw)))
      .catch(() => {});
  }, [favoriteIds.size]);

  const favoriteTeams = teams.filter(t => favoriteIds.has(t.id));
  const favGames = games.filter(g => favoriteIds.has(g.home.id) || favoriteIds.has(g.away.id));

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Teams</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{favoriteIds.size} team{favoriteIds.size !== 1 ? 's' : ''} tracked</p>
        </div>
        <button
          onClick={() => setShowSearch(true)}
          className="px-3 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg"
        >
          + Add Team
        </button>
      </div>

      {/* Favorite teams list */}
      {favoriteTeams.length > 0 && (
        <div className="px-3 mb-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {favoriteTeams.map(team => (
              <div key={team.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 dark:border-gray-700/50">
                <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={28} />
                <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                  {team.displayName}
                </span>
                <button
                  onClick={() => removeFavorite(team.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                  aria-label={`Remove ${team.displayName}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's games for favorites */}
      {favGames.length > 0 && (
        <div className="px-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            Today's Games
          </h3>
          <div className="space-y-2">
            {favGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {favoriteIds.size === 0 && (
        <div className="text-center py-16 px-8">
          <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">No favorite teams yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-4">
            Add teams to get quick access to their scores and notifications.
          </p>
          <button
            onClick={() => setShowSearch(true)}
            className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg"
          >
            Search Teams
          </button>
        </div>
      )}

      <TeamSearchModal open={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
}
