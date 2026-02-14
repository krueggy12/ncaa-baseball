import type { Game, StatusFilter } from '../../types/game';
import GameCard from './GameCard';
import EmptyState from './EmptyState';

interface ScoreListProps {
  games: Game[];
  statusFilter: StatusFilter;
  favoritesOnly: boolean;
  favoriteIds: Set<string>;
}

export default function ScoreList({ games, statusFilter, favoritesOnly, favoriteIds }: ScoreListProps) {
  let filtered = games;

  if (statusFilter !== 'all') {
    const stateMap: Record<StatusFilter, string> = { all: '', live: 'in', final: 'post', scheduled: 'pre' };
    filtered = filtered.filter(g => g.status.state === stateMap[statusFilter]);
  }

  if (favoritesOnly) {
    filtered = filtered.filter(g => favoriteIds.has(g.home.id) || favoriteIds.has(g.away.id));
  }

  // Sort: live first, then scheduled, then final
  const order: Record<string, number> = { in: 0, pre: 1, post: 2 };
  const sorted = [...filtered].sort((a, b) => {
    const oa = order[a.status.state] ?? 1;
    const ob = order[b.status.state] ?? 1;
    if (oa !== ob) return oa - ob;

    // Within same status, sort favorites first
    const aFav = favoriteIds.has(a.home.id) || favoriteIds.has(a.away.id);
    const bFav = favoriteIds.has(b.home.id) || favoriteIds.has(b.away.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;

    return 0;
  });

  if (sorted.length === 0) {
    return <EmptyState />;
  }

  // Group by status
  const live = sorted.filter(g => g.status.state === 'in');
  const scheduled = sorted.filter(g => g.status.state === 'pre');
  const final = sorted.filter(g => g.status.state === 'post');

  const sections = [
    { label: 'Live', games: live },
    { label: 'Upcoming', games: scheduled },
    { label: 'Final', games: final },
  ].filter(s => s.games.length > 0);

  return (
    <div className="px-3 pb-4 space-y-3">
      {sections.map(section => (
        <div key={section.label}>
          {sections.length > 1 && (
            <div className="flex items-center gap-2 py-2">
              {section.label === 'Live' && (
                <span className="w-2 h-2 rounded-full bg-live animate-pulse-live" />
              )}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section.label} ({section.games.length})
              </h3>
            </div>
          )}
          <div className="space-y-2">
            {section.games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
