import { useState, useEffect, useMemo } from 'react';
import { fetchESPN } from '../../api/espnClient';
import { getTeamsUrl } from '../../api/endpoints';
import { transformTeams, type ESPNTeam } from '../../api/transformers';
import { useFavorites } from '../../context/FavoritesContext';
import TeamLogo from '../common/TeamLogo';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TeamSearchModal({ open, onClose }: Props) {
  const [teams, setTeams] = useState<ESPNTeam[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!open || teams.length > 0) return;
    setLoading(true);
    fetchESPN(getTeamsUrl())
      .then(raw => setTeams(transformTeams(raw)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, teams.length]);

  const filtered = useMemo(() => {
    if (!search) return teams;
    const q = search.toLowerCase();
    return teams.filter(t =>
      t.displayName.toLowerCase().includes(q) ||
      t.abbreviation.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q)
    );
  }, [teams, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
          className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Team list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">Loading teams...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No teams found.</div>
        ) : (
          filtered.map(team => {
            const fav = isFavorite(team.id);
            return (
              <button
                key={team.id}
                onClick={() => toggleFavorite(team.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 text-left ${
                  fav ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                }`}
              >
                <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={32} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white block truncate">
                    {team.displayName}
                  </span>
                  <span className="text-[11px] text-gray-400">{team.abbreviation}</span>
                </div>
                <svg
                  className={`w-5 h-5 shrink-0 ${fav ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  viewBox="0 0 20 20"
                  fill={fav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
