import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../../types/game';
import { useFavorites } from '../../context/FavoritesContext';
import { toESPNDate } from '../../utils/dateUtils';
import TeamLogo from '../common/TeamLogo';
import StatusBadge from '../common/StatusBadge';
import DiamondGraphic from './DiamondGraphic';
import CountDisplay from './CountDisplay';
import LinescoreTable from './LinescoreTable';

interface GameCardProps {
  game: Game;
}

function TeamColumn({
  team,
  isFinal,
  isWinner,
}: {
  team: Game['home'];
  isFinal: boolean;
  isWinner: boolean;
}) {
  const dimmed = isFinal && !isWinner;
  return (
    <div className={`flex flex-col items-center gap-1 w-[100px] shrink-0 transition-opacity ${dimmed ? 'opacity-40' : ''}`}>
      <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={50} />
      {team.rank != null && (
        <span className="text-[10px] font-bold text-royal dark:text-blue-400 bg-royal/10 dark:bg-royal/15 rounded-full px-1.5 py-0.5 leading-none">
          #{team.rank}
        </span>
      )}
      <span className="text-[12px] font-semibold text-gray-900 dark:text-white text-center leading-tight line-clamp-2 mt-0.5">
        {team.location}
      </span>
      {team.record ? (
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{team.record}</span>
      ) : null}
    </div>
  );
}

function ScoreCenter({ game }: { game: Game }) {
  const isLive = game.status.state === 'in';
  const isFinal = game.status.state === 'post';

  if (isLive || isFinal) {
    const awayBold = !isFinal || game.away.isWinner;
    const homeBold = !isFinal || game.home.isWinner;
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 flex-1 px-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-black tabular-nums leading-none ${awayBold ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
            {game.away.score}
          </span>
          <span className="text-gray-300 dark:text-gray-600 text-lg font-light select-none">–</span>
          <span className={`text-3xl font-black tabular-nums leading-none ${homeBold ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
            {game.home.score}
          </span>
        </div>
        {isFinal && (
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Final</span>
        )}
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse-live shrink-0" />
            <span className="text-[11px] font-semibold text-live text-center leading-tight">
              {game.status.shortDetail}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Pre-game: show scheduled time
  return (
    <div className="flex flex-col items-center justify-center gap-1 flex-1 px-2 min-w-0">
      <span className="text-base font-bold text-gray-900 dark:text-white text-center leading-tight">
        {game.status.shortDetail}
      </span>
      {game.broadcasts.length > 0 && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center truncate max-w-full">
          {game.broadcasts[0]}
        </span>
      )}
    </div>
  );
}

function GameCardInner({ game }: GameCardProps) {
  const navigate = useNavigate();
  const { isFavorite } = useFavorites();
  const isLive = game.status.state === 'in';
  const isFinal = game.status.state === 'post';
  const isFavGame = isFavorite(game.home.id) || isFavorite(game.away.id);
  const hasLinescores = game.away.linescores.length > 0 || game.home.linescores.length > 0;

  const [manualToggle, setManualToggle] = useState<boolean | null>(null);
  const expanded = manualToggle !== null ? manualToggle : isLive;

  const handleCardClick = () => setManualToggle(prev => prev !== null ? !prev : !isLive);

  return (
    <div
      className={`rounded-2xl overflow-hidden bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/[0.06] shadow-sm dark:shadow-none transition-all ${
        isFavGame ? 'ring-1 ring-amber-400/40 dark:ring-amber-400/20' : ''
      }`}
    >
      {/* Main matchup area */}
      <div
        className="px-3 pt-4 pb-3 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <TeamColumn
            team={game.away}
            isFinal={isFinal}
            isWinner={game.away.isWinner}
          />
          <ScoreCenter game={game} />
          <TeamColumn
            team={game.home}
            isFinal={isFinal}
            isWinner={game.home.isWinner}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50/80 dark:bg-white/[0.03] border-t border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-2 min-w-0">
          {!isLive && (
            <StatusBadge state={game.status.state} detail={game.status.detail} />
          )}
          {isLive && game.situation?.pitcher && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[110px]">
              P: {game.situation.pitcher}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLive && game.situation && (
            <>
              <DiamondGraphic
                onFirst={game.situation.onFirst}
                onSecond={game.situation.onSecond}
                onThird={game.situation.onThird}
                size={28}
              />
              <CountDisplay
                balls={game.situation.balls}
                strikes={game.situation.strikes}
                outs={game.situation.outs}
              />
            </>
          )}

          {hasLinescores && !isLive && (
            <button
              onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
              className="p-0.5 text-gray-300 dark:text-gray-600"
              aria-label={expanded ? 'Collapse linescore' : 'Expand linescore'}
            >
              <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              const gameDate = game.date ? toESPNDate(new Date(game.date)) : '';
              navigate(`/game/${game.id}${gameDate ? `?date=${gameDate}` : ''}`);
            }}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-royal dark:hover:text-blue-400 transition-colors"
            aria-label="View game details"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded linescore */}
      {expanded && hasLinescores && (
        <div className="px-3 pt-2 pb-3 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/[0.05]">
          <LinescoreTable
            away={game.away}
            home={game.home}
            currentInning={isLive ? game.status.inning : undefined}
          />
          {isLive && game.situation?.lastPlay && (
            <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-300 italic">
              {game.situation.lastPlay}
            </div>
          )}
          {isLive && game.situation?.batter && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500">
              AB: {game.situation.batter}
            </div>
          )}
          {!isLive && game.broadcasts.length > 0 && (
            <div className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
              {game.broadcasts.join(' / ')}
            </div>
          )}
          {game.venue.name && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500">
              {game.venue.name}{game.venue.city ? `, ${game.venue.city}` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(GameCardInner);
