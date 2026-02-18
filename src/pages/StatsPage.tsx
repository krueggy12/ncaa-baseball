import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollegeStats } from '../hooks/useCollegeStats';
import type { StatTab, SortDir } from '../types/stats';

// ─── Column definitions ──────────────────────────────────────────────────────

type Fmt = (v: number | string | null) => string;

interface ColDef {
  key: string;
  label: string;
  defaultDir: SortDir;
  fmt: Fmt;
}

const fmtAvg: Fmt = v => (v == null || v === '') ? '—' : Number(v).toFixed(3).replace(/^0/, '');
const fmtPct: Fmt = v => (v == null || v === '') ? '—' : `${(Number(v) * 100).toFixed(1)}%`;
const fmtDec1: Fmt = v => (v == null || v === '') ? '—' : Number(v).toFixed(1);
const fmtDec2: Fmt = v => (v == null || v === '') ? '—' : Number(v).toFixed(2);
const fmtInt: Fmt = v => (v == null || v === '') ? '—' : String(Math.round(Number(v)));

const BAT_COLS: ColDef[] = [
  { key: 'G',    label: 'G',    defaultDir: 'desc', fmt: fmtInt  },
  { key: 'AVG',  label: 'AVG',  defaultDir: 'desc', fmt: fmtAvg  },
  { key: 'OBP',  label: 'OBP',  defaultDir: 'desc', fmt: fmtAvg  },
  { key: 'SLG',  label: 'SLG',  defaultDir: 'desc', fmt: fmtAvg  },
  { key: 'HR',   label: 'HR',   defaultDir: 'desc', fmt: fmtInt  },
  { key: 'RBI',  label: 'RBI',  defaultDir: 'desc', fmt: fmtInt  },
  { key: 'SB',   label: 'SB',   defaultDir: 'desc', fmt: fmtInt  },
  { key: 'wRC+', label: 'wRC+', defaultDir: 'desc', fmt: fmtInt  },
  { key: 'BB%',  label: 'BB%',  defaultDir: 'desc', fmt: fmtPct  },
  { key: 'K%',   label: 'K%',   defaultDir: 'asc',  fmt: fmtPct  },
  { key: 'BABIP',label: 'BABIP',defaultDir: 'desc', fmt: fmtAvg  },
  { key: 'wOBA', label: 'wOBA', defaultDir: 'desc', fmt: fmtAvg  },
];

