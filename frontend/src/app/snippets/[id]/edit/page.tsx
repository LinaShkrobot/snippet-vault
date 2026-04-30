import Link from 'next/link';
import { notFound } from 'next/navigation';
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
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/snippets/${snippet._id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to snippet
        </Link>
        <h1 className="text-2xl font-bold mt-2">Edit snippet</h1>
      </div>
      <SnippetForm mode="edit" initial={snippet} />
    </main>
  );
}
