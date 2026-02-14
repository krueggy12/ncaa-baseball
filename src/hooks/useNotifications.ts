import { useEffect, useRef } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useNotificationPrefs } from '../context/NotificationContext';
import { sendNotification, canNotify } from '../utils/notifications';
import type { Game } from '../types/game';

export function useGameNotifications(games: Game[], previousGames: Game[]) {
  const { favoriteIds } = useFavorites();
  const { prefs } = useNotificationPrefs();
  const sentRef = useRef(new Set<string>());

  useEffect(() => {
    if (!prefs.enabled || !canNotify()) return;
    if (previousGames.length === 0 || games.length === 0) return;

    for (const game of games) {
      const isFavGame = favoriteIds.has(game.home.id) || favoriteIds.has(game.away.id);
      if (!isFavGame) continue;

      const prev = previousGames.find(g => g.id === game.id);
      if (!prev) continue;

      // Game started
      if (prefs.gameStart && prev.status.state === 'pre' && game.status.state === 'in') {
        const key = `start-${game.id}`;
        if (!sentRef.current.has(key)) {
          sentRef.current.add(key);
          sendNotification(
            'Game Started',
            `${game.away.location} vs ${game.home.location}`,
            game.home.logo || game.away.logo
          );
        }
      }

      // Score changed
      if (prefs.scoreChange && game.status.state === 'in') {
        const homeScored = game.home.score > (prev.home.score ?? 0);
        const awayScored = game.away.score > (prev.away.score ?? 0);
        if (homeScored || awayScored) {
          const key = `score-${game.id}-${game.home.score}-${game.away.score}`;
          if (!sentRef.current.has(key)) {
            sentRef.current.add(key);
            const scorer = homeScored ? game.home : game.away;
            sendNotification(
              `${scorer.location} Scores!`,
              `${game.away.abbreviation} ${game.away.score} - ${game.home.abbreviation} ${game.home.score} | ${game.status.shortDetail}`,
              scorer.logo
            );
          }
        }
      }

      // Game ended
      if (prefs.gameEnd && prev.status.state === 'in' && game.status.state === 'post') {
        const key = `end-${game.id}`;
        if (!sentRef.current.has(key)) {
          sentRef.current.add(key);
          const winner = game.home.isWinner ? game.home : game.away;
          sendNotification(
            'Final Score',
            `${winner.location} wins! ${game.away.abbreviation} ${game.away.score} - ${game.home.abbreviation} ${game.home.score}`,
            winner.logo
          );
        }
      }
    }
  }, [games, previousGames, favoriteIds, prefs]);
}
