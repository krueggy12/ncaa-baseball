interface BoxScoreProps {
  boxScore: any;
}

export default function BoxScore({ boxScore }: BoxScoreProps) {
  if (!boxScore?.teams) return null;

  const teams = boxScore.teams || [];

  return (
    <div className="space-y-6">
      {teams.map((team: any, idx: number) => {
        const teamInfo = team.team || {};
        const stats = team.statistics || [];
        const players = boxScore.players?.[idx]?.statistics || [];
        const batting = players.find((p: any) => p.name === 'batting' || p.type === 'batting');
        const pitching = players.find((p: any) => p.name === 'pitching' || p.type === 'pitching');

        return (
          <div key={teamInfo.id || idx}>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <img src={teamInfo.logo || ''} className="w-5 h-5" alt="" />
              {teamInfo.displayName || 'Team'}
            </h4>

            {batting && batting.athletes?.length > 0 && (
              <div className="overflow-x-auto no-scrollbar mb-3">
                <table className="w-full text-[11px] tabular-nums">
                  <thead>
                    <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left py-1 pr-2 font-medium sticky left-0 bg-white dark:bg-slate-800">Batters</th>
                      {(batting.labels || []).map((label: string) => (
                        <th key={label} className="px-1 py-1 text-center font-medium">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batting.athletes.map((player: any) => (
                      <tr key={player.athlete?.id || player.athlete?.displayName} className="border-b border-gray-50 dark:border-gray-700/50">
                        <td className="py-1 pr-2 text-left text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-slate-800 max-w-[100px] truncate">
                          {player.athlete?.shortName || player.athlete?.displayName || ''}
                        </td>
                        {(player.stats || []).map((stat: string, i: number) => (
                          <td key={i} className="px-1 py-1 text-center text-gray-600 dark:text-gray-400">{stat}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pitching && pitching.athletes?.length > 0 && (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-[11px] tabular-nums">
                  <thead>
                    <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left py-1 pr-2 font-medium sticky left-0 bg-white dark:bg-slate-800">Pitchers</th>
                      {(pitching.labels || []).map((label: string) => (
                        <th key={label} className="px-1 py-1 text-center font-medium">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pitching.athletes.map((player: any) => (
                      <tr key={player.athlete?.id || player.athlete?.displayName} className="border-b border-gray-50 dark:border-gray-700/50">
                        <td className="py-1 pr-2 text-left text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-slate-800 max-w-[100px] truncate">
                          {player.athlete?.shortName || player.athlete?.displayName || ''}
                        </td>
                        {(player.stats || []).map((stat: string, i: number) => (
                          <td key={i} className="px-1 py-1 text-center text-gray-600 dark:text-gray-400">{stat}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Team totals */}
            {stats.length > 0 && (
              <div className="mt-1 text-[10px] text-gray-400 dark:text-gray-500 flex gap-3">
                {stats.slice(0, 5).map((s: any) => (
                  <span key={s.name}>{s.displayName}: {s.displayValue}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
