import { useState } from 'react';
import { useRankings } from '../hooks/useRankings';
import { useTop25 } from '../hooks/useTop25';
import RankingsTable from '../components/rankings/RankingsTable';
import Top25Table from '../components/rankings/Top25Table';
import LoadingSpinner from '../components/common/LoadingSpinner';

type Tab = 'top25' | 'poll';

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('top25');
  const { rankings: top25Rankings, isLoading: top25Loading, error: top25Error } = useTop25();
  const { rankings: pollRankings, isLoading: pollLoading, error: pollError } = useRankings();

  const isLoading = activeTab === 'top25' ? top25Loading : pollLoading;
  const error = activeTab === 'top25' ? top25Error : pollError;

  return (
    <div>
      {/* Page header */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-[22px] font-black text-white tracking-tight">
          Top 25 Rankings
        </h2>
        <p className="text-[11px] text-white/30 font-medium mt-0.5">
          {activeTab === 'top25' ? 'D1 Diamond composite model' : 'D1Baseball media poll'}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1.5 px-4 mb-3">
        <button
          onClick={() => setActiveTab('top25')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-black tracking-wide transition-all duration-200 ${
            activeTab === 'top25'
              ? 'bg-royal text-white shadow-[0_0_14px_rgba(52,116,230,0.4)]'
              : 'bg-white/[0.06] text-white/35 hover:bg-white/[0.09] hover:text-white/60'
          }`}
        >
          D1 Diamond
        </button>
        <button
          onClick={() => setActiveTab('poll')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-black tracking-wide transition-all duration-200 ${
            activeTab === 'poll'
              ? 'bg-royal text-white shadow-[0_0_14px_rgba(52,116,230,0.4)]'
              : 'bg-white/[0.06] text-white/35 hover:bg-white/[0.09] hover:text-white/60'
          }`}
        >
          Media Poll
        </button>
      </div>

      {error && (
        <div className="mx-4 p-3 bg-d1red/10 border border-d1red/20 rounded-xl text-[12px] text-d1red text-center font-medium">
          Failed to load rankings. Pull to refresh.
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : activeTab === 'top25' ? (
        <Top25Table rankings={top25Rankings} />
      ) : (
        <RankingsTable rankings={pollRankings} />
      )}
    </div>
  );
}
