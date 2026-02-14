import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchESPN } from '../api/espnClient';
import { getGameSummaryUrl } from '../api/endpoints';
import { POLL_INTERVAL_LIVE, POLL_INTERVAL_IDLE } from '../utils/constants';

export interface GameSummary {
  boxScore: any;
  plays: any[];
  leaders: any[];
  header: any;
  raw: any;
}

export function useGameDetail(eventId: string, isLive: boolean) {
  const fetcher = useCallback(async (): Promise<GameSummary> => {
    const raw = await fetchESPN<any>(getGameSummaryUrl(eventId));
    return {
      boxScore: raw.boxscore || null,
      plays: raw.plays || [],
      leaders: raw.leaders || [],
      header: raw.header || null,
      raw,
    };
  }, [eventId]);

  const { data, isLoading, error, refetch } = usePolling<GameSummary>({
    fetcher,
    interval: isLive ? POLL_INTERVAL_LIVE : POLL_INTERVAL_IDLE,
    enabled: !!eventId,
  });

  return { summary: data, isLoading, error, refetch };
}
