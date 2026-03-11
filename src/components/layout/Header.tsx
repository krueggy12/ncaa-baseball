import logoImg from '/logo.png?url';

export default function Header() {
  return (
    <header className="safe-top sticky top-0 z-30 glass">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-stretch gap-2.5 h-[38px]">
          <img
            src={logoImg}
            alt="D1 Diamond"
            className="h-full w-auto object-contain drop-shadow-sm"
          />
          <div className="flex flex-col justify-between leading-none">
            <h1 className="text-sm font-black tracking-wide">
              <span className="gradient-brand">D1 DIAMOND</span>
            </h1>
            <p className="text-[10px] font-medium text-[var(--c-text-30)] uppercase tracking-widest">
              College Baseball
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
