import { useNavigate } from 'react-router-dom';
import { useScoreboard } from '../hooks/useScoreboard';
import { useTop25 } from '../hooks/useTop25';
import { useCollegeStats } from '../hooks/useCollegeStats';
import { toESPNDate, getToday } from '../utils/dateUtils';
import TeamLogo from '../components/common/TeamLogo';
import type { Game } from '../types/game';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtAvg = (v: number | string | null) =>
  v == null || v === '' ? '—' : Number(v).toFixed(3).replace(/^0/, '');
const fmtDec2 = (v: number | string | null) =>
  v == null || v === '' ? '—' : Number(v).toFixed(2);
const fmtInt = (v: number | string | null) =>
  v == null || v === '' ? '—' : String(Math.round(Number(v)));

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, label, onViewMore }: { title: string; label?: string; onViewMore: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 mb-2">
      <div>
        <h2 className="text-[17px] font-black text-white tracking-tight">{title}</h2>
        {label && <p className="text-[10px] text-white/30 font-semibold mt-0.5">{label}</p>}
      </div>
      <button
        onClick={onViewMore}
        className="flex items-center gap-1 text-[12px] font-black text-royal-bright hover:text-white transition-colors"
      >
        View more
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

// ─── Compact game row for dashboard ──────────────────────────────────────────

function GamePreview({ game, onClick }: { game: Game; onClick: () => void }) {
  const isLive = game.status.state === 'in';
  const isFinal = game.status.state === 'post';
  const awayWin = !isFinal || game.away.isWinner;
  const homeWin = !isFinal || game.home.isWinner;

  return (
    <div
      onClick={onClick}
      className="flex items-center px-4 py-3 border-b border-white/[0.04] last:border-b-0 active:bg-white/5 cursor-pointer transition-colors"
    >
      {/* Away */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamLogo src={game.away.logo} alt={game.away.displayName} abbreviation={game.away.abbreviation} size={28} />
        <div className="min-w-0">
          <span className={`text-[13px] font-bold truncate block ${!isFinal || awayWin ? 'text-white/85' : 'text-white/30'}`}>
            {game.away.abbreviation}
          </span>
          {game.away.rank != null && (
            <span className="text-[9px] font-black text-royal-bright leading-none">#{game.away.rank}</span>
          )}
        </div>
      </div>

      {/* Score / Status */}
      <div className="flex flex-col items-center px-3 min-w-[90px]">
        {isLive || isFinal ? (
          <>
            <div className="flex items-center gap-2.5">
              <span className={`text-[20px] font-black tabular-nums leading-none ${awayWin ? 'text-white' : 'text-white/30'}`}>
                {game.away.score}
              </span>
              <span className="text-white/15 text-sm">–</span>
              <span className={`text-[20px] font-black tabular-nums leading-none ${homeWin ? 'text-white' : 'text-white/30'}`}>
                {game.home.score}
              </span>
            </div>
            {isLive ? (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-d1red animate-glow-live" />
                <span className="text-[10px] font-black text-d1red">{game.status.shortDetail}</span>
              </div>
            ) : (
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-0.5">Final</span>
            )}
          </>
        ) : (
          <span className="text-[12px] font-bold text-white/40 text-center leading-snug">
            {game.status.shortDetail}
          </span>
        )}
      </div>

      {/* Home */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <div className="min-w-0 text-right">
          <span className={`text-[13px] font-bold truncate block ${!isFinal || homeWin ? 'text-white/85' : 'text-white/30'}`}>
            {game.home.abbreviation}
          </span>
          {game.home.rank != null && (
            <span className="text-[9px] font-black text-royal-bright leading-none">#{game.home.rank}</span>
          )}
        </div>
        <TeamLogo src={game.home.logo} alt={game.home.displayName} abbreviation={game.home.abbreviation} size={28} />
      </div>
    </div>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows({ count = 4 }: { count?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-surface-dark mx-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center px-4 py-3 border-b border-white/[0.04] last:border-b-0 gap-3">
          <div className="w-7 h-7 rounded-full animate-shimmer flex-shrink-0" />
          <div className="flex-1 h-3 rounded-full animate-shimmer" />
          <div className="w-16 h-3 rounded-full animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const today = getToday();
  const espnDate = toESPNDate(today);
  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const { games, isLoading: gamesLoading } = useScoreboard(espnDate);
  const { rankings, isLoading: rankingsLoading } = useTop25();
  const { rows: batters, isLoading: batLoading } = useCollegeStats('bat', 'wRC+', 'desc', true, 1, '0', 0);
  const { rows: pitchers, isLoading: pitLoading } = useCollegeStats('pit', 'ERA', 'asc', true, 1, '0', 0);

  // Featured games: live → scheduled → final, max 6
  const featured = [...games]
    .sort((a, b) => {
      const ord: Record<string, number> = { in: 0, pre: 1, post: 2 };
      return (ord[a.status.state] ?? 1) - (ord[b.status.state] ?? 1);
    })
    .slice(0, 6);

  const top10 = rankings.slice(0, 10);
  const top5Bat = batters.slice(0, 5);
  const top5Pit = pitchers.slice(0, 5);

  return (
    <div className="pb-6">

      {/* ── Page Header ── */}
      <div className="px-4 pt-4 pb-4">
        <p className="text-[11px] font-bold text-white/25 uppercase tracking-[0.18em]">{dateLabel}</p>
        <h1 className="text-[28px] font-black text-white tracking-tight leading-tight">Dashboard</h1>
      </div>

      {/* ── Today's Games ── */}
      <div className="mb-6">
        <SectionHeader
          title="Today's Games"
          label={games.length > 0 ? `${games.filter(g => g.status.state === 'in').length} live · ${games.length} total` : undefined}
          onViewMore={() => navigate('/scores')}
        />
        {gamesLoading && featured.length === 0 ? (
          <SkeletonRows count={4} />
        ) : featured.length === 0 ? (
          <div className="mx-4 rounded-2xl border border-white/[0.06] bg-surface-dark px-4 py-8 text-center">
            <p className="text-white/30 text-sm font-bold">No games scheduled today</p>
          </div>
        ) : (
          <div className="mx-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-surface-dark">
            {featured.map(game => (
              <GamePreview
                key={game.id}
                game={game}
                onClick={() => navigate(`/game/${game.id}?date=${espnDate}`)}
              />
            ))}
            {games.length > 6 && (
              <button
                onClick={() => navigate('/scores')}
                className="w-full py-2.5 text-[11px] font-black text-white/30 hover:text-white/60 transition-colors border-t border-white/[0.04]"
              >
                +{games.length - 6} more games today
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── D1 Diamond Top 10 ── */}
      <div className="mb-6">
        <SectionHeader
          title="D1 Diamond Top 10"
          label="Composite ELO ranking"
          onViewMore={() => navigate('/rankings')}
        />
        {rankingsLoading && top10.length === 0 ? (
          <SkeletonRows count={5} />
        ) : (
          <div className="mx-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-surface-dark">
            {top10.map((team, idx) => {
              const rankColor = idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-white/30';
              return (
                <div key={team.teamId} className="flex items-center px-4 py-2.5 border-b border-white/[0.04] last:border-b-0">
                  <span className={`w-6 text-[13px] font-black tabular-nums ${rankColor}`}>{team.rank}</span>
                  <TeamLogo src={team.logo} alt={team.displayName} abbreviation={team.abbreviation} size={26} />
                  <span className="flex-1 text-[13px] font-bold text-white/85 ml-2.5 truncate">{team.displayName}</span>
                  <span className="text-[11px] text-white/30 tabular-nums mr-3">{team.wins}–{team.losses}</span>
                  <span className="text-[12px] font-black text-royal-bright tabular-nums w-10 text-right">{team.compositeScore}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Top Batters ── */}
      <div className="mb-6">
        <SectionHeader
          title="Top Batters"
          label="Sorted by wRC+"
          onViewMore={() => navigate('/more/stats')}
        />
        {batLoading && top5Bat.length === 0 ? (
          <SkeletonRows count={5} />
        ) : top5Bat.length === 0 ? (
          <div className="mx-4 rounded-2xl border border-white/[0.06] bg-surface-dark px-4 py-6 text-center">
            <p className="text-white/30 text-sm">Stats unavailable</p>
          </div>
        ) : (
          <div className="mx-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-surface-dark">
            {top5Bat.map((row, idx) => (
              <div key={String(row['UPID']) || idx} className="flex items-center px-4 py-2.5 border-b border-white/[0.04] last:border-b-0">
                <span className="w-5 text-[11px] font-black text-white/25 tabular-nums">{idx + 1}</span>
                <div className="flex-1 min-w-0 ml-1.5">
                  <p className="text-[13px] font-bold text-white/85 truncate leading-tight">{String(row['PlayerName'])}</p>
                  <p className="text-[10px] text-white/30 font-medium truncate leading-tight">{String(row['Team'])}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-2">
                  <div className="text-center min-w-[32px]">
                    <p className="text-[13px] font-black text-white tabular-nums">{fmtAvg(row['AVG'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">AVG</p>
                  </div>
                  <div className="text-center min-w-[24px]">
                    <p className="text-[13px] font-black text-white tabular-nums">{fmtInt(row['HR'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">HR</p>
                  </div>
                  <div className="text-center min-w-[24px]">
                    <p className="text-[13px] font-black text-white tabular-nums">{fmtInt(row['RBI'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">RBI</p>
                  </div>
                  <div className="text-center min-w-[30px]">
                    <p className="text-[13px] font-black text-royal-bright tabular-nums">{fmtInt(row['wRC+'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">wRC+</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Top Pitchers ── */}
      <div className="mb-2">
        <SectionHeader
          title="Top Pitchers"
          label="Sorted by ERA"
          onViewMore={() => navigate('/more/stats')}
        />
        {pitLoading && top5Pit.length === 0 ? (
          <SkeletonRows count={5} />
        ) : top5Pit.length === 0 ? (
          <div className="mx-4 rounded-2xl border border-white/[0.06] bg-surface-dark px-4 py-6 text-center">
            <p className="text-white/30 text-sm">Stats unavailable</p>
          </div>
        ) : (
          <div className="mx-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-surface-dark">
            {top5Pit.map((row, idx) => (
              <div key={String(row['UPID']) || idx} className="flex items-center px-4 py-2.5 border-b border-white/[0.04] last:border-b-0">
                <span className="w-5 text-[11px] font-black text-white/25 tabular-nums">{idx + 1}</span>
                <div className="flex-1 min-w-0 ml-1.5">
                  <p className="text-[13px] font-bold text-white/85 truncate leading-tight">{String(row['PlayerName'])}</p>
                  <p className="text-[10px] text-white/30 font-medium truncate leading-tight">{String(row['Team'])}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-2">
                  <div className="text-center min-w-[30px]">
                    <p className="text-[13px] font-black text-royal-bright tabular-nums">{fmtDec2(row['ERA'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">ERA</p>
                  </div>
                  <div className="text-center min-w-[28px]">
                    <p className="text-[13px] font-black text-white tabular-nums">{fmtInt(row['IP'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">IP</p>
                  </div>
                  <div className="text-center min-w-[24px]">
                    <p className="text-[13px] font-black text-white tabular-nums">{fmtInt(row['SO'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">SO</p>
                  </div>
                  <div className="text-center min-w-[34px]">
                    <p className="text-[13px] font-black text-white tabular-nums">{fmtDec2(row['WHIP'])}</p>
                    <p className="text-[9px] text-white/25 font-black uppercase tracking-wide">WHIP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
