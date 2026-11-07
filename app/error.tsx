"use client";

export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-3 sm:mx-6 max-w-3xl lg:mx-auto text-center py-16 glass rounded-[28px] p-8">
      <h1 className="font-serif text-3xl font-semibold">Something spilled.</h1>
      <p className="text-navy/70 dark:text-white/70 mt-2">We dropped a cup. It happens. Try again?</p>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-coral text-white px-6 py-3 font-semibold">
        Try again
      </button>
    </div>
  );
}
