import { Outlet } from 'react-router-dom';
import { useState, useRef, useCallback } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { useTheme } from '../../context/ThemeContext';

export default function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const { isDark } = useTheme();
  const bleedColor = isDark ? '#09090e' : '#f2f4f8';

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    setAtTop(el.scrollTop < 10);
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 20);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[var(--c-bg)]">
      <Header />

      {/* Scroll container + bleed overlays */}
      <div className="relative flex-1 min-h-0">

        {/* Top bleed — fades in once user scrolls away from top */}
        <div
          className={`absolute top-0 left-0 right-0 h-14 pointer-events-none z-10 transition-opacity duration-300 ${atTop ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: `linear-gradient(to bottom, ${bleedColor}, transparent)` }}
        />

        <main ref={mainRef} onScroll={handleScroll} className="h-full overflow-y-auto pb-[76px]">
          <Outlet />
        </main>

        {/* Bottom bleed — fades out when user reaches the end */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10 transition-opacity duration-300 ${atBottom ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: `linear-gradient(to top, ${bleedColor}, transparent)` }}
        />

      </div>

      <BottomNav />
    </div>
  );
}
