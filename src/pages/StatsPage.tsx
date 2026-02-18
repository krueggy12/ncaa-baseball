import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollegeStats } from '../hooks/useCollegeStats';
import { FG_SCHOOLS } from '../api/fgSchools';
import type { StatTab, SortDir } from '../types/stats';

// ─── FanGraphs conference IDs (verified by sampling team data) ───────────────
const FG_CONFERENCES = [
  { id: '1',  name: 'ACC' },
  { id: '26', name: 'Big 12' },
  { id: '11', name: 'Big Ten' },
  { id: '34', name: 'SEC' },
  { id: '24', name: 'AAC' },
  { id: '30', name: 'Big East' },
  { id: '10', name: 'ASUN' },
  { id: '8',  name: 'Big South-OVC' },
  { id: '20', name: 'CAA' },
  { id: '21', name: 'CUSA' },
  { id: '16', name: 'Horizon League' },
  { id: '33', name: 'MAAC' },
  { id: '3',  name: 'MAC' },
  { id: '27', name: 'MEAC' },
  { id: '17', name: 'Missouri Valley' },
  { id: '22', name: 'Mountain West' },
  { id: '25', name: 'NEC' },
  { id: '13', name: 'Ohio Valley' },
  { id: '5',  name: 'Patriot League' },
  { id: '23', name: 'Southland' },
  { id: '14', name: 'Southern Conference' },
  { id: '6',  name: 'Sun Belt' },
  { id: '4',  name: 'Summit League' },
  { id: '15', name: 'SWAC' },
  { id: '28', name: 'WAC' },
  { id: '29', name: 'America East' },
  { id: '19', name: 'Big West' },
  { id: '18', name: 'WCC' },
];

// ─── Column definitions ───────────────────────────────────────────────────────

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

// Select dropdown shared style
const SELECT_CLS = [
  'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium',
  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  'border-none outline-none cursor-pointer appearance-none',
  'max-w-[130px] truncate',
].join(' ');

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const navigate = useNavigate();
  const season = new Date().getFullYear();

  const [tab, setTab] = useState<StatTab>('bat');
  const [qual, setQual] = useState(true);
  const [page, setPage] = useState(1);
  const [sortStat, setSortStat] = useState('wRC+');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [conferenceId, setConferenceId] = useState('0');
  const [teamId, setTeamId] = useState(0);
  const [schoolSearch, setSchoolSearch] = useState('');

  const cols = tab === 'bat' ? BAT_COLS : PIT_COLS;

  const { rows, totalCount, pageSize, isLoading, error } = useCollegeStats(
    tab, sortStat, sortDir, qual, page, conferenceId, teamId,
  );

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;

  // Filtered school list for the picker
  const filteredSchools = useMemo(() => {
    const q = schoolSearch.trim().toLowerCase();
    if (!q) return FG_SCHOOLS;
    return FG_SCHOOLS.filter(s =>
      s.name.toLowerCase().includes(q) || s.abbr.toLowerCase().includes(q)
    );
  }, [schoolSearch]);

  // Selected school name for the active filter badge
  const selectedSchool = teamId ? FG_SCHOOLS.find(s => s.id === teamId) : null;
  const selectedConf = conferenceId !== '0' ? FG_CONFERENCES.find(c => c.id === conferenceId) : null;

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

  function handleConferenceChange(id: string) {
    setConferenceId(id);
    setTeamId(0); // clear school filter when conference changes
    setSchoolSearch('');
    setPage(1);
  }

  function handleTeamChange(id: number) {
    setTeamId(id);
    setConferenceId('0'); // clear conference filter when school is chosen
    setPage(1);
  }

  function clearFilters() {
    setConferenceId('0');
    setTeamId(0);
    setSchoolSearch('');
    setPage(1);
  }

  const hasFilter = conferenceId !== '0' || teamId !== 0;
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

      {/* Row 1: Batting/Pitching tabs + Qual toggle */}
      <div className="flex items-center gap-1.5 px-4 pb-2">
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
        <button
          onClick={() => { setQual(q => !q); setPage(1); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            qual
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          {qual ? 'Qualified' : 'All'}
        </button>
      </div>

      {/* Row 2: Conference + School filters */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {/* Conference picker */}
        <select
          value={conferenceId}
          onChange={e => handleConferenceChange(e.target.value)}
          className={SELECT_CLS}
        >
          <option value="0">All Conferences</option>
          {FG_CONFERENCES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* School search + picker */}
        <select
          value={teamId}
          onChange={e => handleTeamChange(Number(e.target.value))}
          className={SELECT_CLS}
        >
          <option value={0}>All Schools</option>
          {filteredSchools.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Active filter badges + clear */}
        {hasFilter && (
          <button
            onClick={clearFilters}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-royal/10 dark:bg-royal/20 text-royal dark:text-blue-400 whitespace-nowrap"
          >
            {selectedSchool ? selectedSchool.abbr : selectedConf ? selectedConf.name : ''}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M2 2l8 8M10 2l-8 8" />
            </svg>
          </button>
        )}
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

            {/* Loading overlay on re-sort / filter change */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 z-30 rounded-xl" />
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/50">
                    <th className="sticky left-0 z-20 bg-white dark:bg-slate-800 text-left pl-3 pr-1 py-2 w-7">#</th>
                    <th className="sticky left-7 z-20 bg-white dark:bg-slate-800 text-left px-2 py-2 min-w-[124px]">Player</th>
                    {cols.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleColClick(col)}
                        className={`text-center px-2 py-2 cursor-pointer select-none whitespace-nowrap transition-colors hover:text-gray-700 dark:hover:text-gray-200 ${
                          sortStat === col.key ? 'text-royal dark:text-blue-400' : ''
                        }`}
                      >
                        {col.label}
                        {sortStat === col.key && (
                          <span className="ml-0.5 text-[9px]">{sortDir === 'desc' ? '▼' : '▲'}</span>
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
                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 pl-3 pr-1 py-2.5 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                          {rank}
                        </td>
                        <td className="sticky left-7 z-10 bg-white dark:bg-slate-800 px-2 py-2.5 min-w-[124px]">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[112px] leading-tight">
                            {row['PlayerName'] as string}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                            {row['Team'] as string}
                          </p>
                        </td>
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

          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
            Stats via FanGraphs · Tap column headers to sort
          </p>
        </div>
      )}

      {/* Empty state */}
      {showEmpty && !error && (
        <div className="text-center py-16 px-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {hasFilter ? 'No stats found for this filter.' : 'No stats available yet.'}
          </p>
          {qual && !hasFilter && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Early in the season, try switching to "All" players.
            </p>
          )}
          {hasFilter && (
            <button onClick={clearFilters} className="mt-3 text-xs text-royal dark:text-blue-400 underline">
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
