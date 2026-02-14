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
