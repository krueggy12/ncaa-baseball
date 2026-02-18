import { useState, useMemo } from 'react';
import { useScoreboard } from '../hooks/useScoreboard';
import { useDateNavigation } from '../hooks/useDateNavigation';
import { useFavoriteSchedules } from '../hooks/useFavoriteSchedules';
import { useSwipe } from '../hooks/useSwipe';
import { useGameNotifications } from '../hooks/useNotifications';
import { useFavorites } from '../context/FavoritesContext';
import { useTeamConferenceMap } from '../hooks/useTeamConferenceMap';
import DateStrip from '../components/scores/DateStrip';
import FilterBar from '../components/scores/FilterBar';
import ScoreList from '../components/scores/ScoreList';
import FavoriteScheduleList from '../components/scores/FavoriteScheduleList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { StatusFilter } from '../types/game';

export default function ScoresPage() {
  const { selectedDate, espnDate, goToNextDay, goToPrevDay, goToDate } = useDateNavigation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [conferenceFilter, setConferenceFilter] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favoriteIds } = useFavorites();
  const { map: teamConfMap, conferences } = useTeamConferenceMap();

  const { games, previousGames, isLoading, error } = useScoreboard(espnDate);

  // Client-side conference filter — ESPN's &groups= param doesn't work for baseball
  const filteredGames = useMemo(() => {
    if (!conferenceFilter) return games;
    return games.filter(g =>
      teamConfMap.get(g.home.id) === conferenceFilter ||
      teamConfMap.get(g.away.id) === conferenceFilter
    );
  }, [games, conferenceFilter, teamConfMap]);

  // Fetch favorite team schedules when favorites mode is on
  const { dateGroups, isLoading: favLoading } = useFavoriteSchedules(favoriteIds, favoritesOnly);

  // Fire notifications for favorite teams
  useGameNotifications(games, previousGames);

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNextDay,
    onSwipeRight: goToPrevDay,
  });

  return (
    <div {...swipeHandlers}>
      {/* Hide date strip when in favorites mode (multi-day view) */}
      {!favoritesOnly && (
        <DateStrip selectedDate={selectedDate} onSelectDate={goToDate} />
      )}

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        conferenceFilter={conferenceFilter}
        onConferenceFilterChange={setConferenceFilter}
        conferences={conferences}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={setFavoritesOnly}
        hasFavorites={favoriteIds.size > 0}
      />

      {error && !favoritesOnly && (
        <div className="mx-4 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
          Failed to load scores. Pull down to retry.
        </div>
      )}

      {favoritesOnly ? (
        <FavoriteScheduleList dateGroups={dateGroups} isLoading={favLoading} />
      ) : isLoading ? (
        <div className="mt-4">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="mt-2">
          <ScoreList
            games={filteredGames}
            statusFilter={statusFilter}
            favoritesOnly={false}
            favoriteIds={favoriteIds}
          />
        </div>
      )}
    </div>
  );
}
