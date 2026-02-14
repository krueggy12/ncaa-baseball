export default function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-live animate-pulse-live" />
      <span className="text-[10px] font-bold text-live uppercase">Live</span>
    </span>
  );
}
