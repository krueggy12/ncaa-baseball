interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 64 64" strokeWidth={1.5} stroke="currentColor">
        <circle cx="32" cy="32" r="24" />
        <path d="M32 8 C24 16, 16 24, 16 32 C16 40, 24 48, 32 56" />
        <path d="M32 8 C40 16, 48 24, 48 32 C48 40, 40 48, 32 56" />
        <line x1="8" y1="32" x2="56" y2="32" />
      </svg>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {message || 'No games scheduled for this date.'}
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
        Try selecting a different date or adjusting your filters.
      </p>
    </div>
  );
}
