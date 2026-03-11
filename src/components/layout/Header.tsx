import logoImg from '/logo.png?url';

export default function Header() {
  return (
    <header className="safe-top sticky top-0 z-30 glass">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-white/[0.06] blur-md" />
            <img
              src={logoImg}
              alt="D1 Diamond"
              className="relative h-8 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <div className="leading-none">
            <h1 className="text-[16px] font-black tracking-tight">
              <span className="gradient-brand">D1 DIAMOND</span>
            </h1>
            <p className="text-[9px] font-semibold text-[var(--c-text-30)] uppercase tracking-[0.18em] mt-0.5">
              College Baseball
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}
