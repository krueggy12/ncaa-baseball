import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
  {
    to: '/',
    label: 'Home',
    end: true,
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    to: '/scores',
    label: 'Scores',
    end: false,
    icon: (_active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="9" y1="5" x2="9" y2="19" />
        <line x1="15" y1="5" x2="15" y2="19" />
      </svg>
    ),
  },
  {
    to: '/favorites',
    label: 'Favorites',
    end: false,
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.75}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    to: '/more',
    label: 'More',
    end: false,
    icon: (_active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <circle cx="5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass">

      <div className="flex items-center justify-around h-[60px] max-w-lg mx-auto px-2">
        {tabs.map(tab => {
          const isMoreActive = tab.to === '/more' && location.pathname.startsWith('/more');

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => {
                const active = isActive || isMoreActive;
                return `flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-200 min-w-[60px] ${
                  active ? 'text-[var(--c-text)]' : 'text-[var(--c-text-30)] hover:text-[var(--c-text-60)]'
                }`;
              }}
            >
              {({ isActive }) => {
                const active = isActive || isMoreActive;
                return (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                      active ? 'bg-royal shadow-[0_0_16px_rgba(61,126,245,0.55)]' : ''
                    }`}>
                      {tab.icon(active)}
                    </div>
                    <span className={`text-[10px] font-semibold leading-tight transition-all duration-200 ${
                      active ? 'text-[var(--c-text)]' : 'text-[var(--c-text-30)]'
                    }`}>
                      {tab.label}
                    </span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </div>
      {/* Explicit safe area fill — backdrop-filter doesn't always cover padding on iOS PWA */}
      <div className="bg-[var(--c-nav-bg)]" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
