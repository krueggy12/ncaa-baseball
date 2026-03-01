import { useState, useEffect } from 'react';
import {
  fetchNcaaScoreboard,
  fetchNcaaBoxScore,
  type NcaaBoxScoreData,
  type NcaaGame,
} from '../api/ncaaStatsClient';
import type { Game } from '../types/game';

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

// Match ESPN team location (e.g. "Florida State") to NCAA team name (e.g. "Florida St.")
function teamsMatch(espnLocation: string, ncaaTeam: string): boolean {
  const a = normalize(espnLocation);
  const b = normalize(ncaaTeam);

  if (a === b) return true;

  // Expand "st" → "state" to handle "Florida St." ↔ "Florida State"
  const ae = a.replace(/\bst\b/g, 'state');
  const be = b.replace(/\bst\b/g, 'state');
  if (ae === be) return true;

  // Prefix match — handles "Mississippi" ↔ "Mississippi State", etc.
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  if (shorter.length >= 5 && longer.startsWith(shorter)) return true;

  return false;
}

function findMatchingGame(ncaaGames: NcaaGame[], espnGame: Game): NcaaGame | null {
  const awayLoc = espnGame.away.location;
  const homeLoc = espnGame.home.location;

  return (
    ncaaGames.find(
      g => teamsMatch(awayLoc, g.awayTeam) && teamsMatch(homeLoc, g.homeTeam)
    ) ?? null
  );
}

export function useNcaaBoxScore(game: Game | null) {
  const [data, setData] = useState<NcaaBoxScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!game || game.status.state === 'pre') return;

    let cancelled = false;
    setIsLoading(true);
    setData(null);
    setError(null);

    async function load() {
      try {
        // ESPN dates are ISO strings — extract YYYY-MM-DD
        const dateStr = game!.date.slice(0, 10);

        let ncaaGame = findMatchingGame(await fetchNcaaScoreboard(dateStr), game!);

        // Timezone buffer: try previous day if no match
        if (!ncaaGame) {
          const prev = new Date(dateStr);
          prev.setDate(prev.getDate() - 1);
          const prevStr = prev.toISOString().slice(0, 10);
          ncaaGame = findMatchingGame(await fetchNcaaScoreboard(prevStr), game!);
        }

        if (!ncaaGame) {
          if (!cancelled) {
            setError('not_found');
            setIsLoading(false);
          }
          return;
        }

        const boxScore = await fetchNcaaBoxScore(ncaaGame.contestId);
        if (!cancelled) setData(boxScore);
      } catch {
        if (!cancelled) setError('fetch_failed');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [game?.id]); // Re-run only when the game changes

  return { data, isLoading, error };
}
