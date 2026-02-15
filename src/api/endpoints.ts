import { ESPN_BASE } from '../utils/constants';

export function getScoreboardUrl(date: string, conferenceId?: string): string {
  let url = `${ESPN_BASE}/scoreboard?dates=${date}&limit=200`;
  if (conferenceId) url += `&groups=${conferenceId}`;
  return url;
}

export function getRankingsUrl(): string {
  return `${ESPN_BASE}/rankings`;
}

export function getTeamsUrl(): string {
  return `${ESPN_BASE}/teams?limit=400`;
}

export function getGameSummaryUrl(eventId: string): string {
  return `${ESPN_BASE}/summary?event=${eventId}`;
}

export function getStandingsUrl(season?: number): string {
  const base = 'https://site.web.api.espn.com/apis/v2/sports/baseball/college-baseball/standings?type=0&level=3';
  return season ? `${base}&season=${season}` : base;
}

export function getTeamScheduleUrl(teamId: string): string {
  return `${ESPN_BASE}/teams/${teamId}/schedule`;
}
