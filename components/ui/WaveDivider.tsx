export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      className={`w-full h-[58px] sm:h-[86px] block ${flip ? "rotate-180" : ""}`}
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        fill="currentColor"
        className="text-skyx-200 dark:text-white/10"
        d="M0,48 C240,90 480,10 720,38 C960,66 1200,30 1440,52 L1440,90 L0,90 Z"
      />
    </svg>
  );
}
