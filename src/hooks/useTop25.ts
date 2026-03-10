import { useCallback } from 'react';
import { usePolling } from './usePolling';
import type { Top25Team } from '../types/game';

const TOP25_URL = 'https://web-production-2cdbe.up.railway.app/api/top25';
const HOUR = 3_600_000;

export function useTop25() {
  const fetcher = useCallback(async () => {
    const res = await fetch(TOP25_URL, { signal: AbortSignal.timeout(8_000) });
    if (!res.ok) throw new Error(`Top 25 API error: ${res.status}`);
    const json = await res.json() as {
      top25: Array<{
        rank: number;
        name: string;
        abbreviation: string | null;
        logoUrl: string | null;
        teamId: string;
        wins: number;
        losses: number;
        elo: number;
        runDiffPerGame: number;
        compositeScore: number;
      }>;
    };
    return json.top25.map((t): Top25Team => ({
      rank: t.rank,
      teamId: String(t.teamId),
      displayName: t.name,
      abbreviation: t.abbreviation ?? '',
      logo: t.logoUrl ?? '',
      wins: t.wins,
      losses: t.losses,
      elo: t.elo,
      runDiffPerGame: t.runDiffPerGame,
      compositeScore: t.compositeScore,
    }));
  }, []);

  const { data, isLoading, error } = usePolling<Top25Team[]>({ fetcher, interval: HOUR });
  return { rankings: data ?? [], isLoading, error };
}
