import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../../types/game';
import { useFavorites } from '../../context/FavoritesContext';
import { toESPNDate } from '../../utils/dateUtils';
import TeamLogo from '../common/TeamLogo';
import RankBadge from '../common/RankBadge';
import StatusBadge from '../common/StatusBadge';
import DiamondGraphic from './DiamondGraphic';
import CountDisplay from './CountDisplay';
import LinescoreTable from './LinescoreTable';

interface GameCardProps {
  game: Game;
}

function TeamRow({ team, isLive, isWinSide }: { team: Game['home']; isLive: boolean; isWinSide: boolean }) {
  return (
    <div className={`flex items-center gap-2 py-1.5 ${isWinSide ? 'font-bold' : ''}`}>
      <RankBadge rank={team.rank} />
      <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={28} />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-900 dark:text-gray-100 truncate block">{team.location}</span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500">{team.record}</span>
      </div>
      <span className={`text-lg tabular-nums min-w-[28px] text-right ${
        isLive ? 'text-gray-900 dark:text-white' : isWinSide ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
      }`}>
        {team.score}
      </span>
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

  // Auto-expand for live games, user can toggle for others
  const [manualToggle, setManualToggle] = useState<boolean | null>(null);
  const expanded = manualToggle !== null ? manualToggle : isLive;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden transition-all ${
        isFavGame ? 'ring-2 ring-yellow-300/50 dark:ring-yellow-500/30' : ''
      } ${isLive ? 'ring-1 ring-live/20' : ''}`}
    >
      <div
        className="px-4 py-2 cursor-pointer"
        onClick={() => setManualToggle(prev => prev !== null ? !prev : !isLive)}
      >
        <TeamRow team={game.away} isLive={isLive} isWinSide={isFinal && game.away.isWinner} />

        <div className="border-t border-gray-50 dark:border-gray-700/50" />

        <TeamRow team={game.home} isLive={isLive} isWinSide={isFinal && game.home.isWinner} />

        {/* Status bar */}
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <StatusBadge state={game.status.state} detail={game.status.detail} />
            {/* Batter/Pitcher for live games */}
            {isLive && game.situation?.pitcher && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[100px]">
                P: {game.situation.pitcher}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Live situation */}
            {isLive && game.situation && (
              <>
                <DiamondGraphic
                  onFirst={game.situation.onFirst}
                  onSecond={game.situation.onSecond}
                  onThird={game.situation.onThird}
                  size={30}
                />
                <CountDisplay
                  balls={game.situation.balls}
                  strikes={game.situation.strikes}
                  outs={game.situation.outs}
                />
              </>
            )}

            {/* Expand indicator */}
            {hasLinescores && !isLive && (
              <svg className={`w-3.5 h-3.5 text-gray-300 dark:text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            )}

            {/* Detail arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const gameDate = game.date ? toESPNDate(new Date(game.date)) : '';
                navigate(`/game/${game.id}${gameDate ? `?date=${gameDate}` : ''}`);
              }}
              className="p-1 text-gray-400 hover:text-royal dark:hover:text-blue-400"
              aria-label="View game details"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded linescore — only when actual data exists */}
      {expanded && hasLinescores && (
        <div className="px-3 pb-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-gray-700">
          <LinescoreTable
            away={game.away}
            home={game.home}
            currentInning={isLive ? game.status.inning : undefined}
          />
          {/* Last play for live games */}
          {isLive && game.situation?.lastPlay && (
            <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-300 italic">
              {game.situation.lastPlay}
            </div>
          )}
          {/* Batter at bat */}
          {isLive && game.situation?.batter && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500">
              AB: {game.situation.batter}
            </div>
          )}
          {game.broadcasts.length > 0 && (
            <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500">
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
