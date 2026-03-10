import { useState } from 'react';
import { useRankings } from '../hooks/useRankings';
import { usePowerRankings } from '../hooks/usePowerRankings';
import { useTop25 } from '../hooks/useTop25';
import RankingsTable from '../components/rankings/RankingsTable';
import PowerRankingsTable from '../components/rankings/PowerRankingsTable';
import Top25Table from '../components/rankings/Top25Table';
import LoadingSpinner from '../components/common/LoadingSpinner';

type Tab = 'poll' | 'power' | 'top25';

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('poll');
  const { rankings: pollRankings, isLoading: pollLoading, error: pollError } = useRankings();
  const { rankings: powerRankings, isLoading: powerLoading, error: powerError } = usePowerRankings();
  const { rankings: top25Rankings, isLoading: top25Loading, error: top25Error } = useTop25();

  const isLoading = activeTab === 'poll' ? pollLoading : activeTab === 'power' ? powerLoading : top25Loading;
  const error = activeTab === 'poll' ? pollError : activeTab === 'power' ? powerError : top25Error;

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top 25 Rankings</h2>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 px-4 mb-3">
        <button
          onClick={() => setActiveTab('poll')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'poll'
              ? 'bg-royal text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          D1Baseball Poll
        </button>
        <button
          onClick={() => setActiveTab('power')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'power'
              ? 'bg-royal text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          D1 Diamond Power
        </button>
        <button
          onClick={() => setActiveTab('top25')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'top25'
              ? 'bg-royal text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          D1 Diamond Top 25
        </button>
      </div>

      {error && (
        <div className="mx-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
          Failed to load rankings.
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : activeTab === 'poll' ? (
        <RankingsTable rankings={pollRankings} />
      ) : activeTab === 'power' ? (
        <PowerRankingsTable rankings={powerRankings} />
      ) : (
        <Top25Table rankings={top25Rankings} />
      )}
    </div>
  );
}
