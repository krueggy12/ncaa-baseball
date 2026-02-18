import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchESPN } from '../api/espnClient';
import type { FanGraphsLeaderboardResponse, StatTab, SortDir } from '../types/stats';

const FANGRAPHS_BASE = 'https://www.fangraphs.com/api/leaders/college/data';
const STATS_INTERVAL = 30 * 60 * 1000; // 30 min — stats don't change mid-game
const PAGE_SIZE = 50;

export function useCollegeStats(
  tab: StatTab,
  sortStat: string,
  sortDir: SortDir,
  qual: boolean,
  page: number,
  conferenceId: string,  // '0' = all
  teamId: number,        // 0 = all
) {
  const season = new Date().getFullYear();

  const fetcher = useCallback(async (): Promise<FanGraphsLeaderboardResponse> => {
    const params = new URLSearchParams({
      position: '',
      type: '0',
      stats: tab,
      qual: qual ? 'y' : '0',
      seasonstart: String(season),
      seasonend: String(season),
      team: String(teamId),
      players: '0',
      conference: conferenceId,
      pageitems: String(PAGE_SIZE),
      pagenum: String(page),
      sortstat: sortStat,
      sortdir: sortDir,
    });
    return fetchESPN<FanGraphsLeaderboardResponse>(`${FANGRAPHS_BASE}?${params}`);
  }, [tab, sortStat, sortDir, qual, page, season, conferenceId, teamId]);

  const { data, isLoading, error } = usePolling<FanGraphsLeaderboardResponse>({
    fetcher,
    interval: STATS_INTERVAL,
  });

  return {
    rows: data?.data ?? [],
    totalCount: data?.totalCount ?? 0,
    pageSize: PAGE_SIZE,
    isLoading,
    error,
  };
}
