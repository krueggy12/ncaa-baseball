import logoImg from '/logo.png?url';

interface HeaderProps {
  liveCount?: number;
}

export default function Header({ liveCount }: HeaderProps) {
  return (
    <header className="safe-top bg-gradient-to-r from-navy to-[#1f3561] text-white sticky top-0 z-30 shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2.5">
          <img
            src={logoImg}
            alt="D1 Diamond"
            className="h-9 w-auto object-contain drop-shadow-sm"
          />
          <div className="leading-tight">
            <h1 className="text-base font-extrabold tracking-tight">
              <span className="text-white">D1</span>
              <span className="text-d1red">DIAMOND</span>
            </h1>
            <p className="text-[9px] font-medium text-blue-200/80 uppercase tracking-widest">College Baseball Scores</p>
          </div>
        </div>
        {liveCount !== undefined && liveCount > 0 && (
          <div className="flex items-center gap-1.5 bg-d1red/90 rounded-full px-2.5 py-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse-live" />
            <span className="text-[11px] font-bold text-white">{liveCount} LIVE</span>
          </div>
        )}
      </div>
    </header>
  );
}