const PIT_COLS: ColDef[] = [
  { key: 'G',     label: 'G',     defaultDir: 'desc', fmt: fmtInt  },
  { key: 'ERA',   label: 'ERA',   defaultDir: 'asc',  fmt: fmtDec2 },
  { key: 'IP',    label: 'IP',    defaultDir: 'desc', fmt: fmtDec1 },
  { key: 'WHIP',  label: 'WHIP',  defaultDir: 'asc',  fmt: fmtDec2 },
  { key: 'K/9',   label: 'K/9',   defaultDir: 'desc', fmt: fmtDec1 },
  { key: 'BB/9',  label: 'BB/9',  defaultDir: 'asc',  fmt: fmtDec1 },
  { key: 'FIP',   label: 'FIP',   defaultDir: 'asc',  fmt: fmtDec2 },
  { key: 'K%',    label: 'K%',    defaultDir: 'desc', fmt: fmtPct  },
  { key: 'BB%',   label: 'BB%',   defaultDir: 'asc',  fmt: fmtPct  },
  { key: 'K-BB%', label: 'K-BB%', defaultDir: 'desc', fmt: fmtPct  },
  { key: 'BABIP', label: 'BABIP', defaultDir: 'asc',  fmt: fmtAvg  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const navigate = useNavigate();
  const season = new Date().getFullYear();

  const [tab, setTab] = useState<StatTab>('bat');
  const [qual, setQual] = useState(true);
  const [page, setPage] = useState(1);
  const [sortStat, setSortStat] = useState('wRC+');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const cols = tab === 'bat' ? BAT_COLS : PIT_COLS;

  const { rows, totalCount, pageSize, isLoading, error } = useCollegeStats(
    tab, sortStat, sortDir, qual, page,
  );

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;

  function handleTabChange(t: StatTab) {
    setTab(t);
    setPage(1);
    if (t === 'bat') { setSortStat('wRC+'); setSortDir('desc'); }
    else             { setSortStat('ERA');  setSortDir('asc');  }
  }

  function handleColClick(col: ColDef) {
    if (sortStat === col.key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortStat(col.key);
      setSortDir(col.defaultDir);
    }
    setPage(1);
  }

  function handleQualToggle() {
    setQual(q => !q);
    setPage(1);
  }

  const showTable = rows.length > 0;
  const showEmpty = !isLoading && rows.length === 0;

  return (
    <div className="pb-4">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => navigate('/more')}
          className="p-1 -ml-1 text-gray-400 dark:text-gray-500"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Stat Leaderboards</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{season} D1 College Baseball</p>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-1.5 px-4 pb-3">
        {/* Batting / Pitching tabs */}
        {(['bat', 'pit'] as StatTab[]).map(t => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              tab === t
                ? 'bg-royal text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {t === 'bat' ? 'Batting' : 'Pitching'}
          </button>
        ))}

        <div className="flex-1" />

        {/* Qualified toggle */}
        <button
          onClick={handleQualToggle}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            qual
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          {qual ? 'Qualified' : 'All'}
        </button>
      </div>

      {/* Initial skeleton */}
      {isLoading && rows.length === 0 && (
        <div className="px-4 space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-9 bg-white dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
          Failed to load stats. Check your connection.
        </div>
      )}

      {/* Table */}
      {showTable && (
        <div className="px-3">
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">

            {/* Loading overlay when re-sorting / changing pages */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 z-30 rounded-xl" />
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/50">
                    <th className="sticky left-0 z-20 bg-white dark:bg-slate-800 text-left pl-3 pr-1 py-2 w-7">
                      #
                    </th>
                    <th className="sticky left-7 z-20 bg-white dark:bg-slate-800 text-left px-2 py-2 min-w-[124px]">
                      Player
                    </th>
                    {cols.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleColClick(col)}
                        className={`text-center px-2 py-2 cursor-pointer select-none whitespace-nowrap transition-colors hover:text-gray-700 dark:hover:text-gray-200 ${
                          sortStat === col.key
                            ? 'text-royal dark:text-blue-400'
                            : ''
                        }`}
                      >
                        {col.label}
                        {sortStat === col.key && (
                          <span className="ml-0.5 text-[9px]">
                            {sortDir === 'desc' ? '▼' : '▲'}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const rank = (page - 1) * pageSize + idx + 1;
                    return (
                      <tr
                        key={(row['UPID'] as string) || idx}
                        className="border-b border-gray-50 dark:border-gray-700/30 last:border-b-0"
                      >
                        {/* Rank — sticky */}
                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 pl-3 pr-1 py-2.5 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                          {rank}
                        </td>

                        {/* Player + Team — sticky */}
                        <td className="sticky left-7 z-10 bg-white dark:bg-slate-800 px-2 py-2.5 min-w-[124px]">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[112px] leading-tight">
                            {row['PlayerName'] as string}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                            {row['Team'] as string}
                          </p>
                        </td>

                        {/* Stat columns */}
                        {cols.map(col => (
                          <td
                            key={col.key}
                            className={`text-center px-2 py-2.5 text-xs tabular-nums whitespace-nowrap ${
                              sortStat === col.key
                                ? 'font-semibold text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {col.fmt(row[col.key] as number | null)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 shadow-sm disabled:opacity-40 active:scale-95 transition-transform"
              >
                ← Prev
              </button>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount.toLocaleString()}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 shadow-sm disabled:opacity-40 active:scale-95 transition-transform"
              >
                Next →
              </button>
            </div>
          )}

          {/* Attribution */}
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
            Stats via FanGraphs · Tap column headers to sort
          </p>
        </div>
      )}

      {/* Empty state */}
      {showEmpty && !error && (
        <div className="text-center py-16 px-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No stats available yet.</p>
          {qual && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Early in the season, try switching to "All" players.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
