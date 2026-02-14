import type { Game, TeamScore, GameSituation, GameState, RankedTeam, ConferenceStandings, StandingEntry } from '../types/game';

/* eslint-disable @typescript-eslint/no-explicit-any */

function extractTeam(competitor: any): TeamScore {
  const team = competitor.team || {};
  const rank = competitor.curatedRank?.current;
  return {
    id: team.id || '',
    name: team.name || team.shortDisplayName || '',
    displayName: team.displayName || '',
    abbreviation: team.abbreviation || '',
    location: team.location || team.shortDisplayName || '',
    logo: team.logo || team.logos?.[0]?.href || '',
    color: team.color ? `#${team.color}` : '#666666',
    score: parseInt(competitor.score || '0', 10) || 0,
    hits: parseInt(competitor.hits || '0', 10) || 0,
    errors: parseInt(competitor.errors || '0', 10) || 0,
    rank: rank && rank < 99 ? rank : undefined,
    record: competitor.records?.[0]?.summary || '',
    linescores: (competitor.linescores || []).map((ls: any) => ls.value ?? 0),
    isWinner: competitor.winner === true,
    conferenceId: team.conferenceId,
  };
}

function extractSituation(situation: any): GameSituation | undefined {
  if (!situation) return undefined;
  return {
    balls: situation.balls ?? 0,
    strikes: situation.strikes ?? 0,
    outs: situation.outs ?? 0,
    onFirst: situation.onFirst ?? false,
    onSecond: situation.onSecond ?? false,
    onThird: situation.onThird ?? false,
    batter: situation.batter?.athlete?.displayName,
    pitcher: situation.pitcher?.athlete?.displayName,
    lastPlay: situation.lastPlay?.text,
  };
}

export function transformScoreboard(raw: any): Game[] {
  const events = raw?.events || [];
  return events.map((event: any) => {
    const competition = event.competitions?.[0] || {};
    const status = competition.status || event.status || {};
    const statusType = status.type || {};
    const competitors = competition.competitors || [];

    const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
    const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

    const venue = competition.venue || {};
    const address = venue.address || {};

    const state = (statusType.state || 'pre') as GameState;
    const detail = statusType.detail || status.type?.shortDetail || '';
    const shortDetail = statusType.shortDetail || detail;
    const period = status.period || 0;

    let halfInning: 'top' | 'bottom' | '' = '';
    if (state === 'in' && detail) {
      const lower = detail.toLowerCase();
      if (lower.startsWith('top') || lower.startsWith('mid')) halfInning = 'top';
      else if (lower.startsWith('bot') || lower.startsWith('end')) halfInning = 'bottom';
    }

    const broadcasts = (competition.broadcasts || [])
      .flatMap((b: any) => b.names || []);

    return {
      id: event.id || '',
      date: event.date || '',
      name: event.name || '',
      shortName: event.shortName || '',
      status: {
        state,
        detail,
        shortDetail,
        period,
        completed: statusType.completed === true,
        inning: period,
        halfInning,
      },
      venue: {
        name: venue.fullName || venue.shortName || '',
        city: address.city || '',
        state: address.state || '',
      },
      broadcasts,
      isConferenceGame: competition.conferenceCompetition === true,
      away: awayComp ? extractTeam(awayComp) : extractTeam({}),
      home: homeComp ? extractTeam(homeComp) : extractTeam({}),
      situation: state === 'in' ? extractSituation(competition.situation) : undefined,
    } satisfies Game;
  });
}

export function transformRankings(raw: any): RankedTeam[] {
  const rankings = raw?.rankings || [];
  const poll = rankings[0]; // First poll (usually D1Baseball)
  if (!poll) return [];

  return (poll.ranks || []).map((rank: any) => {
    const team = rank.team || {};
    const prev = rank.previous || rank.current;
    const current = rank.current;
    let trend: 'up' | 'down' | 'same' | 'new' = 'same';
    if (prev === 0 || !rank.previous) trend = 'new';
    else if (current < prev) trend = 'up';
    else if (current > prev) trend = 'down';

    return {
      rank: current,
      previousRank: prev,
      trend,
      points: rank.points || 0,
      firstPlaceVotes: rank.firstPlaceVotes || 0,
      teamId: team.id || '',
      name: team.name || team.nickname || '',
      displayName: team.displayName || team.location || '',
      abbreviation: team.abbreviation || '',
      logo: team.logo || team.logos?.[0]?.href || '',
      record: rank.recordSummary || '',
    } satisfies RankedTeam;
  });
}

export interface ESPNTeam {
  id: string;
  displayName: string;
  abbreviation: string;
  location: string;
  name: string;
  logo: string;
  color: string;
  conferenceId?: string;
}

export function transformTeams(raw: any): ESPNTeam[] {
  const teams = raw?.sports?.[0]?.leagues?.[0]?.teams || [];
  return teams.map((t: any) => {
    const team = t.team || t;
    return {
      id: team.id || '',
      displayName: team.displayName || '',
      abbreviation: team.abbreviation || '',
      location: team.location || '',
      name: team.name || team.nickname || '',
      logo: team.logos?.[0]?.href || '',
      color: team.color ? `#${team.color}` : '#666',
      conferenceId: team.groups?.id,
    };
  });
}

function getStat(stats: any[], name: string): string {
  const s = stats.find((st: any) => st.name === name);
  return s?.displayValue || s?.value?.toString() || '0';
}

export function transformStandings(raw: any): ConferenceStandings[] {
  const division = raw?.children?.[0]; // NCAA Division I
  if (!division?.children) return [];

  return division.children.map((conf: any) => {
    const entries: StandingEntry[] = (conf.standings?.entries || []).map((entry: any) => {
      const team = entry.team || {};
      const stats = entry.stats || [];

      // Conference record from 'overall' stat under 'vsconf' or from league-specific stats
      const confWins = parseInt(getStat(stats, 'leagueWins') || getStat(stats, 'wins'), 10) || 0;
      const confLosses = parseInt(getStat(stats, 'leagueLosses') || getStat(stats, 'losses'), 10) || 0;
      const overallWins = parseInt(getStat(stats, 'wins'), 10) || 0;
      const overallLosses = parseInt(getStat(stats, 'losses'), 10) || 0;

      return {
        teamId: team.id || '',
        displayName: team.displayName || team.shortDisplayName || '',
        abbreviation: team.abbreviation || '',
        logo: team.logos?.[0]?.href || '',
        conferenceWins: confWins,
        conferenceLosses: confLosses,
        conferenceWinPct: parseFloat(getStat(stats, 'leagueWinPercent')) || 0,
        overallWins,
        overallLosses,
        overallWinPct: parseFloat(getStat(stats, 'winPercent')) || 0,
        gamesPlayed: parseInt(getStat(stats, 'gamesPlayed'), 10) || 0,
        streak: getStat(stats, 'streak'),
        runDifferential: getStat(stats, 'pointDifferential'),
        runsScored: parseInt(getStat(stats, 'pointsFor'), 10) || 0,
        runsAllowed: parseInt(getStat(stats, 'pointsAgainst'), 10) || 0,
      } satisfies StandingEntry;
    });

    // Sort by conference win pct descending
    entries.sort((a, b) => b.conferenceWinPct - a.conferenceWinPct);

    return {
      conferenceName: conf.name || conf.abbreviation || '',
      conferenceAbbreviation: conf.abbreviation || '',
      conferenceId: conf.id || '',
      entries,
    } satisfies ConferenceStandings;
  });
}
