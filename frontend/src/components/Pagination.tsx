import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const baseClasses =
    'inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors';
  const activeClasses =
    'text-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 bg-white/95 backdrop-blur-sm dark:bg-zinc-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800';
  const disabledClasses =
    'text-zinc-300 dark:text-zinc-700 border border-zinc-100 dark:border-zinc-800 cursor-not-allowed';

  return (
    <nav className="flex justify-center items-center gap-3 mt-8">
      {hasPrev ? (
        <Link
          href={buildHref(searchParams, page - 1)}
          className={`${baseClasses} ${activeClasses}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
      ) : (
        <span className={`${baseClasses} ${disabledClasses}`}>
          <ChevronLeft className="w-4 h-4" />
          Prev
        </span>
      )}

      <span className="text-sm text-zinc-500 dark:text-zinc-100 font-medium">
        Page <span className="text-zinc-900 dark:text-zinc-100">{page}</span> of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(searchParams, page + 1)}
          className={`${baseClasses} ${activeClasses}`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className={`${baseClasses} ${disabledClasses}`}>
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
