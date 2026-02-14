import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchESPN } from '../api/espnClient';
import { getStandingsUrl } from '../api/endpoints';
import { transformStandings } from '../api/transformers';
import type { ConferenceStandings } from '../types/game';

const STANDINGS_INTERVAL = 60 * 60 * 1000; // 1 hour

export function useStandings() {
  const fetcher = useCallback(async (): Promise<ConferenceStandings[]> => {
    // Try current season first
    const raw = await fetchESPN<any>(getStandingsUrl());
    const standings = transformStandings(raw);

    // If no data (preseason), try previous year
    if (standings.length === 0 || standings.every(s => s.entries.length === 0)) {
      const prevYear = new Date().getFullYear() - 1;
      const fallbackRaw = await fetchESPN<any>(getStandingsUrl(prevYear));
      return transformStandings(fallbackRaw);
    }

    return standings;
  }, []);

  const { data, isLoading, error } = usePolling<ConferenceStandings[]>({
    fetcher,
    interval: STANDINGS_INTERVAL,
  });

  return {
    standings: data || [],
    isLoading,
    error,
  };
}
