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
  { value: 'live', label: 'Live' },
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
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-2.5 items-center">
      {/* Status filters */}
      {statusOptions.map(opt => (
        <button
          key={opt.value}
          onClick={() => onStatusFilterChange(opt.value)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
            statusFilter === opt.value
              ? 'bg-royal text-white shadow-sm'
              : 'bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-gray-400'
          }`}
        >
          {opt.label}
        </button>
      ))}

      {/* Divider */}
      <div className="w-px h-4 bg-gray-200 dark:bg-white/[0.08] shrink-0" />

      {/* Favorites toggle */}
      {hasFavorites && (
        <button
          onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
            favoritesOnly
              ? 'bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400'
              : 'bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-gray-400'
          }`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          My Teams
        </button>
      )}

      {/* Conference select */}
      <select
        value={conferenceFilter}
        onChange={e => onConferenceFilterChange(e.target.value)}
        className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border-none outline-none cursor-pointer appearance-none pr-6 transition-all duration-200 ${
          conferenceFilter
            ? 'bg-royal text-white'
            : 'bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-gray-400'
        }`}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%239ca3af' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
      >
        <option value="">Conference</option>
        {conferences.map(c => (
          <option key={c.id} value={c.id}>{c.abbreviation}</option>
        ))}
      </select>
    </div>
  );
}
