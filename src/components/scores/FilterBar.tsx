import type { StatusFilter, Conference } from '../../types/game';

interface FilterBarProps {
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  conferenceFilter: string;
  onConferenceFilterChange: (conf: string) => void;
  conferences: Conference[];
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (val: boolean) => void;
  hasFavorites: boolean;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: '⬤ Live' },
  { value: 'final', label: 'Final' },
  { value: 'scheduled', label: 'Upcoming' },
];

export default function FilterBar({
  statusFilter,
  onStatusFilterChange,
  conferenceFilter,
  onConferenceFilterChange,
  conferences,
  favoritesOnly,
  onFavoritesOnlyChange,
  hasFavorites,
}: FilterBarProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2.5 items-center glass border-b border-[var(--c-border-faint)]">
      {statusOptions.map(opt => {
        const isActive = statusFilter === opt.value;
        const isLiveOpt = opt.value === 'live';
        return (
          <button
            key={opt.value}
            onClick={() => onStatusFilterChange(opt.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 ${
              isActive
                ? isLiveOpt
                  ? 'bg-d1red text-white shadow-[0_0_10px_rgba(240,64,64,0.4)]'
                  : 'bg-royal text-white shadow-[0_0_10px_rgba(52,116,230,0.4)]'
                : 'bg-[var(--c-surface-subtle)] text-[var(--c-text-40)] hover:bg-[var(--c-surface-alt)] hover:text-[var(--c-text-60)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}

      <div className="w-px h-4 bg-[var(--c-border-strong)] shrink-0 mx-0.5" />

      {hasFavorites && (
        <button
          onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
            favoritesOnly
              ? 'bg-amber-400/15 text-amber-400 ring-1 ring-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
              : 'bg-[var(--c-surface-subtle)] text-[var(--c-text-40)] hover:bg-[var(--c-surface-alt)] hover:text-[var(--c-text-60)]'
          }`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          My Teams
        </button>
      )}

      <select
        value={conferenceFilter}
        onChange={e => onConferenceFilterChange(e.target.value)}
        className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border-none outline-none cursor-pointer appearance-none pr-6 transition-all duration-200 ${
          conferenceFilter
            ? 'bg-royal text-white shadow-[0_0_10px_rgba(52,116,230,0.4)]'
            : 'bg-[var(--c-surface-subtle)] text-[var(--c-text-40)]'
        }`}
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%236b7280' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
        }}
      >
        <option value="">Conference</option>
        {conferences.map(c => (
          <option key={c.id} value={c.id}>{c.abbreviation}</option>
        ))}
      </select>
    </div>
  );
}
