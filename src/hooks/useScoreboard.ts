import { useMemo, useRef, useCallback, useState } from 'react';
import { usePolling } from './usePolling';
import { fetchESPN } from '../api/espnClient';
import { getScoreboardUrl } from '../api/endpoints';
import { transformScoreboard } from '../api/transformers';
import { POLL_INTERVAL_LIVE, POLL_INTERVAL_IDLE } from '../utils/constants';
import type { Game } from '../types/game';

// conferenceId is intentionally not passed to ESPN — the groups= param doesn't
// work for college baseball. Conference filtering is done client-side in ScoresPage
// using the team→conference map built from standings data.
export function useScoreboard(date: string) {
  const previousGamesRef = useRef<Game[]>([]);
  const [hasLive, setHasLive] = useState(false);

  const fetcher = useCallback(async () => {
    const raw = await fetchESPN(getScoreboardUrl(date));
    const result = transformScoreboard(raw);
    setHasLive(result.some((g: Game) => g.status.state === 'in'));
    return result;
  }, [date]);

  const { data: games, isLoading, error, refetch } = usePolling<Game[]>({
    fetcher,
    interval: hasLive ? POLL_INTERVAL_LIVE : POLL_INTERVAL_IDLE,
  });

  const hasLiveGames = useMemo(() => games?.some((g: Game) => g.status.state === 'in') ?? false, [games]);

  const previousGames = previousGamesRef.current;
  if (games && games !== previousGamesRef.current) {
    previousGamesRef.current = games;
  }

  return {
    games: games || [],
    previousGames,
    isLoading,
    error,
    hasLiveGames,
    refetch,
  };
}
