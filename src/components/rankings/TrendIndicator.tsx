interface TrendProps {
  trend: 'up' | 'down' | 'same' | 'new';
  diff?: number;
}

export default function TrendIndicator({ trend, diff }: TrendProps) {
  if (trend === 'new') {
    return <span className="text-[10px] font-bold text-green-500">NEW</span>;
  }
  if (trend === 'up') {
    return (
      <span className="flex items-center text-[10px] font-semibold text-green-500">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
        </svg>
        {diff || ''}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center text-[10px] font-semibold text-red-500">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
        </svg>
        {diff || ''}
      </span>
    );
  }
  return <span className="w-4 text-center text-gray-300 dark:text-gray-600">-</span>;
}
