import { useState } from 'react';
import { useScoreboard } from '../hooks/useScoreboard';
import { useDateNavigation } from '../hooks/useDateNavigation';
import { useSwipe } from '../hooks/useSwipe';
import { useGameNotifications } from '../hooks/useNotifications';
import { useFavorites } from '../context/FavoritesContext';
import DateStrip from '../components/scores/DateStrip';
import FilterBar from '../components/scores/FilterBar';
import ScoreList from '../components/scores/ScoreList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { StatusFilter } from '../types/game';

export default function ScoresPage() {
  const { selectedDate, espnDate, goToNextDay, goToPrevDay, goToDate } = useDateNavigation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [conferenceFilter, setConferenceFilter] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favoriteIds } = useFavorites();

  const { games, previousGames, isLoading, error } = useScoreboard(espnDate, conferenceFilter || undefined);

  // Fire notifications for favorite teams
  useGameNotifications(games, previousGames);

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNextDay,
    onSwipeRight: goToPrevDay,
  });

  return (
    <div {...swipeHandlers}>
      <DateStrip selectedDate={selectedDate} onSelectDate={goToDate} />
      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        conferenceFilter={conferenceFilter}
        onConferenceFilterChange={setConferenceFilter}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={setFavoritesOnly}
        hasFavorites={favoriteIds.size > 0}
      />

      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
          Failed to load scores. Pull down to retry.
        </div>
      )}

      {isLoading ? (
        <div className="mt-4">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="mt-2">
          <ScoreList
            games={games}
            statusFilter={statusFilter}
            favoritesOnly={favoritesOnly}
            favoriteIds={favoriteIds}
          />
        </div>
      )}
    </div>
  );
}
