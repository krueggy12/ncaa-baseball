import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

export interface NotificationPrefs {
  enabled: boolean;
  gameStart: boolean;
  scoreChange: boolean;
  gameEnd: boolean;
}

const defaults: NotificationPrefs = {
  enabled: false,
  gameStart: true,
  scoreChange: true,
  gameEnd: true,
};

interface NotificationContextType {
  prefs: NotificationPrefs;
  updatePref: (key: keyof NotificationPrefs, value: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<NotificationPrefs>(() =>
    getStorageItem(STORAGE_KEYS.NOTIFICATION_PREFS, defaults)
  );

  const updatePref = useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value };
      setStorageItem(STORAGE_KEYS.NOTIFICATION_PREFS, next);
      return next;
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ prefs, updatePref }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationPrefs() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationPrefs must be used within NotificationProvider');
  return ctx;
}
