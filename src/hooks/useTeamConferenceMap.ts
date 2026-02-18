import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchESPN } from '../api/espnClient';
import { getStandingsUrl } from '../api/endpoints';
import type { Conference } from '../types/game';

export interface TeamConferenceMap {
  // teamId (ESPN) → conferenceId (ESPN standings)
  map: Map<string, string>;
  conferences: Conference[];
}

const EMPTY: TeamConferenceMap = { map: new Map(), conferences: [] };

export function useTeamConferenceMap(): TeamConferenceMap {
  const fetcher = useCallback(async (): Promise<TeamConferenceMap> => {
    const raw = await fetchESPN<any>(getStandingsUrl());
    const div = raw?.children?.[0];
    if (!div?.children) return EMPTY;

    const map = new Map<string, string>();
    const conferences: Conference[] = [];

    for (const conf of div.children) {
      const id: string = conf.id || '';
      if (!id) continue;
      conferences.push({
        id,
        name: conf.name || conf.abbreviation || '',
        abbreviation: conf.abbreviation || conf.shortName || conf.name || '',
      });
      for (const entry of (conf.standings?.entries ?? [])) {
        const teamId: string = entry.team?.id;
        if (teamId) map.set(teamId, id);
      }
    }

    conferences.sort((a, b) => a.name.localeCompare(b.name));
    return { map, conferences };
  }, []);

  const { data } = usePolling<TeamConferenceMap>({
    fetcher,
    interval: 60 * 60 * 1000, // 1 hour
  });

  return data ?? EMPTY;
}
