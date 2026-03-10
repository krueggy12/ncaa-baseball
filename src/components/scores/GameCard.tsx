import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../../types/game';
import { useFavorites } from '../../context/FavoritesContext';
import { toESPNDate } from '../../utils/dateUtils';
import TeamLogo from '../common/TeamLogo';
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
    <div className={`flex flex-col items-center gap-1.5 w-[96px] shrink-0 transition-opacity duration-300 ${dimmed ? 'opacity-35' : ''}`}>
      <div className="relative">
        <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={52} />
      </div>
      {team.rank != null && (
        <span className="text-[10px] font-black text-royal-bright bg-royal/15 rounded-full px-2 py-0.5 leading-none ring-1 ring-royal/30">
          #{team.rank}
        </span>
      )}
      <span className="text-[12px] font-bold text-white/90 text-center leading-tight line-clamp-2 mt-0.5">
        {team.location}
      </span>
      {team.record ? (
        <span className="text-[10px] text-white/30 font-medium">{team.record}</span>
      ) : null}
    </div>
  );
}

function ScoreCenter({ game }: { game: Game }) {
  const isLive = game.status.state === 'in';
  const isFinal = game.status.state === 'post';

  if (isLive || isFinal) {
    const awayWin = !isFinal || game.away.isWinner;
    const homeWin = !isFinal || game.home.isWinner;
    return (
      <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 min-w-0">
        <div className="flex items-center gap-3">
          <span className={`text-[42px] font-black tabular-nums leading-none tracking-tight ${awayWin ? 'text-white' : 'text-white/25'}`}>
            {game.away.score}
          </span>
          <span className="text-white/15 text-2xl font-thin select-none">|</span>
          <span className={`text-[42px] font-black tabular-nums leading-none tracking-tight ${homeWin ? 'text-white' : 'text-white/25'}`}>
            {game.home.score}
          </span>
        </div>
        {isFinal && (
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Final</span>
        )}
        {isLive && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-d1red/15 ring-1 ring-d1red/30">
            <span className="w-1.5 h-1.5 rounded-full bg-d1red animate-glow-live shrink-0" />
            <span className="text-[11px] font-black text-d1red leading-none">
              {game.status.shortDetail}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Pre-game
  return (
    <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 min-w-0">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">vs</span>
        <span className="text-[15px] font-bold text-white/80 text-center leading-tight">
          {game.status.shortDetail}
        </span>
      </div>
      {game.broadcasts.length > 0 && (
        <span className="text-[10px] text-white/25 text-center truncate max-w-full bg-white/5 px-2 py-0.5 rounded-full">
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
      className={`rounded-2xl overflow-hidden transition-all duration-200 card-hover ${
        isLive
          ? 'live-card-glow bg-surface-dark dark:bg-[#0e1525]'
          : isFavGame
          ? 'bg-surface-dark dark:bg-[#0e1525] ring-1 ring-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.05)]'
          : 'bg-surface-dark dark:bg-[#0b1225]'
      } border border-white/[0.06]`}
    >
      {/* Conference game indicator */}
      {game.isConferenceGame && (
        <div className="h-[2px] bg-gradient-to-r from-royal/60 via-royal/20 to-transparent" />
      )}

      {/* Main matchup area */}
      <div
        className="px-3 pt-4 pb-3 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <TeamColumn team={game.away} isFinal={isFinal} isWinner={game.away.isWinner} />
          <ScoreCenter game={game} />
          <TeamColumn team={game.home} isFinal={isFinal} isWinner={game.home.isWinner} />
        </div>
      </div>

      {/* Status / info bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/20 border-t border-white/[0.05]">
        <div className="flex items-center gap-2 min-w-0">
          {isLive && game.situation?.pitcher && (
            <span className="text-[10px] text-white/30 truncate max-w-[120px]">
              P: {game.situation.pitcher}
            </span>
          )}
          {!isLive && game.status.state === 'pre' && (
            <span className="text-[10px] font-semibold text-royal-bright/70 uppercase tracking-wide">Scheduled</span>
          )}
          {!isLive && game.status.state === 'post' && game.isConferenceGame && (
            <span className="text-[10px] font-semibold text-royal-bright/50 uppercase tracking-wide">Conf.</span>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isLive && game.situation && (
            <>
              <DiamondGraphic
                onFirst={game.situation.onFirst}
                onSecond={game.situation.onSecond}
                onThird={game.situation.onThird}
                size={26}
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
              className="p-1 text-white/20 hover:text-white/50 transition-colors"
              aria-label={expanded ? 'Collapse linescore' : 'Expand linescore'}
            >
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
            className="p-1.5 text-white/20 hover:text-royal-bright transition-colors rounded-lg hover:bg-royal/10"
            aria-label="View game details"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded linescore */}
      {expanded && hasLinescores && (
        <div className="px-3 pt-2 pb-3 bg-black/15 border-t border-white/[0.04]">
          <LinescoreTable
            away={game.away}
            home={game.home}
            currentInning={isLive ? game.status.inning : undefined}
          />
          {isLive && game.situation?.lastPlay && (
            <div className="mt-2 text-[11px] text-white/40 italic leading-snug">
              {game.situation.lastPlay}
            </div>
          )}
          {isLive && game.situation?.batter && (
            <div className="text-[10px] text-white/30 mt-1">
              AB: {game.situation.batter}
            </div>
          )}
          {!isLive && game.broadcasts.length > 0 && (
            <div className="mt-1.5 text-[10px] text-white/25">
              {game.broadcasts.join(' / ')}
            </div>
          )}
          {game.venue.name && (
            <div className="text-[10px] text-white/25 mt-0.5">
              {game.venue.name}{game.venue.city ? `, ${game.venue.city}` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(GameCardInner);
