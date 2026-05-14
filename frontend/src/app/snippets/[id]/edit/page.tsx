import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ApiError, getSnippet } from '@/lib/api';
import SnippetForm from '@/components/SnippetForm';
import type { Snippet } from '@/lib/types';

export default async function EditSnippetPage({
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

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-12">
      <Link
        href={`/snippets/${snippet._id}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to snippet
      </Link>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
        Edit snippet
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-100 mb-8">
        Update the title, content, type, or tags.
      </p>
      <div className="bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
        <SnippetForm mode="edit" initial={snippet} />
      </div>
    </main>
  );
}
