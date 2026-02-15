import { Routes, Route, Navigate } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppShell from './components/layout/AppShell';
import ScoresPage from './pages/ScoresPage';
import GameDetailPage from './pages/GameDetailPage';
import RankingsPage from './pages/RankingsPage';
import FavoritesPage from './pages/FavoritesPage';
import MorePage from './pages/MorePage';
import StandingsPage from './pages/StandingsPage';
import TeamDirectoryPage from './pages/TeamDirectoryPage';
import TeamSchedulePage from './pages/TeamSchedulePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<ScoresPage />} />
                <Route path="/rankings" element={<RankingsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/more" element={<MorePage />} />
                <Route path="/more/standings" element={<StandingsPage />} />
                <Route path="/more/teams" element={<TeamDirectoryPage />} />
                <Route path="/more/teams/:teamId" element={<TeamSchedulePage />} />
                <Route path="/more/settings" element={<SettingsPage />} />
                {/* Redirect old settings route */}
                <Route path="/settings" element={<Navigate to="/more/settings" replace />} />
              </Route>
              <Route path="/game/:id" element={<GameDetailPage />} />
            </Routes>
          </ErrorBoundary>
        </NotificationProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
