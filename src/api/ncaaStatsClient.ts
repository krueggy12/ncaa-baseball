const NCAA_STATS_BASE = 'https://ncaa-stats-api-production.up.railway.app';

export interface NcaaGame {
  contestId: string;
  awayTeam: string;
  homeTeam: string;
  awayScore: number | null;
  homeScore: number | null;
  status: 'scheduled' | 'in_progress' | 'final';
}

export interface NcaaPitchingLine {
  team: 'away' | 'home';
  name: string;
  ip: string;
  h: number;
  r: number;
  er: number;
  bb: number;
  k: number;
  hr: number;
  isStarter: boolean;
}

export interface NcaaBattingLine {
  team: 'away' | 'home';
  name: string;
  ab: number;
  r: number;
  h: number;
  rbi: number;
  bb: number;
  k: number;
}

export interface NcaaBoxScoreData {
  pitching: NcaaPitchingLine[];
  batting: NcaaBattingLine[];
}

export async function fetchNcaaScoreboard(date: string): Promise<NcaaGame[]> {
  const res = await fetch(`${NCAA_STATS_BASE}/scoreboard?date=${date}`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`NCAA scoreboard ${res.status}`);
  return res.json();
}

export async function fetchNcaaBoxScore(contestId: string): Promise<NcaaBoxScoreData> {
  // Playwright scraping can take 10-30s on cold start
  const res = await fetch(`${NCAA_STATS_BASE}/boxscore/${contestId}`, {
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) throw new Error(`NCAA box score ${res.status}`);
  return res.json();
}
