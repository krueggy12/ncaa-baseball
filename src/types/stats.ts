export type StatTab = 'bat' | 'pit';
export type SortDir = 'asc' | 'desc';

export interface CollegeBatter {
  PlayerName: string;
  Team: string;
  FullTeamName: string;
  UPID: string;
  UPURL: string;
  Season: number;
  G: number;
  AB: number;
  PA: number;
  H: number;
  '2B': number;
  '3B': number;
  HR: number;
  R: number;
  RBI: number;
  BB: number;
  SO: number;
  SB: number;
  AVG: number | null;
  OBP: number | null;
  SLG: number | null;
  OPS: number | null;
  ISO: number | null;
  BABIP: number | null;
  wOBA: number | null;
  'wRC+': number | null;
  'BB%': number | null;
  'K%': number | null;
}

export interface CollegePitcher {
  PlayerName: string;
  Team: string;
  FullTeamName: string;
  UPID: string;
  UPURL: string;
  Season: number;
  W: number;
  L: number;
  ERA: number | null;
  G: number;
  GS: number;
  SV: number;
  IP: number;
  H: number;
  ER: number;
  HR: number;
  BB: number;
  SO: number;
  'K/9': number | null;
  'BB/9': number | null;
  WHIP: number | null;
  BABIP: number | null;
  FIP: number | null;
  'K%': number | null;
  'BB%': number | null;
  'K-BB%': number | null;
}

export interface FanGraphsLeaderboardResponse {
  data: Record<string, number | string | null>[];
  totalCount: number;
  sortStat: string;
  sortDir: string;
}
