import { useRankings } from '../hooks/useRankings';
import RankingsTable from '../components/rankings/RankingsTable';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function RankingsPage() {
  const { rankings, isLoading, error } = useRankings();

  return (
    <div>
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top 25 Rankings</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500">D1Baseball Poll</p>
      </div>

      {error && (
        <div className="mx-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
          Failed to load rankings.
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <RankingsTable rankings={rankings} />
      )}
    </div>
  );
}
