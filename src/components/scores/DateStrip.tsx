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
    <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2.5 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-white/[0.06]">
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
            className={`flex flex-col items-center shrink-0 px-2.5 py-1.5 rounded-xl transition-all duration-200 min-w-[50px] ${
              selected
                ? 'bg-royal text-white shadow-sm'
                : today
                ? 'bg-blue-50 dark:bg-royal/10 text-royal dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-wide">{dayName}</span>
            <span className="text-base font-bold leading-tight">{dayNum}</span>
            <span className="text-[10px] font-medium opacity-80">{month}</span>
          </button>
        );
      })}
    </div>
  );
}
