interface TrendProps {
  trend: 'up' | 'down' | 'same' | 'new';
  diff?: number;
}

export default function TrendIndicator({ trend, diff }: TrendProps) {
  if (trend === 'new') {
    return (
      <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 rounded px-1 py-0.5 tracking-wider">
        NEW
      </span>
    );
  }
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-400">
        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
        </svg>
        {diff || ''}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-black text-d1red">
        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
        </svg>
        {diff || ''}
      </span>
    );
  }
  return <span className="text-white/15">–</span>;
}
