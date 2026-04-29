import Link from 'next/link';
import { getSnippets } from '@/lib/api';
import SnippetCard from '@/components/SnippetCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';

export const dynamic = 'force-dynamic';

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
  const page = parseInt(params.page ?? '1', 10) || 1;

  const { data, total, totalPages } = await getSnippets({
    q: params.q,
    tag: params.tag,
    page,
    limit: 10,
  });

  const hasFilters = Boolean(params.q || params.tag);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Snippet Vault</h1>
          <p className="text-gray-600 text-sm mt-1">
            {total} snippet{total === 1 ? '' : 's'}
            {hasFilters ? ' match your filters' : ' stored'}
          </p>
        </div>
        <Link
          href="/snippets/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
        >
          + New snippet
        </Link>
      </header>

      <section className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <SearchBar />
      </section>

      <section>
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-md">
            <p className="text-lg mb-2">No snippets found.</p>
            <p className="text-sm">
              {hasFilters ? (
                'Try adjusting your filters above.'
              ) : (
                <>
                  Get started by{' '}
                  <Link href="/snippets/new" className="text-blue-600 underline">
                    creating your first snippet
                  </Link>
                  .
                </>
              )}
            </p>
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
