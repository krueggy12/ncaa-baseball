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
    <div className="min-h-screen bg-[var(--c-bg)]">
      <MatchupHeader game={game} />

      {/* Tab bar */}
      <div className="sticky top-0 z-10 flex glass border-b border-[var(--c-border)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.14em] transition-colors relative ${
              activeTab === tab.id
                ? 'text-[var(--c-text)]'
                : 'text-[var(--c-text-30)] hover:text-[var(--c-text-60)]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-royal rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'linescore' && (
          <div>
            <div className="glass-card rounded-xl border border-[var(--c-border)] overflow-hidden">
              <div className="px-3 pt-3 pb-4">
                <LinescoreTable
                  away={game.away}
                  home={game.home}
                  currentInning={isLive ? game.status.inning : undefined}
                />
              </div>
            </div>

            {(game.venue.name || game.broadcasts.length > 0) && (
              <div className="mt-3 glass-card rounded-xl border border-[var(--c-border)] px-4 py-3 space-y-1">
                {game.venue.name && (
                  <p className="text-[12px] font-semibold text-[var(--c-text-60)]">{game.venue.name}</p>
                )}
                {game.venue.city && (
                  <p className="text-[11px] text-[var(--c-text-30)]">{game.venue.city}{game.venue.state ? `, ${game.venue.state}` : ''}</p>
                )}
                {game.broadcasts.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <svg className="w-3 h-3 text-[var(--c-text-30)] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875C21 4.254 20.496 3.75 19.875 3.75H4.125C3.504 3.75 3 4.254 3 4.875v11.25c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <span className="text-[11px] text-[var(--c-text-30)]">{game.broadcasts.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'boxscore' && (
          <div className="glass-card rounded-xl border border-[var(--c-border)] overflow-hidden px-3 py-3">
            <NcaaBoxScore game={game} />
          </div>
        )}

        {activeTab === 'plays' && (
          <div className="glass-card rounded-xl border border-[var(--c-border)] overflow-hidden px-3 py-2">
            <PlayByPlay plays={summary?.plays || []} />
          </div>
        )}
      </div>
    </div>
  );
}
