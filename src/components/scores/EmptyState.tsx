interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <svg className="w-14 h-14 text-gray-200 dark:text-gray-700 mb-5" fill="none" viewBox="0 0 64 64" strokeWidth={1.2} stroke="currentColor">
        <circle cx="32" cy="32" r="26" />
        <path d="M32 6 C22 15, 14 23, 14 32 C14 41, 22 49, 32 58" strokeLinecap="round" />
        <path d="M32 6 C42 15, 50 23, 50 32 C50 41, 42 49, 32 58" strokeLinecap="round" />
        <line x1="6" y1="32" x2="58" y2="32" strokeLinecap="round" />
      </svg>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {message || 'No games scheduled for this date.'}
      </p>
      <p className="text-gray-400 dark:text-gray-600 text-xs mt-1.5">
        Try a different date or adjust your filters.
      </p>
    </div>
  );
}
