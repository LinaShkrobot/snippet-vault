export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-24 bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl animate-pulse mb-6" />
      <ul className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="h-28 bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl animate-pulse"
          />
        ))}
      </ul>
    </main>
  );
}
