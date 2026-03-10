export default function LoadingSpinner() {
  return (
    <div className="space-y-2.5 px-3 pt-2">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-[var(--c-border-faint)] bg-[var(--c-surface)]"
          style={{ opacity: 1 - (i - 1) * 0.2 }}
        >
          {/* Shimmer top accent */}
          <div className="h-[2px] animate-shimmer" />

          <div className="px-3 pt-4 pb-3">
            <div className="flex items-start justify-between">
              {/* Away team */}
              <div className="flex flex-col items-center gap-2 w-[96px]">
                <div className="w-13 h-13 rounded-full animate-shimmer" style={{ width: 52, height: 52 }} />
                <div className="h-3 w-16 rounded-full animate-shimmer" />
                <div className="h-2.5 w-10 rounded-full animate-shimmer" />
              </div>
              {/* Center */}
              <div className="flex flex-col items-center justify-center gap-2.5 flex-1 px-2 pt-1">
                <div className="h-10 w-28 rounded-lg animate-shimmer" />
                <div className="h-5 w-20 rounded-full animate-shimmer" />
              </div>
              {/* Home team */}
              <div className="flex flex-col items-center gap-2 w-[96px]">
                <div className="w-13 h-13 rounded-full animate-shimmer" style={{ width: 52, height: 52 }} />
                <div className="h-3 w-16 rounded-full animate-shimmer" />
                <div className="h-2.5 w-10 rounded-full animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Status bar skeleton */}
          <div className="flex items-center justify-between px-3 py-2 bg-[var(--c-overlay)] border-t border-[var(--c-border-faint)]">
            <div className="h-2.5 w-16 rounded-full animate-shimmer" />
            <div className="h-2.5 w-8 rounded-full animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
