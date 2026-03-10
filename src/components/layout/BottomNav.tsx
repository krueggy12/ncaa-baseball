import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
  {
    to: '/',
    label: 'Scores',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
  {
    to: '/rankings',
    label: 'Rankings',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V17a1 1 0 001 1h3V13.5M9 8.5V18h3V8.5M15 11V18h3a1 1 0 001-1v-5a1 1 0 00-1-1h-3z" />
      </svg>
    ),
  },
  {
    to: '/favorites',
    label: 'Favorites',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.75}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    to: '/more',
    label: 'More',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.75} stroke="currentColor">
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
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 glass border-t border-white/[0.07]">
      <div className="flex items-center justify-around h-[60px] max-w-lg mx-auto px-2">
        {tabs.map(tab => {
          const isMoreActive = tab.to === '/more' && location.pathname.startsWith('/more');

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) => {
                const active = isActive || isMoreActive;
                return `flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-200 min-w-[60px] ${
                  active
                    ? 'text-white'
                    : 'text-white/30 hover:text-white/60'
                }`;
              }}
            >
              {({ isActive }) => {
                const active = isActive || isMoreActive;
                return (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-royal shadow-[0_0_14px_rgba(52,116,230,0.5)]'
                        : ''
                    }`}>
                      {tab.icon(active)}
                    </div>
                    <span className={`text-[10px] font-semibold leading-tight transition-all duration-200 ${
                      active ? 'text-white' : 'text-white/30'
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
    </nav>
  );
}
