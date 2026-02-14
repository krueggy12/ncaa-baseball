interface HeaderProps {
  liveCount?: number;
}

export default function Header({ liveCount }: HeaderProps) {
  return (
    <header className="safe-top bg-navy text-white sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" fill="#c41e3a" />
            <circle cx="32" cy="32" r="18" stroke="white" strokeWidth="2" fill="none" />
            <path d="M32 14 C26 20, 20 26, 20 32 C20 38, 26 44, 32 50" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M32 14 C38 20, 44 26, 44 32 C44 38, 38 44, 32 50" stroke="white" strokeWidth="1.5" fill="none" />
            <line x1="14" y1="32" x2="50" y2="32" stroke="white" strokeWidth="1.5" />
          </svg>
          <h1 className="text-lg font-bold tracking-tight">NCAA Baseball</h1>
        </div>
        {liveCount !== undefined && liveCount > 0 && (
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-live animate-pulse-live" />
            <span className="text-xs font-semibold">{liveCount} LIVE</span>
          </div>
        )}
      </div>
    </header>
  );
}
