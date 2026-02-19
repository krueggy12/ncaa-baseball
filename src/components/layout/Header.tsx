import logoImg from '/logo.png?url';

export default function Header() {
  return (
    <header className="safe-top sticky top-0 z-30 bg-navy backdrop-blur-lg border-b border-white/[0.07]">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <img
            src={logoImg}
            alt="D1 Diamond"
            className="h-8 w-auto object-contain"
          />
          <div className="leading-none">
            <h1 className="text-[15px] font-black tracking-tight text-white">
              D1<span className="text-d1red">DIAMOND</span>
            </h1>
            <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest mt-0.5">
              College Baseball
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
