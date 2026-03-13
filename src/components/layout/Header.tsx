import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '/logo.png?url';

const navLinks = [
  { href: '/',          label: 'Home',      exact: true  },
  { href: '/scores',    label: 'Scores',    exact: false },
  { href: '/rankings',  label: 'Rankings',  exact: false },
  { href: '/favorites', label: 'Favorites', exact: false },
];

const moreLinks = [
  { href: '/more/standings', label: 'Standings' },
  { href: '/more/stats',     label: 'Stats'     },
  { href: '/more/teams',     label: 'Teams'     },
  { href: '/more/settings',  label: 'Settings'  },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Header() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreActive = pathname.startsWith('/more');

  return (
    <header className="safe-top sticky top-0 z-30 glass">
      <div className="flex items-center justify-between px-4 py-2.5">

        {/* Logo */}
        <Link to="/" className="flex items-start gap-2.5" onClick={() => setMobileOpen(false)}>
          <img
            src={logoImg}
            alt="D1 Diamond"
            className="h-[28px] w-auto object-contain drop-shadow-sm"
          />
          <div>
            <h1 className="text-sm font-black tracking-wide leading-tight">
              <span className="text-[var(--c-text)]">D1 </span>
              <span className="text-royal-bright">DIAMOND</span>
            </h1>
            <p className="text-[10px] font-medium text-[var(--c-text-30)] uppercase tracking-widest leading-tight">
              College Baseball
            </p>
          </div>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-[0.14em] transition-colors ${
                isActive(pathname, link.href, link.exact)
                  ? 'bg-royal text-white'
                  : 'text-[var(--c-text-60)] hover:text-[var(--c-text)]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative group">
            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-[0.14em] transition-colors ${
              moreActive ? 'bg-royal text-white' : 'text-[var(--c-text-60)] hover:text-[var(--c-text)]'
            }`}>
              More
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full pt-1 z-50">
              <div className="bg-[var(--c-surface)] rounded-xl shadow-lg border border-[var(--c-border)] py-1 min-w-[140px]">
                {moreLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] transition-colors ${
                      isActive(pathname, link.href, false)
                        ? 'text-royal'
                        : 'text-[var(--c-text-60)] hover:text-[var(--c-text)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile hamburger — hidden on desktop */}
        <button
          className="sm:hidden p-2 text-[var(--c-text-60)]"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--c-border)] bg-[var(--c-nav-bg)]">
          {[...navLinks.map(l => ({ ...l, exact: l.exact })), ...moreLinks.map(l => ({ ...l, exact: false }))].map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block w-full px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.14em] border-b border-[var(--c-border)] transition-colors ${
                isActive(pathname, link.href, link.exact) ? 'text-royal' : 'text-[var(--c-text-60)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
