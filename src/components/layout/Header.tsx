import { Link } from 'react-router-dom';
import logoImg from '/logo.png?url';

export default function Header() {
  return (
    <header className="safe-top sticky top-0 z-30 glass">
      <div className="flex items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-start gap-2.5">
          <img
            src={logoImg}
            alt="D1 Diamond"
            className="h-[28px] w-auto object-contain drop-shadow-sm"
          />
          <div>
            <h1 className="text-sm font-black tracking-wide leading-tight">
              <span className="text-[var(--c-text)]">D1 </span><span className="text-royal-bright">DIAMOND</span>
            </h1>
            <p className="text-[10px] font-medium text-[var(--c-text-30)] uppercase tracking-widest leading-tight">
              College Baseball
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
