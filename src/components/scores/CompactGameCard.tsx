import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../../types/game';
import { toESPNDate } from '../../utils/dateUtils';
import { useTop25RankMap } from '../../context/Top25Context';
import TeamLogo from '../common/TeamLogo';

function CompactGameCard({ game }: { game: Game }) {
  const navigate = useNavigate();
  const rankMap = useTop25RankMap();
  const isLive = game.status.state === 'in';
  const isFinal = game.status.state === 'post';
  const isPre = game.status.state === 'pre';

  const awayRank = rankMap.get(game.away.id);
  const homeRank = rankMap.get(game.home.id);

  const gameTime = (() => {
    if (!game.date) return '';
    try {
      return new Date(game.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch { return ''; }
  })();

  const handleTap = () => {
    const gameDate = game.date ? toESPNDate(new Date(game.date)) : '';
    navigate(`/game/${game.id}${gameDate ? `?date=${gameDate}` : ''}`);
  };

  return (
    <div
      onClick={handleTap}
      className={`rounded-lg overflow-hidden border cursor-pointer active:scale-[0.97] transition-transform duration-100 ${
        isLive
          ? 'live-card-glow glass-card border-[var(--c-border-strong)]'
          : 'glass-card border-[var(--c-border)]'
      }`}
    >
      {/* Conference accent line */}
      {game.isConferenceGame && (
        <div className="h-[2px] bg-gradient-to-r from-royal/70 via-royal/20 to-transparent" />
      )}

      {/* Status header — live and final only */}
      {(isLive || isFinal) && (
        <div className={`flex items-center justify-between px-2.5 py-1.5 border-b ${
          isLive ? 'bg-d1red/[0.08] border-d1red/10' : 'bg-[var(--c-overlay)] border-[var(--c-border-faint)]'
        }`}>
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-d1red animate-glow-live shrink-0" />
              <span className="text-[9px] font-black text-d1red uppercase tracking-wide leading-none">
                {game.status.shortDetail}
              </span>
            </div>
          ) : (
            <span className="text-[9px] font-black text-[var(--c-text-25)] uppercase tracking-[0.15em]">Final</span>
          )}
          {game.isConferenceGame && (
            <span className="text-[8px] font-black text-royal-bright/40 uppercase tracking-widest shrink-0 ml-1">
              CONF
            </span>
          )}
        </div>
      )}

      {/* Teams */}
      <div className="px-2.5 py-2.5 flex gap-2">

        {/* Team rows — scores inline so they center perfectly with each row */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Away */}
          <div className="flex items-center gap-1.5">
            <TeamLogo src={game.away.logo} alt={game.away.displayName} abbreviation={game.away.abbreviation} size={24} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                {awayRank != null && (
                  <span className="text-[7px] font-black text-royal-bright shrink-0">#{awayRank}</span>
                )}
                <span className={`text-[12px] font-black leading-tight truncate ${
                  isFinal && !game.away.isWinner ? 'text-[var(--c-text-25)]' : 'text-[var(--c-text)]'
                }`}>
                  {game.away.abbreviation}
                </span>
              </div>
              {game.away.record && (
                <span className="text-[9px] text-[var(--c-text-25)] font-medium mt-0.5 block">{game.away.record}</span>
              )}
            </div>
            {(isLive || isFinal) && (
              <span className={`shrink-0 text-[14px] font-black tabular-nums leading-none ${
                isFinal && !game.away.isWinner ? 'text-[var(--c-text-20)]' : 'text-[var(--c-text)]'
              }`}>
                {game.away.score}
              </span>
            )}
            {isPre && (
              <span className="shrink-0 text-[11px] font-bold text-[var(--c-text-55)] leading-none">{gameTime}</span>
            )}
          </div>

          {/* Home */}
          <div className="flex items-center gap-1.5">
            <TeamLogo src={game.home.logo} alt={game.home.displayName} abbreviation={game.home.abbreviation} size={24} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                {homeRank != null && (
                  <span className="text-[7px] font-black text-royal-bright shrink-0">#{homeRank}</span>
                )}
                <span className={`text-[12px] font-black leading-tight truncate ${
                  isFinal && !game.home.isWinner ? 'text-[var(--c-text-25)]' : 'text-[var(--c-text)]'
                }`}>
                  {game.home.abbreviation}
                </span>
              </div>
              {game.home.record && (
                <span className="text-[9px] text-[var(--c-text-25)] font-medium mt-0.5 block">{game.home.record}</span>
              )}
            </div>
            {(isLive || isFinal) && (
              <span className={`shrink-0 text-[14px] font-black tabular-nums leading-none ${
                isFinal && !game.home.isWinner ? 'text-[var(--c-text-20)]' : 'text-[var(--c-text)]'
              }`}>
                {game.home.score}
              </span>
            )}
            {isPre && game.broadcasts.length > 0 && (
              <span className="shrink-0 text-[9px] font-semibold text-[var(--c-text-30)] leading-none truncate max-w-[52px]">
                {game.broadcasts[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CompactGameCard);
