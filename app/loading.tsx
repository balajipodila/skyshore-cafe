export default function Loading() {
  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass rounded-[22px] overflow-hidden">
          <div className="h-48 bg-navy/10 dark:bg-white/10 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-5 rounded-full bg-navy/10 animate-pulse w-2/3" />
            <div className="h-3 rounded-full bg-navy/10 animate-pulse w-full" />
            <div className="h-3 rounded-full bg-navy/10 animate-pulse w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
