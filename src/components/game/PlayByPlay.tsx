interface PlayByPlayProps {
  plays: any[];
}

export default function PlayByPlay({ plays }: PlayByPlayProps) {
  if (!plays || plays.length === 0) {
    return <p className="text-sm text-[var(--c-text-40)] text-center py-4">No play-by-play data available.</p>;
  }

  // Flatten all play items from each inning/period
  const allPlays = plays.flatMap((period: any) => {
    const items = period.plays || period.items || [];
    return items.map((play: any) => ({
      id: play.id || Math.random(),
      text: play.text || play.description || '',
      period: period.period?.number || period.displayValue || '',
      type: play.type?.text || '',
      atBat: play.atBatId || null,
      scoreValue: play.scoreValue || 0,
    }));
  });

  // Show most recent first, limit to 50
  const recent = allPlays.reverse().slice(0, 50);

  return (
    <div className="space-y-2">
      {recent.map((play: any, i: number) => (
        <div
          key={play.id || i}
          className={`text-xs text-[var(--c-text-60)] py-1.5 border-b border-[var(--c-border-faint)] ${
            play.scoreValue > 0 ? 'font-semibold text-royal' : ''
          }`}
        >
          {play.period && (
            <span className="text-[10px] text-[var(--c-text-40)] mr-2">Inn {play.period}</span>
          )}
          {play.text}
        </div>
      ))}
    </div>
  );
}
