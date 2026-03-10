interface CountProps {
  balls: number;
  strikes: number;
  outs: number;
}

function Pips({ count, max, active, inactive }: { count: number; max: number; active: string; inactive: string }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-[7px] h-[7px] rounded-full ${i < count ? active : inactive}`}
        />
      ))}
    </div>
  );
}

export default function CountDisplay({ balls, strikes, outs }: CountProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-[9px] font-black text-white/30 uppercase tracking-wide">B</span>
        <Pips count={balls} max={4} active="bg-emerald-400" inactive="bg-white/10" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[9px] font-black text-white/30 uppercase tracking-wide">S</span>
        <Pips count={strikes} max={3} active="bg-d1red" inactive="bg-white/10" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[9px] font-black text-white/30 uppercase tracking-wide">O</span>
        <Pips count={outs} max={3} active="bg-amber-400" inactive="bg-white/10" />
      </div>
    </div>
  );
}
