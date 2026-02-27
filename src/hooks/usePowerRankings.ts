import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchESPN } from '../api/espnClient';
import { getStandingsUrl } from '../api/endpoints';
import { transformStandings } from '../api/transformers';
import type { PowerRankedTeam } from '../types/game';

const MIN_GAMES = 10;

function norm(val: number, min: number, max: number): number {
  return max === min ? 50 : ((val - min) / (max - min)) * 100;
}

async function fetchPowerRankings(): Promise<PowerRankedTeam[]> {
  const raw = await fetchESPN(getStandingsUrl());
  const allStandings = transformStandings(raw);

  // Flatten all teams across all conferences
  const allTeams = allStandings.flatMap(conf => conf.entries);

  // Filter to teams with a meaningful sample size
  const eligible = allTeams.filter(t => {
    const games = t.overallWins + t.overallLosses;
    return games >= MIN_GAMES;
  });

  if (eligible.length === 0) return [];

  // Compute run differential per game using runsScored / runsAllowed directly
  const withMetrics = eligible.map(t => {
    const games = t.overallWins + t.overallLosses;
    const rdPerGame = games > 0 ? (t.runsScored - t.runsAllowed) / games : 0;
    return { ...t, games, rdPerGame };
  });

  // Normalize across the pool for composite score
  const winPcts = withMetrics.map(t => t.overallWinPct);
  const rds = withMetrics.map(t => t.rdPerGame);
  const minWin = Math.min(...winPcts), maxWin = Math.max(...winPcts);
  const minRd = Math.min(...rds), maxRd = Math.max(...rds);

  return withMetrics
    .map(t => ({
      teamId: t.teamId,
      displayName: t.displayName,
      abbreviation: t.abbreviation,
      logo: t.logo,
      wins: t.overallWins,
      losses: t.overallLosses,
      record: `${t.overallWins}-${t.overallLosses}`,
      winPct: t.overallWinPct,
      runDiffPerGame: Math.round(t.rdPerGame * 10) / 10,
      powerScore: Math.round(
        0.6 * norm(t.overallWinPct, minWin, maxWin) +
        0.4 * norm(t.rdPerGame, minRd, maxRd)
      ),
      rank: 0,
    }))
    .sort((a, b) => b.powerScore - a.powerScore)
    .slice(0, 25)
    .map((t, i) => ({ ...t, rank: i + 1 }));
}

export function usePowerRankings() {
  const fetcher = useCallback(fetchPowerRankings, []);

  const { data, isLoading, error, refetch } = usePolling<PowerRankedTeam[]>({
    fetcher,
    interval: 3600_000, // refresh hourly
  });

  return {
    rankings: data || [],
    isLoading,
    error,
    refetch,
  };
}
