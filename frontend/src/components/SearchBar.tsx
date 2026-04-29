'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

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
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search
        </label>
        <input
          id="q"
          type="text"
          placeholder="Search title or content"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 min-w-32">
        <label
          htmlFor="tag"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tag
        </label>
        <input
          id="tag"
          type="text"
          placeholder="e.g. js"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Searching…' : 'Search'}
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Reset
      </button>
    </form>
  );
}
