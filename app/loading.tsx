export default function Loading() {
  return <main className="min-h-screen bg-night px-5 pb-24 pt-40 lg:px-10"><div className="mx-auto max-w-[1440px] animate-pulse"><div className="h-3 w-32 rounded bg-white/10" /><div className="mt-6 h-20 max-w-2xl rounded bg-white/10" /><div className="mt-3 h-20 max-w-xl rounded bg-white/10" /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[.92] rounded-3xl bg-white/[.05]" />)}</div></div></main>;
}
