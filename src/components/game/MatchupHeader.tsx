import type { Game } from '../../types/game';
import TeamLogo from '../common/TeamLogo';
import RankBadge from '../common/RankBadge';
import StatusBadge from '../common/StatusBadge';
import DiamondGraphic from '../scores/DiamondGraphic';
import CountDisplay from '../scores/CountDisplay';

interface Props {
  game: Game;
}

export default function MatchupHeader({ game }: Props) {
  const isLive = game.status.state === 'in';

  return (
    <div className="bg-navy text-white px-4 py-5">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Away team */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <TeamLogo src={game.away.logo} alt={game.away.displayName} abbreviation={game.away.abbreviation} size={48} />
          <div className="flex items-center gap-1">
            <RankBadge rank={game.away.rank} />
            <span className="text-sm font-semibold">{game.away.abbreviation}</span>
          </div>
          <span className="text-xs text-blue-200">{game.away.record}</span>
          <span className="text-3xl font-bold tabular-nums">{game.away.score}</span>
        </div>

        {/* Center status */}
        <div className="flex flex-col items-center gap-2 px-4">
          <StatusBadge state={game.status.state} detail={game.status.detail} />
          {isLive && game.situation && (
            <>
              <DiamondGraphic
                onFirst={game.situation.onFirst}
                onSecond={game.situation.onSecond}
                onThird={game.situation.onThird}
                size={44}
              />
              <CountDisplay
                balls={game.situation.balls}
                strikes={game.situation.strikes}
                outs={game.situation.outs}
              />
            </>
          )}
        </div>

        {/* Home team */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <TeamLogo src={game.home.logo} alt={game.home.displayName} abbreviation={game.home.abbreviation} size={48} />
          <div className="flex items-center gap-1">
            <RankBadge rank={game.home.rank} />
            <span className="text-sm font-semibold">{game.home.abbreviation}</span>
          </div>
          <span className="text-xs text-blue-200">{game.home.record}</span>
          <span className="text-3xl font-bold tabular-nums">{game.home.score}</span>
        </div>
      </div>
    </div>
  );
}
