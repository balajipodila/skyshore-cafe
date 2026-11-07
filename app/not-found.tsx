import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-3 sm:mx-6 max-w-3xl lg:mx-auto text-center py-16">
      <p className="font-serif text-6xl font-bold">404</p>
      <h1 className="font-serif text-3xl font-semibold mt-2">This shore doesn&apos;t exist.</h1>
      <p className="text-navy/70 dark:text-white/70 mt-2">The page you want has drifted out with the tide.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-coral text-white px-6 py-3 font-semibold">Back home</Link>
    </div>
  );
}
