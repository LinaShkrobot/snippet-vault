import Link from 'next/link';
import type { Snippet } from '@/lib/types';

const TYPE_STYLES: Record<Snippet['type'], string> = {
  link: 'bg-blue-100 text-blue-800',
  note: 'bg-yellow-100 text-yellow-800',
  command: 'bg-green-100 text-green-800',
};

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <Link
      href={`/snippets/${snippet._id}`}
      className="block border border-gray-200 rounded-md p-4 bg-white hover:border-gray-400 transition"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{snippet.title}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded uppercase ${TYPE_STYLES[snippet.type]}`}
        >
          {snippet.type}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2 whitespace-pre-wrap">
        {snippet.content}
      </p>
      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
