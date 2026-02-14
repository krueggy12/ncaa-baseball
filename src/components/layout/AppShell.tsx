import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppShellProps {
  liveCount?: number;
}

export default function AppShell({ liveCount }: AppShellProps) {
  return (
    <div className="flex flex-col h-full bg-bg-light dark:bg-bg-dark">
      <Header liveCount={liveCount} />
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
