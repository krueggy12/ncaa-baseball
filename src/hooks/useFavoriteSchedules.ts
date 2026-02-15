import { useState, useEffect, useRef } from 'react';
import { fetchESPN } from '../api/espnClient';
import { getTeamScheduleUrl } from '../api/endpoints';
import { transformSchedule } from '../api/transformers';
import type { ScheduleGame, TeamSchedule } from '../types/game';

export interface FavoriteGame extends ScheduleGame {
  team: {
    id: string;
    name: string;
    abbreviation: string;
    logo: string;
  };
}

export interface DateGroup {
  dateLabel: string;
  dateKey: string;
  isToday: boolean;
  games: FavoriteGame[];
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function useFavoriteSchedules(favoriteIds: Set<string>, enabled: boolean) {
  const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const prevIdsRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || favoriteIds.size === 0) {
      setDateGroups([]);
      return;
    }

    // Only refetch if favorite ids actually changed
    const idsKey = Array.from(favoriteIds).sort().join(',');
    if (idsKey === prevIdsRef.current) return;
    prevIdsRef.current = idsKey;

    let cancelled = false;
    setIsLoading(true);

    async function load() {
      const ids = Array.from(favoriteIds);
      const results: TeamSchedule[] = [];

      // Fetch in parallel, batched
      const promises = ids.map(async (id) => {
        try {
          const raw = await fetchESPN<any>(getTeamScheduleUrl(id));
          return transformSchedule(raw, id);
        } catch {
          return null;
        }
      });

      const settled = await Promise.all(promises);
      for (const r of settled) {
        if (r) results.push(r);
      }

      if (cancelled) return;

      // Flatten all games with team info
      const allGames: FavoriteGame[] = [];
      for (const schedule of results) {
        for (const game of schedule.games) {
          allGames.push({
            ...game,
            team: {
              id: schedule.teamId,
              name: schedule.teamName,
              abbreviation: schedule.teamAbbreviation,
              logo: schedule.teamLogo,
            },
          });
        }
      }

      // Deduplicate games (same event with two favorite teams)
      const seen = new Set<string>();
      const unique: FavoriteGame[] = [];
      for (const g of allGames) {
        const key = `${g.id}-${g.team.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(g);
        }
      }

      // Sort by date
      unique.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Group by day — show today, then next 7 days of games, plus yesterday
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const cutoff = new Date(today);
      cutoff.setDate(cutoff.getDate() + 8); // next 7 days

      const relevantGames = unique.filter(g => {
        const gd = new Date(g.date);
        return gd >= yesterday && gd < cutoff;
      });

      const groupMap = new Map<string, { dateLabel: string; isToday: boolean; games: FavoriteGame[] }>();

      for (const game of relevantGames) {
        const gd = new Date(game.date);
        const dayStart = new Date(gd.getFullYear(), gd.getMonth(), gd.getDate());
        const dateKey = dayStart.toISOString().slice(0, 10);

        if (!groupMap.has(dateKey)) {
          const isT = isSameDay(dayStart, today);
          const isY = isSameDay(dayStart, yesterday);
          let label: string;
          if (isT) label = 'Today';
          else if (isY) label = 'Yesterday';
          else {
            label = dayStart.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
          }
          groupMap.set(dateKey, { dateLabel: label, isToday: isT, games: [] });
        }
        groupMap.get(dateKey)!.games.push(game);
      }

      // Sort groups: yesterday → today → future
      const groups: DateGroup[] = Array.from(groupMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateKey, val]) => ({ dateKey, ...val }));

      setDateGroups(groups);
      setIsLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [favoriteIds, enabled]);

  return { dateGroups, isLoading };
}
