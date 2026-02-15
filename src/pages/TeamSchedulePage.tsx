import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchESPN } from '../api/espnClient';
import { getTeamScheduleUrl } from '../api/endpoints';
import { transformSchedule } from '../api/transformers';
import TeamLogo from '../components/common/TeamLogo';
import type { TeamSchedule, ScheduleGame } from '../types/game';

type ScheduleFilter = 'all' | 'completed' | 'upcoming';

export default function TeamSchedulePage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<TeamSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ScheduleFilter>('all');

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    fetchESPN<any>(getTeamScheduleUrl(teamId))
      .then(raw => setSchedule(transformSchedule(raw, teamId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [teamId]);

  const filteredGames = useMemo(() => {
    if (!schedule) return [];
    if (filter === 'completed') return schedule.games.filter(g => g.state === 'post');
    if (filter === 'upcoming') return schedule.games.filter(g => g.state === 'pre');
    return schedule.games;
  }, [schedule, filter]);

  const record = useMemo(() => {
    if (!schedule) return { wins: 0, losses: 0 };
    const completed = schedule.games.filter(g => g.state === 'post');
    return {
      wins: completed.filter(g => g.isWin === true).length,
      losses: completed.filter(g => g.isWin === false).length,
    };
  }, [schedule]);

  const formatGameDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
      monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-gray-400 dark:text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        {schedule && (
          <div className="flex items-center gap-2.5">
            <TeamLogo
              src={schedule.teamLogo}
              alt={schedule.teamName}
              abbreviation={schedule.teamAbbreviation}
              size={32}
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{schedule.teamName}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {record.wins}-{record.losses} &middot; {schedule.season}
              </p>
            </div>
          </div>
        )}
        {!schedule && !loading && (
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Schedule</h2>
        )}
      </div>

      {/* Filter pills */}
      {schedule && (
        <div className="flex gap-1.5 px-4 pb-3">
          {([
            { value: 'all', label: `All (${schedule.games.length})` },
            { value: 'completed', label: `Results (${schedule.games.filter(g => g.state === 'post').length})` },
            { value: 'upcoming', label: `Upcoming (${schedule.games.filter(g => g.state === 'pre').length})` },
          ] as { value: ScheduleFilter; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === opt.value
                  ? 'bg-royal text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="px-4 space-y-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-14 bg-white dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Schedule list */}
      {!loading && filteredGames.length > 0 && (
        <div className="px-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {filteredGames.map((game: ScheduleGame, idx: number) => {
              const { dayOfWeek, monthDay, time } = formatGameDate(game.date);
              const isCompleted = game.state === 'post';

              return (
                <div
                  key={game.id || idx}
                  className="flex items-center gap-3 px-3 py-2.5 border-b border-gray-50 dark:border-gray-700/30 last:border-b-0"
                >
                  {/* Date column */}
                  <div className="w-12 shrink-0 text-center">
                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">{dayOfWeek}</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{monthDay}</p>
                  </div>

                  {/* Opponent */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 w-3 shrink-0">
                      {game.isHome ? 'vs' : '@'}
                    </span>
                    <TeamLogo
                      src={game.opponent.logo}
                      alt={game.opponent.displayName}
                      abbreviation={game.opponent.abbreviation}
                      size={24}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {game.opponent.displayName}
                    </span>
                  </div>

                  {/* Result / Time */}
                  <div className="shrink-0 text-right">
                    {isCompleted && game.teamScore != null && game.opponentScore != null ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
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
                    ) : game.state === 'in' ? (
                      <span className="text-xs font-bold text-live animate-pulse-live">LIVE</span>
                    ) : (
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{time}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredGames.length === 0 && (
        <div className="text-center py-12 px-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No games found</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            {filter !== 'all' ? 'Try a different filter.' : 'Schedule not yet available.'}
          </p>
        </div>
      )}
    </div>
  );
}
