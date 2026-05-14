import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Edit3,
  Link2,
  FileText,
  Terminal,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { ApiError, getSnippet } from '@/lib/api';
import DeleteButton from '@/components/DeleteButton';
import type { Snippet } from '@/lib/types';

const TYPE_CONFIG: Record<
  Snippet['type'],
  { icon: typeof Link2; color: string }
> = {
  link: {
    icon: Link2,
    color:
      'bg-sky-50 text-sky-700 ring-1 ring-sky-200/60 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/30',
  },
  note: {
    icon: FileText,
    color:
      'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30',
  },
  command: {
    icon: Terminal,
    color:
      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let snippet: Snippet;
  try {
    snippet = await getSnippet(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const { icon: TypeIcon, color: typeColor } = TYPE_CONFIG[snippet.type];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to list
      </Link>

      <article className="bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden">
        <header className="flex items-start justify-between gap-4 p-6 border-b border-zinc-100 dark:border-zinc-700">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 break-words tracking-tight">
            {snippet.title}
          </h1>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md uppercase tracking-wide whitespace-nowrap ${typeColor}`}
          >
            <TypeIcon className="w-3.5 h-3.5" />
            {snippet.type}
          </span>
        </header>

        <div className="p-6">
          <pre className="bg-zinc-950 dark:bg-zinc-950 text-zinc-100 rounded-lg p-4 mb-5 text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto border border-zinc-800">
            {snippet.content}
          </pre>

          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {snippet.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-100 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <dl className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-100 pt-4 border-t border-zinc-100 dark:border-zinc-700">
            <div className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {formatDate(snippet.createdAt)}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Updated {formatDate(snippet.updatedAt)}</span>
            </div>
          </dl>
        </div>

        <footer className="flex justify-between items-start gap-2 px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700">
          <Link
            href={`/snippets/${snippet._id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Link>
          <DeleteButton id={snippet._id} />
        </footer>
      </article>
    </main>
  );
}
