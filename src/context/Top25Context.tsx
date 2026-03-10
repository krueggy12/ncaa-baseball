import { createContext, useContext, useMemo } from 'react';
import { useTop25 } from '../hooks/useTop25';

// Maps ESPN teamId → D1 Diamond rank (1–25)
const Top25RankContext = createContext<Map<string, number>>(new Map());

export function Top25Provider({ children }: { children: React.ReactNode }) {
  const { rankings } = useTop25();
  const rankMap = useMemo(
    () => new Map(rankings.map(t => [String(t.teamId), t.rank])),
    [rankings]
  );
  return <Top25RankContext.Provider value={rankMap}>{children}</Top25RankContext.Provider>;
}

export const useTop25RankMap = () => useContext(Top25RankContext);
