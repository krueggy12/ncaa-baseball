import { useNcaaBoxScore } from '../../hooks/useNcaaBoxScore';
import TeamLogo from '../common/TeamLogo';
import type { Game, TeamScore } from '../../types/game';
import type { NcaaBoxScoreData } from '../../api/ncaaStatsClient';

function BattingTable({ players }: { players: NcaaBoxScoreData['batting'] }) {
  if (players.length === 0) return null;

  const totals = players.reduce(
    (acc, p) => ({
      ab: acc.ab + p.ab,
      r: acc.r + p.r,
      h: acc.h + p.h,
      rbi: acc.rbi + p.rbi,
      bb: acc.bb + p.bb,
      k: acc.k + p.k,
    }),
    { ab: 0, r: 0, h: 0, rbi: 0, bb: 0, k: 0 }
  );

  const cell = 'px-1.5 py-1 text-center text-gray-600 dark:text-gray-400';
  const hdr = 'px-1.5 py-1 text-center font-medium';

  return (
    <div className="overflow-x-auto no-scrollbar mb-4">
      <table className="w-full text-[11px] tabular-nums">
        <thead>
          <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
            <th className="text-left py-1 pr-2 font-medium sticky left-0 bg-white dark:bg-slate-800 min-w-[90px]">
              Batters
            </th>
            <th className={hdr}>AB</th>
            <th className={hdr}>R</th>
            <th className={hdr}>H</th>
            <th className={hdr}>RBI</th>
            <th className={hdr}>BB</th>
            <th className={hdr}>K</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50">
              <td className="py-1 pr-2 text-left text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-slate-800 truncate max-w-[90px]">
                {p.name}
              </td>
              <td className={cell}>{p.ab}</td>
              <td className={cell}>{p.r}</td>
              <td className={cell}>{p.h}</td>
              <td className={cell}>{p.rbi}</td>
              <td className={cell}>{p.bb}</td>
              <td className={cell}>{p.k}</td>
            </tr>
          ))}
          <tr className="border-t border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300">
            <td className="py-1 pr-2 text-left sticky left-0 bg-white dark:bg-slate-800">Totals</td>
            <td className="px-1.5 py-1 text-center">{totals.ab}</td>
            <td className="px-1.5 py-1 text-center">{totals.r}</td>
            <td className="px-1.5 py-1 text-center">{totals.h}</td>
            <td className="px-1.5 py-1 text-center">{totals.rbi}</td>
            <td className="px-1.5 py-1 text-center">{totals.bb}</td>
            <td className="px-1.5 py-1 text-center">{totals.k}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PitchingTable({ players }: { players: NcaaBoxScoreData['pitching'] }) {
  if (players.length === 0) return null;

  const cell = 'px-1.5 py-1 text-center text-gray-600 dark:text-gray-400';
  const hdr = 'px-1.5 py-1 text-center font-medium';

  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-[11px] tabular-nums">
        <thead>
          <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
            <th className="text-left py-1 pr-2 font-medium sticky left-0 bg-white dark:bg-slate-800 min-w-[90px]">
              Pitchers
            </th>
            <th className={hdr}>IP</th>
            <th className={hdr}>H</th>
            <th className={hdr}>R</th>
            <th className={hdr}>ER</th>
            <th className={hdr}>BB</th>
            <th className={hdr}>K</th>
            <th className={hdr}>HR</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50">
              <td className="py-1 pr-2 text-left text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-slate-800 truncate max-w-[90px]">
                {p.name}
              </td>
              <td className={cell}>{p.ip}</td>
              <td className={cell}>{p.h}</td>
              <td className={cell}>{p.r}</td>
              <td className={cell}>{p.er}</td>
              <td className={cell}>{p.bb}</td>
              <td className={cell}>{p.k}</td>
              <td className={cell}>{p.hr || '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamSection({
  team,
  batting,
  pitching,
}: {
  team: TeamScore;
  batting: NcaaBoxScoreData['batting'];
  pitching: NcaaBoxScoreData['pitching'];
}) {
  if (batting.length === 0 && pitching.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={20} />
        {team.displayName}
      </h4>
      <BattingTable players={batting} />
      <PitchingTable players={pitching} />
    </div>
  );
}

export default function NcaaBoxScore({ game }: { game: Game }) {
  const { data, isLoading, error } = useNcaaBoxScore(game);

  if (game.status.state === 'pre') {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
        Box score available after game starts.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="py-10 flex flex-col items-center gap-2">
        <div className="w-5 h-5 border-2 border-royal border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 dark:text-gray-500">Loading box score…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
        Box score not available.
      </p>
    );
  }

  const awayBatting = data.batting.filter(p => p.team === 'away');
  const homeBatting = data.batting.filter(p => p.team === 'home');
  const awayPitching = data.pitching.filter(p => p.team === 'away');
  const homePitching = data.pitching.filter(p => p.team === 'home');

  return (
    <div className="space-y-6">
      <TeamSection team={game.away} batting={awayBatting} pitching={awayPitching} />
      <TeamSection team={game.home} batting={homeBatting} pitching={homePitching} />
    </div>
  );
}
