import Link from 'next/link';
import { Link2, FileText, Terminal } from 'lucide-react';
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

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { icon: Icon, color } = TYPE_CONFIG[snippet.type];

  return (
    <Link
      href={`/snippets/${snippet._id}`}
      className="group block bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-700"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {snippet.title}
        </h3>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md uppercase tracking-wide ${color}`}
        >
          <Icon className="w-3 h-3" />
          {snippet.type}
        </span>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-100 line-clamp-2 mb-3 whitespace-pre-wrap font-mono">
        {snippet.content}
      </p>

      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-100 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
