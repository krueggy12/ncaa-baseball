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
            <h4 className="text-sm font-bold text-[var(--c-text)] mb-2 flex items-center gap-2">
              <img src={teamInfo.logo || ''} className="w-5 h-5" alt="" />
              {teamInfo.displayName || 'Team'}
            </h4>

            {batting && batting.athletes?.length > 0 && (
              <div className="overflow-x-auto no-scrollbar mb-3">
                <table className="w-full text-[11px] tabular-nums">
                  <thead>
                    <tr className="text-[var(--c-text-40)] border-b border-[var(--c-border)]">
                      <th className="text-left py-1 pr-2 font-medium sticky left-0 bg-[var(--c-surface)]">Batters</th>
                      {(batting.labels || []).map((label: string) => (
                        <th key={label} className="px-1 py-1 text-center font-medium">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batting.athletes.map((player: any) => (
                      <tr key={player.athlete?.id || player.athlete?.displayName} className="border-b border-[var(--c-border-faint)] last:border-b-0">
                        <td className="py-1 pr-2 text-left text-[var(--c-text-80)] sticky left-0 bg-[var(--c-surface)] max-w-[100px] truncate">
                          {player.athlete?.shortName || player.athlete?.displayName || ''}
                        </td>
                        {(player.stats || []).map((stat: string, i: number) => (
                          <td key={i} className="px-1 py-1 text-center text-[var(--c-text-60)]">{stat}</td>
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
                    <tr className="text-[var(--c-text-40)] border-b border-[var(--c-border)]">
                      <th className="text-left py-1 pr-2 font-medium sticky left-0 bg-[var(--c-surface)]">Pitchers</th>
                      {(pitching.labels || []).map((label: string) => (
                        <th key={label} className="px-1 py-1 text-center font-medium">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pitching.athletes.map((player: any) => (
                      <tr key={player.athlete?.id || player.athlete?.displayName} className="border-b border-[var(--c-border-faint)] last:border-b-0">
                        <td className="py-1 pr-2 text-left text-[var(--c-text-80)] sticky left-0 bg-[var(--c-surface)] max-w-[100px] truncate">
                          {player.athlete?.shortName || player.athlete?.displayName || ''}
                        </td>
                        {(player.stats || []).map((stat: string, i: number) => (
                          <td key={i} className="px-1 py-1 text-center text-[var(--c-text-60)]">{stat}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Team totals */}
            {stats.length > 0 && (
              <div className="mt-1 text-[10px] text-[var(--c-text-40)] flex gap-3">
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
