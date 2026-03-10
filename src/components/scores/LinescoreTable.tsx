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
    <div className="overflow-x-auto no-scrollbar mt-1.5">
      <table className="w-full text-[11px] tabular-nums text-center">
        <thead>
          <tr className="text-white/25">
            <th className="text-left pl-1 pr-3 py-1 font-bold sticky left-0 bg-[#090f1e]">Team</th>
            {innings.map(i => (
              <th
                key={i}
                className={`px-1.5 py-1 font-semibold min-w-[22px] ${
                  currentInning && i + 1 === currentInning
                    ? 'text-royal-bright font-black'
                    : ''
                }`}
              >
                {i + 1}
              </th>
            ))}
            <th className="px-2 py-1 font-black border-l border-white/[0.08] text-white/50">R</th>
            <th className="px-1.5 py-1 font-semibold text-white/25">H</th>
            <th className="px-1.5 py-1 font-semibold text-white/25">E</th>
          </tr>
        </thead>
        <tbody>
          {[away, home].map(team => (
            <tr key={team.id} className={team.isWinner ? 'text-white' : 'text-white/40'}>
              <td className={`text-left pl-1 pr-3 py-1 font-black sticky left-0 bg-[#090f1e] ${team.isWinner ? 'text-white' : 'text-white/40'}`}>
                {team.abbreviation}
              </td>
              {innings.map(i => (
                <td
                  key={i}
                  className={`px-1.5 py-1 ${
                    currentInning && i + 1 === currentInning
                      ? 'bg-royal/20 text-royal-bright font-bold'
                      : ''
                  } ${team.linescores[i] !== undefined ? '' : 'text-white/15'}`}
                >
                  {team.linescores[i] !== undefined ? team.linescores[i] : '-'}
                </td>
              ))}
              <td className={`px-2 py-1 font-black border-l border-white/[0.08] ${team.isWinner ? 'text-white' : 'text-white/40'}`}>
                {team.score}
              </td>
              <td className="px-1.5 py-1">{team.hits}</td>
              <td className="px-1.5 py-1">{team.errors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
