export type GameState = 'pre' | 'in' | 'post';

export interface GameStatus {
  state: GameState;
  detail: string;
  shortDetail: string;
  period: number;
  completed: boolean;
  inning: number;
  halfInning: 'top' | 'bottom' | '';
}

export interface TeamScore {
  id: string;
  name: string;
  displayName: string;
  abbreviation: string;
  location: string;
  logo: string;
  color: string;
  score: number;
  hits: number;
  errors: number;
  rank?: number;
  record: string;
  linescores: number[];
  isWinner: boolean;
  conferenceId?: string;
}

export interface GameSituation {
  balls: number;
  strikes: number;
  outs: number;
  onFirst: boolean;
  onSecond: boolean;
  onThird: boolean;
  batter?: string;
  pitcher?: string;
  lastPlay?: string;
}

export interface Game {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: GameStatus;
  venue: {
    name: string;
    city: string;
    state: string;
  };
  broadcasts: string[];
  isConferenceGame: boolean;
  away: TeamScore;
  home: TeamScore;
  situation?: GameSituation;
}

export interface RankedTeam {
  rank: number;
  previousRank: number;
  trend: 'up' | 'down' | 'same' | 'new';
  points: number;
  firstPlaceVotes: number;
  teamId: string;
  name: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  record: string;
}

export interface Conference {
  id: string;
  name: string;
  abbreviation: string;
}

export type StatusFilter = 'all' | 'live' | 'final' | 'scheduled';
