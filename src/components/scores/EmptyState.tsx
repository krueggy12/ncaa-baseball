interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--c-surface-subtle)] border border-[var(--c-border)] flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-[var(--c-text-20)]" fill="none" viewBox="0 0 64 64" strokeWidth={1.2} stroke="currentColor">
          <circle cx="32" cy="32" r="26" />
          <path d="M32 6 C22 15, 14 23, 14 32 C14 41, 22 49, 32 58" strokeLinecap="round" />
          <path d="M32 6 C42 15, 50 23, 50 32 C50 41, 42 49, 32 58" strokeLinecap="round" />
          <line x1="6" y1="32" x2="58" y2="32" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[var(--c-text-40)] text-sm font-bold">
        {message || 'No games scheduled.'}
      </p>
      <p className="text-[var(--c-text-20)] text-[11px] mt-1.5 font-medium">
        Try a different date or adjust your filters.
      </p>
    </div>
  );
}
