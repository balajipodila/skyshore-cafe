export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg
        viewBox="0 0 1440 90"
        className="w-[200%] h-[58px] sm:h-[86px] block animate-wave-top"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          className="text-skyx-200 dark:text-white/10"
          d="M0,48 C240,90 480,10 720,38 C960,66 1200,30 1440,52 L1440,90 L0,90 Z"
        />
        <path
          fill="currentColor"
          className="text-skyx-200 dark:text-white/10"
          d="M1440,48 C1200,90 960,10 720,38 C480,66 240,30 0,52 L0,90 L1440,90 Z"
        />
      </svg>
    </div>
  );
}
