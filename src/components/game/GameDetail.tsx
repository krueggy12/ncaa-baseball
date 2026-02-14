import type { Game } from '../../types/game';
import type { GameSummary } from '../../hooks/useGameDetail';
import MatchupHeader from './MatchupHeader';
import LinescoreTable from '../scores/LinescoreTable';
import BoxScore from './BoxScore';
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
      <div className="flex bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab.id
                ? 'text-royal dark:text-blue-400 border-b-2 border-royal dark:border-blue-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-slate-800 p-4">
        {activeTab === 'linescore' && (
          <div>
            <LinescoreTable
              away={game.away}
              home={game.home}
              currentInning={isLive ? game.status.inning : undefined}
            />
            {game.venue.name && (
              <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                <p>{game.venue.name}</p>
                {game.venue.city && <p>{game.venue.city}, {game.venue.state}</p>}
              </div>
            )}
            {game.broadcasts.length > 0 && (
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Broadcast: {game.broadcasts.join(', ')}
              </div>
            )}
          </div>
        )}

        {activeTab === 'boxscore' && summary?.boxScore && (
          <BoxScore boxScore={summary.boxScore} />
        )}
        {activeTab === 'boxscore' && !summary?.boxScore && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            Box score data not yet available.
          </p>
        )}

        {activeTab === 'plays' && (
          <PlayByPlay plays={summary?.plays || []} />
        )}
      </div>
    </div>
  );
}
