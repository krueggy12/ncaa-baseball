import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  addFavorite: (teamId: string) => void;
  removeFavorite: (teamId: string) => void;
  toggleFavorite: (teamId: string) => void;
  isFavorite: (teamId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    const stored = getStorageItem<string[]>(STORAGE_KEYS.FAVORITES, []);
    return new Set(stored);
  });

  const persist = useCallback((ids: Set<string>) => {
    setStorageItem(STORAGE_KEYS.FAVORITES, Array.from(ids));
  }, []);

  const addFavorite = useCallback((teamId: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      next.add(teamId);
      persist(next);
      return next;
    });
  }, [persist]);

  const removeFavorite = useCallback((teamId: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      next.delete(teamId);
      persist(next);
      return next;
    });
  }, [persist]);

  const toggleFavorite = useCallback((teamId: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback((teamId: string) => favoriteIds.has(teamId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
