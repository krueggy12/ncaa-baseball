import type { Game } from '../../types/game';
import TeamLogo from '../common/TeamLogo';
import DiamondGraphic from '../scores/DiamondGraphic';
import CountDisplay from '../scores/CountDisplay';
import { useTop25RankMap } from '../../context/Top25Context';

interface Props {
  game: Game;
}

export default function MatchupHeader({ game }: Props) {
  const isLive = game.status.state === 'in';
  const isFinal = game.status.state === 'post';
  const isPre = game.status.state === 'pre';
  const rankMap = useTop25RankMap();
  const awayRank = rankMap.get(game.away.id);
  const homeRank = rankMap.get(game.home.id);

  const gameTime = (() => {
    if (!game.date) return '';
    try {
      return new Date(game.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch { return ''; }
  })();

  return (
    <div className="relative bg-[var(--c-surface)] border-b border-[var(--c-border)]">
      {/* Subtle top accent for live games */}
      {isLive && <div className="h-[2px] bg-gradient-to-r from-transparent via-d1red/60 to-transparent" />}

      <div className="px-4 pt-5 pb-6">
        {/* Status badge — centered above teams */}
        <div className="flex justify-center mb-4">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-d1red/10 border border-d1red/20">
              <span className="w-1.5 h-1.5 rounded-full bg-d1red animate-glow-live shrink-0" />
              <span className="text-[11px] font-black text-d1red uppercase tracking-wider">
                {game.status.shortDetail || game.status.detail}
              </span>
            </div>
          ) : isFinal ? (
            <div className="px-3 py-1 rounded-full bg-[var(--c-overlay)] border border-[var(--c-border-faint)]">
              <span className="text-[11px] font-black text-[var(--c-text-40)] uppercase tracking-widest">Final</span>
            </div>
          ) : isPre ? (
            <div className="px-3 py-1 rounded-full bg-[var(--c-overlay)] border border-[var(--c-border-faint)]">
              <span className="text-[11px] font-bold text-[var(--c-text-50)] uppercase tracking-wider">{gameTime}</span>
            </div>
          ) : null}
        </div>

        {/* Teams row */}
        <div className="flex items-center justify-between gap-2">
          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <TeamLogo
              src={game.away.logo}
              alt={game.away.displayName}
              abbreviation={game.away.abbreviation}
              size={60}
            />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {awayRank != null && (
                  <span className="text-[9px] font-black text-royal-bright"># {awayRank}</span>
                )}
                <span className={`text-[15px] font-black tracking-tight leading-none ${
                  isFinal && !game.away.isWinner ? 'text-[var(--c-text-30)]' : 'text-[var(--c-text)]'
                }`}>
                  {game.away.abbreviation}
                </span>
              </div>
              {game.away.record && (
                <span className="text-[10px] text-[var(--c-text-30)] font-medium block mt-0.5">{game.away.record}</span>
              )}
            </div>
            {(isLive || isFinal) && (
              <span className={`text-[42px] font-black tabular-nums leading-none ${
                isFinal && !game.away.isWinner ? 'text-[var(--c-text-30)]' : 'text-[var(--c-text)]'
              }`}>
                {game.away.score}
              </span>
            )}
          </div>

          {/* Center — situation when live */}
          <div className="flex flex-col items-center gap-2 px-2 shrink-0">
            {isLive && game.situation ? (
              <>
                <DiamondGraphic
                  onFirst={game.situation.onFirst}
                  onSecond={game.situation.onSecond}
                  onThird={game.situation.onThird}
                  size={40}
                />
                <CountDisplay
                  balls={game.situation.balls}
                  strikes={game.situation.strikes}
                  outs={game.situation.outs}
                />
              </>
            ) : (
              <div className="w-8 h-px bg-[var(--c-border-faint)]" />
            )}
          </div>

          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <TeamLogo
              src={game.home.logo}
              alt={game.home.displayName}
              abbreviation={game.home.abbreviation}
              size={60}
            />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {homeRank != null && (
                  <span className="text-[9px] font-black text-royal-bright"># {homeRank}</span>
                )}
                <span className={`text-[15px] font-black tracking-tight leading-none ${
                  isFinal && !game.home.isWinner ? 'text-[var(--c-text-30)]' : 'text-[var(--c-text)]'
                }`}>
                  {game.home.abbreviation}
                </span>
              </div>
              {game.home.record && (
                <span className="text-[10px] text-[var(--c-text-30)] font-medium block mt-0.5">{game.home.record}</span>
              )}
            </div>
            {(isLive || isFinal) && (
              <span className={`text-[42px] font-black tabular-nums leading-none ${
                isFinal && !game.home.isWinner ? 'text-[var(--c-text-30)]' : 'text-[var(--c-text)]'
              }`}>
                {game.home.score}
              </span>
            )}
          </div>
        </div>

        {/* Conference badge */}
        {game.isConferenceGame && (
          <div className="flex justify-center mt-4">
            <span className="text-[9px] font-black text-royal-bright/50 uppercase tracking-[0.2em]">Conference Game</span>
          </div>
        )}
      </div>
    </div>
  );
}
