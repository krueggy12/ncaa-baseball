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
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2.5 glass border-b border-[var(--c-border-faint)]"
    >
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
            className={`flex flex-col items-center shrink-0 px-2.5 py-1.5 rounded-xl transition-all duration-200 min-w-[52px] ${
              selected
                ? 'bg-royal text-white shadow-[0_0_12px_rgba(52,116,230,0.45)]'
                : today
                ? 'bg-royal/15 text-royal-bright ring-1 ring-royal/30'
                : 'text-[var(--c-text-30)] hover:bg-[var(--c-surface-subtle)] hover:text-[var(--c-text-60)]'
            }`}
          >
            <span className="text-[9px] font-semibold uppercase tracking-wider">{dayName}</span>
            <span className={`text-[17px] font-bold leading-tight ${selected ? 'text-white' : ''}`}>{dayNum}</span>
            <span className="text-[9px] font-medium opacity-70">{month}</span>
          </button>
        );
      })}
    </div>
  );
}
