'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, Hash, X } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [tag, setTag] = useState(searchParams.get('tag') ?? '');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (tag.trim()) params.set('tag', tag.trim());
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/?${qs}` : '/');
    });
  }

  function handleReset() {
    setQ('');
    setTag('');
    startTransition(() => {
      router.push('/');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-48">
        <label
          htmlFor="q"
          className="block text-xs font-medium text-zinc-600 dark:text-zinc-100 mb-1.5 uppercase tracking-wide"
        >
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="q"
            type="text"
            placeholder="Title or content..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="flex-1 min-w-32">
        <label
          htmlFor="tag"
          className="block text-xs font-medium text-zinc-600 dark:text-zinc-100 mb-1.5 uppercase tracking-wide"
        >
          Tag
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="tag"
            type="text"
            placeholder="e.g. react"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
      >
        <Search className="w-4 h-4" />
        {isPending ? 'Searching…' : 'Search'}
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <X className="w-4 h-4" />
        Reset
      </button>
    </form>
  );
}
