import { useState, useCallback } from 'react';
import { getToday, addDays, toESPNDate } from '../utils/dateUtils';

export function useDateNavigation() {
  const [selectedDate, setSelectedDate] = useState(getToday());

  const goToNextDay = useCallback(() => {
    setSelectedDate(d => addDays(d, 1));
  }, []);

  const goToPrevDay = useCallback(() => {
    setSelectedDate(d => addDays(d, -1));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(getToday());
  }, []);

  const goToDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return {
    selectedDate,
    espnDate: toESPNDate(selectedDate),
    goToNextDay,
    goToPrevDay,
    goToToday,
    goToDate,
  };
}
