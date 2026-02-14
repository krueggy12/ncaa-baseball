import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStandings } from '../hooks/useStandings';
import { useFavorites } from '../context/FavoritesContext';
import TeamLogo from '../components/common/TeamLogo';

const STORAGE_KEY = 'd1-standings-conference';

export default function StandingsPage() {
  const navigate = useNavigate();
  const { standings, isLoading } = useStandings();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedConf, setSelectedConf] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const pillsRef = useRef<HTMLDivElement>(null);

  // Auto-select first conference when data loads if nothing saved
  useEffect(() => {
    if (standings.length > 0 && !selectedConf) {
      // Default to SEC if available, otherwise first
      const sec = standings.find(s => s.conferenceAbbreviation === 'SEC');
      const initial = sec ? sec.conferenceId : standings[0].conferenceId;
      setSelectedConf(initial);
      try { localStorage.setItem(STORAGE_KEY, initial); } catch {}
    }
  }, [standings, selectedConf]);

  const handleSelectConf = (confId: string) => {
    setSelectedConf(confId);
    try { localStorage.setItem(STORAGE_KEY, confId); } catch {}
  };

  const activeConf = standings.find(s => s.conferenceId === selectedConf);

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
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Conference Standings</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {activeConf ? activeConf.conferenceName : 'Select a conference'}
          </p>
        </div>
      </div>

      {/* Conference Picker — horizontal scroll pills */}
      {standings.length > 0 && (
        <div
          ref={pillsRef}
          className="flex gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hide"
        >
          {standings.map(conf => (
            <button
              key={conf.conferenceId}
              onClick={() => handleSelectConf(conf.conferenceId)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedConf === conf.conferenceId
                  ? 'bg-royal text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {conf.conferenceAbbreviation}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="px-4 space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-white dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Standings Table */}
      {activeConf && activeConf.entries.length > 0 && (
        <div className="px-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/50">
                    <th className="text-left pl-3 pr-1 py-2 w-6">#</th>
                    <th className="text-left px-1 py-2">Team</th>
                    <th className="text-center px-2 py-2 w-16">Conf</th>
                    <th className="text-center px-2 py-2 w-16">Overall</th>
                    <th className="text-center px-2 py-2 w-12">Pct</th>
                    <th className="text-center px-2 py-2 w-12">Strk</th>
                    <th className="text-center px-2 py-2 w-12">Diff</th>
                    <th className="text-center pr-3 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {activeConf.entries.map((entry, idx) => {
                    const fav = isFavorite(entry.teamId);
                    return (
                      <tr
                        key={entry.teamId}
                        className={`border-b border-gray-50 dark:border-gray-700/30 last:border-b-0 ${
                          fav ? 'bg-yellow-50/60 dark:bg-yellow-900/10' : ''
                        }`}
                      >
                        <td className="pl-3 pr-1 py-2 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="px-1 py-2">
                          <div className="flex items-center gap-2">
                            <TeamLogo
                              src={entry.logo}
                              alt={entry.displayName}
                              abbreviation={entry.abbreviation}
                              size={22}
                            />
                            <span className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                              {entry.displayName}
                            </span>
                          </div>
                        </td>
                        <td className="text-center px-2 py-2 text-xs tabular-nums text-gray-700 dark:text-gray-300">
                          {entry.conferenceWins}-{entry.conferenceLosses}
                        </td>
                        <td className="text-center px-2 py-2 text-xs tabular-nums text-gray-700 dark:text-gray-300">
                          {entry.overallWins}-{entry.overallLosses}
                        </td>
                        <td className="text-center px-2 py-2 text-xs tabular-nums text-gray-500 dark:text-gray-400">
                          {entry.overallWinPct.toFixed(3).replace(/^0/, '')}
                        </td>
                        <td className="text-center px-2 py-2">
                          <span className={`text-xs font-medium tabular-nums ${
                            entry.streak.startsWith('W')
                              ? 'text-green-600 dark:text-green-400'
                              : entry.streak.startsWith('L')
                              ? 'text-red-500 dark:text-red-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {entry.streak}
                          </span>
                        </td>
                        <td className="text-center px-2 py-2">
                          <span className={`text-xs font-medium tabular-nums ${
                            entry.runDifferential.startsWith('+')
                              ? 'text-green-600 dark:text-green-400'
                              : entry.runDifferential.startsWith('-')
                              ? 'text-red-500 dark:text-red-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {entry.runDifferential}
                          </span>
                        </td>
                        <td className="pr-3 py-2 text-center">
                          <button
                            onClick={() => toggleFavorite(entry.teamId)}
                            className="p-0.5"
                            aria-label={fav ? `Remove ${entry.displayName} from favorites` : `Add ${entry.displayName} to favorites`}
                          >
                            <svg
                              className={`w-4 h-4 ${fav ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              fill={fav ? 'currentColor' : 'none'}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Run scoring breakdown */}
          {activeConf.entries.length > 0 && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 px-1 text-center">
              Conf = Conference Record &middot; Diff = Run Differential (RS - RA) &middot; Tap star to favorite
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && standings.length === 0 && (
        <div className="text-center py-16 px-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No standings data available.</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Standings will appear once the season begins.
          </p>
        </div>
      )}
    </div>
  );
}
