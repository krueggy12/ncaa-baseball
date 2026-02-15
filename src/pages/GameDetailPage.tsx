import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameDetail } from '../hooks/useGameDetail';
import { fetchESPN } from '../api/espnClient';
import { getScoreboardUrl } from '../api/endpoints';
import { transformScoreboard } from '../api/transformers';
import { toESPNDate, addDays } from '../utils/dateUtils';
import GameDetail from '../components/game/GameDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Game } from '../types/game';

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [gameLoading, setGameLoading] = useState(true);

  // Fetch the game from scoreboard — try provided date, today, and nearby dates
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function findGame(date: string): Promise<Game | null> {
      try {
        const raw = await fetchESPN<any>(getScoreboardUrl(date));
        const games = transformScoreboard(raw);
        return games.find(g => g.id === id) || null;
      } catch {
        return null;
      }
    }

    async function loadGame() {
      setGameLoading(true);

      // If a date was passed via query param, try that first
      const dateParam = searchParams.get('date');
      if (dateParam) {
        const found = await findGame(dateParam);
        if (found && !cancelled) {
          setGame(found);
          setGameLoading(false);
          return;
        }
      }

      // Try today
      const today = new Date();
      const todayStr = toESPNDate(today);
      const found = await findGame(todayStr);
      if (found && !cancelled) {
        setGame(found);
        setGameLoading(false);
        return;
      }

      // Try yesterday and tomorrow
      const yesterday = toESPNDate(addDays(today, -1));
      const tomorrow = toESPNDate(addDays(today, 1));

      const [yGame, tGame] = await Promise.all([
        findGame(yesterday),
        findGame(tomorrow),
      ]);

      if (!cancelled) {
        setGame(yGame || tGame || null);
        setGameLoading(false);
      }
    }

    loadGame();
    return () => { cancelled = true; };
  }, [id, searchParams]);

  const isLive = game?.status.state === 'in';
  const { summary } = useGameDetail(id || '', isLive || false);

  // Periodically refresh the game data for live games
  useEffect(() => {
    if (!id || !isLive) return;
    const interval = setInterval(async () => {
      try {
        const today = toESPNDate(new Date());
        const raw = await fetchESPN<any>(getScoreboardUrl(today));
        const games = transformScoreboard(raw);
        const found = games.find(g => g.id === id);
        if (found) setGame(found);
      } catch { /* ignore */ }
    }, 30_000);
    return () => clearInterval(interval);
  }, [id, isLive]);

  if (gameLoading) {
    return (
      <div className="pt-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Game not found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-royal text-white rounded-lg text-sm font-medium"
        >
          Back to Scores
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <div className="bg-gradient-to-r from-navy to-[#1f3561] px-3 pt-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white/70 text-sm py-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
      </div>
      <GameDetail game={game} summary={summary} />
    </div>
  );
}
