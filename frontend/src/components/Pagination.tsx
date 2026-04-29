import Link from 'next/link';

type Props = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function buildHref(
  searchParams: Record<string, string | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== 'page') params.set(key, value);
  }
  params.set('page', String(page));
  return `/?${params.toString()}`;
}

export default function Pagination({ page, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="flex justify-center items-center gap-4 mt-6">
      {hasPrev ? (
        <Link
          href={buildHref(searchParams, page - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-400 cursor-not-allowed">
          ← Prev
        </span>
      )}

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(searchParams, page + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-400 cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  );
}
