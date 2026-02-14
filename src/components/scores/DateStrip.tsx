import { useRef, useEffect } from 'react';
import { isToday, isSameDay, generateDateRange } from '../../utils/dateUtils';

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const dates = generateDateRange(selectedDate, 14);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
  }, [selectedDate]);

  return (
    <div ref={scrollRef} className="flex gap-1 overflow-x-auto no-scrollbar px-3 py-2 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700">
      {dates.map(date => {
        const selected = isSameDay(date, selectedDate);
        const today = isToday(date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });

        return (
          <button
            key={date.toISOString()}
            ref={selected ? selectedRef : undefined}
            onClick={() => onSelectDate(date)}
            className={`flex flex-col items-center shrink-0 px-2.5 py-1.5 rounded-lg transition-colors min-w-[48px] ${
              selected
                ? 'bg-navy text-white'
                : today
                ? 'bg-blue-50 dark:bg-blue-900/30 text-navy dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-[10px] font-medium">{dayName}</span>
            <span className="text-sm font-bold leading-tight">{dayNum}</span>
            <span className="text-[10px]">{month}</span>
          </button>
        );
      })}
    </div>
  );
}
