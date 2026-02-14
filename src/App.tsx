import { Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppShell from './components/layout/AppShell';
import ScoresPage from './pages/ScoresPage';
import GameDetailPage from './pages/GameDetailPage';
import RankingsPage from './pages/RankingsPage';
import FavoritesPage from './pages/FavoritesPage';
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
                <Route path="/settings" element={<SettingsPage />} />
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
