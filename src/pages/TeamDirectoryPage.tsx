import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchESPN } from '../api/espnClient';
import { getTeamsUrl } from '../api/endpoints';
import { transformTeams, type ESPNTeam } from '../api/transformers';
import { CONFERENCES } from '../api/conferences';
import { useFavorites } from '../context/FavoritesContext';
import TeamLogo from '../components/common/TeamLogo';

export default function TeamDirectoryPage() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [teams, setTeams] = useState<ESPNTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedConf, setSelectedConf] = useState('all');

  useEffect(() => {
    fetchESPN<any>(getTeamsUrl())
      .then(raw => setTeams(transformTeams(raw)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTeams = useMemo(() => {
    let result = teams;

    if (selectedConf !== 'all') {
      result = result.filter(t => t.conferenceId === selectedConf);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        t =>
          t.displayName.toLowerCase().includes(q) ||
          t.abbreviation.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [teams, search, selectedConf]);

  const confName = selectedConf === 'all'
    ? 'All Conferences'
    : CONFERENCES.find(c => c.id === selectedConf)?.name || 'Conference';

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => navigate('/more')}
          className="p-1 -ml-1 text-gray-400 dark:text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team Directory</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} &middot; {confName}
          </p>
        </div>
      </div>

      {/* Search + Conference filter */}
      <div className="px-4 space-y-2 mb-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Conference dropdown */}
        <select
          value={selectedConf}
          onChange={e => setSelectedConf(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal/50 appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem 1.25rem',
          }}
        >
          <option value="all">All Conferences</option>
          {CONFERENCES.map(conf => (
            <option key={conf.id} value={conf.id}>
              {conf.name} ({conf.abbreviation})
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="px-4 space-y-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-12 bg-white dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Teams list */}
      {!loading && filteredTeams.length > 0 && (
        <div className="px-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {filteredTeams.map(team => {
              const fav = isFavorite(team.id);
              const conf = CONFERENCES.find(c => c.id === team.conferenceId);
              return (
                <div
                  key={team.id}
                  className={`flex items-center gap-3 px-3 py-2.5 border-b border-gray-50 dark:border-gray-700/30 last:border-b-0 ${
                    fav ? 'bg-yellow-50/60 dark:bg-yellow-900/10' : ''
                  }`}
                >
                  <button
                    onClick={() => navigate(`/more/teams/${team.id}`)}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                  >
                    <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={28} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {team.displayName}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {conf ? conf.abbreviation + ' · ' : ''}Schedule
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleFavorite(team.id)}
                    className="p-1.5 shrink-0"
                    aria-label={fav ? `Remove ${team.displayName} from favorites` : `Add ${team.displayName} to favorites`}
                  >
                    <svg
                      className={`w-5 h-5 ${fav ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      fill={fav ? 'currentColor' : 'none'}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredTeams.length === 0 && (
        <div className="text-center py-12 px-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No teams found</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Try a different search or conference filter.
          </p>
        </div>
      )}
    </div>
  );
}
