import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchESPN } from '../api/espnClient';
import { getRankingsUrl } from '../api/endpoints';
import { transformRankings } from '../api/transformers';
import type { RankedTeam } from '../types/game';

export function useRankings() {
  const fetcher = useCallback(async () => {
    const raw = await fetchESPN(getRankingsUrl());
    return transformRankings(raw);
  }, []);

  const { data, isLoading, error, refetch } = usePolling<RankedTeam[]>({
    fetcher,
    interval: 3600_000, // 1 hour — rankings update weekly
  });

  return {
    rankings: data || [],
    isLoading,
    error,
    refetch,
  };
}
