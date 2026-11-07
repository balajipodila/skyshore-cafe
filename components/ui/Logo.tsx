export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Skyshore logo — wave and sun" fill="none">
      <g className="animate-wave-drift" style={{ transformOrigin: "32px 42px" }}>
        <circle cx="42" cy="18" r="10" fill="#FF7A6B" fillOpacity="0.9" />
      </g>
      <path d="M6 36c6-6 12 6 18 0s12 6 18 0 12 6 16 0" stroke="#2C8AA4" strokeWidth="4" strokeLinecap="round" />
      <path d="M8 48c5-5 10 5 15 0s10 5 15 0 10 5 15 0" stroke="#3FA9C4" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
export function LogoWordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo />
      <span>
        <span className="block font-serif text-xl leading-none font-semibold tracking-tight">Skyshore</span>
        <span className="block text-[10px] leading-none tracking-[0.28em] uppercase text-navy/60 dark:text-white/60">Café · Where sky meets sea</span>
      </span>
    </span>
  );
}
