import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../../types/game';
import { toESPNDate } from '../../utils/dateUtils';
import TeamLogo from '../common/TeamLogo';

function CompactGameCard({ game }: { game: Game }) {
  const navigate = useNavigate();
  const isLive = game.status.state === 'in';
  const isFinal = game.status.state === 'post';
  const isPre = game.status.state === 'pre';

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
          ? 'live-card-glow bg-surface-dark border-white/[0.08]'
          : 'bg-surface-dark border-white/[0.06]'
      }`}
    >
      {/* Conference accent line */}
      {game.isConferenceGame && (
        <div className="h-[2px] bg-gradient-to-r from-royal/70 via-royal/20 to-transparent" />
      )}

      {/* Status header — live and final only */}
      {(isLive || isFinal) && (
        <div className={`flex items-center justify-between px-2.5 py-1.5 border-b ${
          isLive ? 'bg-d1red/[0.08] border-d1red/10' : 'bg-black/25 border-white/[0.04]'
        }`}>
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-d1red animate-glow-live shrink-0" />
              <span className="text-[9px] font-black text-d1red uppercase tracking-wide leading-none">
                {game.status.shortDetail}
              </span>
            </div>
          ) : (
            <span className="text-[9px] font-black text-white/25 uppercase tracking-[0.15em]">Final</span>
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

        {/* Left: team rows */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Away */}
          <div className="flex items-center gap-1.5">
            <TeamLogo src={game.away.logo} alt={game.away.displayName} abbreviation={game.away.abbreviation} size={24} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                {game.away.rank != null && (
                  <span className="text-[7px] font-black text-royal-bright shrink-0">#{game.away.rank}</span>
                )}
                <span className={`text-[12px] font-black leading-none truncate ${
                  isFinal && !game.away.isWinner ? 'text-white/25' : 'text-white'
                }`}>
                  {game.away.abbreviation}
                </span>
              </div>
              {game.away.record && (
                <span className="text-[9px] text-white/25 font-medium leading-none">{game.away.record}</span>
              )}
            </div>
          </div>

          {/* Home */}
          <div className="flex items-center gap-1.5">
            <TeamLogo src={game.home.logo} alt={game.home.displayName} abbreviation={game.home.abbreviation} size={24} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                {game.home.rank != null && (
                  <span className="text-[7px] font-black text-royal-bright shrink-0">#{game.home.rank}</span>
                )}
                <span className={`text-[12px] font-black leading-none truncate ${
                  isFinal && !game.home.isWinner ? 'text-white/25' : 'text-white'
                }`}>
                  {game.home.abbreviation}
                </span>
              </div>
              {game.home.record && (
                <span className="text-[9px] text-white/25 font-medium leading-none">{game.home.record}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: time+channel (pre) or scores (live/final) */}
        <div className="shrink-0 flex flex-col items-end justify-center gap-1.5">
          {isPre ? (
            <>
              <span className="text-[12px] font-bold text-white/60 leading-none">{gameTime}</span>
              {game.broadcasts.length > 0 && (
                <span className="text-[9px] font-semibold text-white/30 leading-none text-right max-w-[56px] truncate">
                  {game.broadcasts[0]}
                </span>
              )}
              {game.isConferenceGame && !game.broadcasts.length && (
                <span className="text-[8px] font-black text-royal-bright/40 uppercase tracking-widest">CONF</span>
              )}
            </>
          ) : (
            <>
              <span className={`text-[15px] font-black tabular-nums leading-none ${
                isFinal && !game.away.isWinner ? 'text-white/20' : 'text-white'
              }`}>
                {game.away.score}
              </span>
              <span className={`text-[15px] font-black tabular-nums leading-none ${
                isFinal && !game.home.isWinner ? 'text-white/20' : 'text-white'
              }`}>
                {game.home.score}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(CompactGameCard);
