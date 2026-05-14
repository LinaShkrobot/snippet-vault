import Link from 'next/link';
import { Plus, Sparkles, FileQuestion } from 'lucide-react';
import { getSnippets } from '@/lib/api';
import SnippetCard from '@/components/SnippetCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import ThemeToggle from '@/components/ThemeToggle';

type SearchParams = {
  q?: string;
  tag?: string;
  page?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const { data, total, totalPages } = await getSnippets({
    q: params.q,
    tag: params.tag,
    page,
    limit: 10,
  });

  const hasFilters = Boolean(params.q || params.tag);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
      <header className="flex flex-wrap items-center justify-between mb-8 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Snippet Vault
            </h1>
            <p className="text-zinc-500 dark:text-zinc-100 text-sm">
              {total} snippet{total === 1 ? '' : 's'}
              {hasFilters ? ' match your filters' : ' stored'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/snippets/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-500/30"
          >
            <Plus className="w-4 h-4" />
            New snippet
          </Link>
        </div>
      </header>

      <section className="mb-6 p-4 bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
        <SearchBar />
      </section>

      <section>
        {data.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl">
            <div className="inline-flex p-3 bg-zinc-100 dark:bg-zinc-700 rounded-2xl mb-4">
              <FileQuestion className="w-7 h-7 text-zinc-400" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              No snippets found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-100 max-w-sm mx-auto mb-5">
              {hasFilters
                ? 'Try adjusting your search or filters above.'
                : 'Start building your knowledge base by adding your first snippet.'}
            </p>
            {!hasFilters && (
              <Link
                href="/snippets/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first snippet
              </Link>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {data.map((snippet) => (
              <li key={snippet._id}>
                <SnippetCard snippet={snippet} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Pagination page={page} totalPages={totalPages} searchParams={params} />
    </main>
  );
}
