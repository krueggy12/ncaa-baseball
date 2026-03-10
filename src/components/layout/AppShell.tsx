import { Outlet } from 'react-router-dom';
import { useState, useRef, useCallback } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    setAtTop(el.scrollTop < 10);
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 20);
  }, []);

  return (
    <div className="flex flex-col h-full bg-bg-dark">
      <Header />

      {/* Scroll container + bleed overlays */}
      <div className="relative flex-1 min-h-0">

        {/* Top bleed — fades in once user scrolls away from top */}
        <div className={`absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#09090e] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${atTop ? 'opacity-0' : 'opacity-100'}`} />

        <main ref={mainRef} onScroll={handleScroll} className="h-full overflow-y-auto pb-[76px]">
          <Outlet />
        </main>

        {/* Bottom bleed — fades out when user reaches the end */}
        <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#09090e] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${atBottom ? 'opacity-0' : 'opacity-100'}`} />

      </div>

      <BottomNav />
    </div>
  );
}
