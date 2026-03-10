import type { Game } from '../../types/game';
import type { GameSummary } from '../../hooks/useGameDetail';
import MatchupHeader from './MatchupHeader';
import LinescoreTable from '../scores/LinescoreTable';
import NcaaBoxScore from './NcaaBoxScore';
import PlayByPlay from './PlayByPlay';
import { useState } from 'react';

interface Props {
  game: Game;
  summary: GameSummary | null;
}

type Tab = 'linescore' | 'boxscore' | 'plays';

export default function GameDetail({ game, summary }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('linescore');
  const isLive = game.status.state === 'in';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'linescore', label: 'Linescore' },
    { id: 'boxscore', label: 'Box Score' },
    { id: 'plays', label: 'Plays' },
  ];

  return (
    <div>
      <MatchupHeader game={game} />

      {/* Tabs */}
      <div className="flex bg-[var(--c-surface)] border-b border-[var(--c-border)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab.id
                ? 'text-royal border-b-2 border-royal'
                : 'text-[var(--c-text-40)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[var(--c-surface)] p-4">
        {activeTab === 'linescore' && (
          <div>
            <LinescoreTable
              away={game.away}
              home={game.home}
              currentInning={isLive ? game.status.inning : undefined}
            />
            {game.venue.name && (
              <div className="mt-4 text-xs text-[var(--c-text-40)]">
                <p>{game.venue.name}</p>
                {game.venue.city && <p>{game.venue.city}, {game.venue.state}</p>}
              </div>
            )}
            {game.broadcasts.length > 0 && (
              <div className="mt-2 text-xs text-[var(--c-text-40)]">
                Broadcast: {game.broadcasts.join(', ')}
              </div>
            )}
          </div>
        )}

        {activeTab === 'boxscore' && (
          <NcaaBoxScore game={game} />
        )}

        {activeTab === 'plays' && (
          <PlayByPlay plays={summary?.plays || []} />
        )}
      </div>
    </div>
  );
}
