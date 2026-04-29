import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApiError, getSnippet } from '@/lib/api';
import DeleteButton from '@/components/DeleteButton';
import type { Snippet } from '@/lib/types';

export const dynamic = 'force-dynamic';

const TYPE_STYLES: Record<Snippet['type'], string> = {
  link: 'bg-blue-100 text-blue-800',
  note: 'bg-yellow-100 text-yellow-800',
  command: 'bg-green-100 text-green-800',
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

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to list
        </Link>
      </div>

      <article className="border border-gray-200 rounded-md bg-white p-6">
        <header className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            {snippet.title}
          </h1>
          <span
            className={`px-2 py-1 text-xs font-medium rounded uppercase whitespace-nowrap ${TYPE_STYLES[snippet.type]}`}
          >
            {snippet.type}
          </span>
        </header>

        <pre className="bg-gray-50 border border-gray-200 rounded p-4 mb-4 text-sm font-mono whitespace-pre-wrap break-words">
          {snippet.content}
        </pre>

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {snippet.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <dl className="text-xs text-gray-500 space-y-1 mb-6">
          <div>
            <dt className="inline">Created: </dt>
            <dd className="inline">{formatDate(snippet.createdAt)}</dd>
          </div>
          <div>
            <dt className="inline">Updated: </dt>
            <dd className="inline">{formatDate(snippet.updatedAt)}</dd>
          </div>
        </dl>

        <div className="flex justify-between items-start gap-2 pt-4 border-t border-gray-200">
          <Link
            href={`/snippets/${snippet._id}/edit`}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            Edit
          </Link>
          <DeleteButton id={snippet._id} />
        </div>
      </article>
    </main>
  );
}
