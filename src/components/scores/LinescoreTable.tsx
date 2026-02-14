import type { TeamScore } from '../../types/game';

interface LinescoreProps {
  away: TeamScore;
  home: TeamScore;
  currentInning?: number;
}

export default function LinescoreTable({ away, home, currentInning }: LinescoreProps) {
  const maxInnings = Math.max(away.linescores.length, home.linescores.length, 9);
  const innings = Array.from({ length: maxInnings }, (_, i) => i);

  return (
    <div className="overflow-x-auto no-scrollbar mt-2">
      <table className="w-full text-[11px] tabular-nums text-center">
        <thead>
          <tr className="text-gray-400 dark:text-gray-500">
            <th className="text-left pl-2 pr-4 py-1 font-medium sticky left-0 bg-white dark:bg-slate-800">Team</th>
            {innings.map(i => (
              <th
                key={i}
                className={`px-1.5 py-1 font-medium min-w-[24px] ${
                  currentInning && i + 1 === currentInning ? 'text-navy dark:text-blue-400 font-bold' : ''
                }`}
              >
                {i + 1}
              </th>
            ))}
            <th className="px-1.5 py-1 font-bold border-l border-gray-200 dark:border-gray-600">R</th>
            <th className="px-1.5 py-1 font-bold">H</th>
            <th className="px-1.5 py-1 font-bold">E</th>
          </tr>
        </thead>
        <tbody>
          {[away, home].map(team => (
            <tr key={team.id} className={team.isWinner ? 'font-bold' : ''}>
              <td className="text-left pl-2 pr-4 py-1 font-medium sticky left-0 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                {team.abbreviation}
              </td>
              {innings.map(i => (
                <td
                  key={i}
                  className={`px-1.5 py-1 ${
                    currentInning && i + 1 === currentInning ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  } ${team.linescores[i] !== undefined ? '' : 'text-gray-300 dark:text-gray-600'}`}
                >
                  {team.linescores[i] !== undefined ? team.linescores[i] : '-'}
                </td>
              ))}
              <td className="px-1.5 py-1 font-bold border-l border-gray-200 dark:border-gray-600">{team.score}</td>
              <td className="px-1.5 py-1">{team.hits}</td>
              <td className="px-1.5 py-1">{team.errors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
