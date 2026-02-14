interface CountProps {
  balls: number;
  strikes: number;
  outs: number;
}

function Dots({ count, max, color }: { count: number; max: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < count ? color : 'bg-gray-300 dark:bg-gray-600'}`}
        />
      ))}
    </div>
  );
}

export default function CountDisplay({ balls, strikes, outs }: CountProps) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <span>B</span>
        <Dots count={balls} max={4} color="bg-yellow-400" />
      </div>
      <div className="flex items-center gap-1">
        <span>S</span>
        <Dots count={strikes} max={3} color="bg-red-500" />
      </div>
      <div className="flex items-center gap-1">
        <span>O</span>
        <Dots count={outs} max={3} color="bg-gray-500" />
      </div>
    </div>
  );
}
