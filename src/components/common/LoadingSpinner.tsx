export default function LoadingSpinner() {
  return (
    <div className="space-y-2.5 px-3 pt-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm dark:shadow-none animate-pulse overflow-hidden">
          {/* Side-by-side team layout skeleton */}
          <div className="px-3 pt-4 pb-3">
            <div className="flex items-start justify-between">
              {/* Away team */}
              <div className="flex flex-col items-center gap-2 w-[100px]">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/[0.08]" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-white/[0.08] rounded-full" />
                <div className="h-2.5 w-10 bg-gray-100 dark:bg-white/[0.05] rounded-full" />
              </div>
              {/* Center */}
              <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2">
                <div className="h-8 w-24 bg-gray-200 dark:bg-white/[0.08] rounded-lg" />
                <div className="h-2.5 w-14 bg-gray-100 dark:bg-white/[0.05] rounded-full" />
              </div>
              {/* Home team */}
              <div className="flex flex-col items-center gap-2 w-[100px]">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/[0.08]" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-white/[0.08] rounded-full" />
                <div className="h-2.5 w-10 bg-gray-100 dark:bg-white/[0.05] rounded-full" />
              </div>
            </div>
          </div>
          {/* Status bar skeleton */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border-t border-gray-100 dark:border-white/[0.05]">
            <div className="h-2.5 w-16 bg-gray-200 dark:bg-white/[0.08] rounded-full" />
            <div className="h-2.5 w-8 bg-gray-100 dark:bg-white/[0.05] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
