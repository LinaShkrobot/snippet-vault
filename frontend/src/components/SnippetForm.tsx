'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Save, X, AlertCircle, Link2, FileText, Terminal } from 'lucide-react';
import { ApiError, createSnippet, updateSnippet } from '@/lib/api';
import type { Snippet, SnippetType } from '@/lib/types';

type Props =
  | { mode: 'create'; initial?: undefined }
  | { mode: 'edit'; initial: Snippet };

const TYPES: { value: SnippetType; icon: typeof Link2; label: string }[] = [
  { value: 'link', icon: Link2, label: 'Link' },
  { value: 'note', icon: FileText, label: 'Note' },
  { value: 'command', icon: Terminal, label: 'Command' },
];

function parseTags(input: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of input.split(',')) {
    const tag = raw.trim().toLowerCase();
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }
  return result;
}

export default function SnippetForm(props: Props) {
  const { mode, initial } = props;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [type, setType] = useState<SnippetType>(initial?.type ?? 'note');
  const [tagsInput, setTagsInput] = useState(
    (initial?.tags ?? []).join(', '),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      type,
      tags: parseTags(tagsInput),
    };

    setSubmitting(true);
    try {
      if (mode === 'create') {
        const created = await createSnippet(payload);
        startTransition(() => {
          router.push(`/snippets/${created._id}`);
          router.refresh();
        });
      } else {
        const updated = await updateSnippet(initial._id, payload);
        startTransition(() => {
          router.push(`/snippets/${updated._id}`);
          router.refresh();
        });
      }
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || isPending;

  const inputBase =
    'w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="block text-xs font-medium text-zinc-600 dark:text-zinc-100 mb-1.5 uppercase tracking-wide"
        >
          Title <span className="text-rose-500 normal-case">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder="Give your snippet a clear name..."
          className={inputBase}
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-xs font-medium text-zinc-600 dark:text-zinc-100 mb-1.5 uppercase tracking-wide"
        >
          Content <span className="text-rose-500 normal-case">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          placeholder="Paste your code, link, or note..."
          className={`${inputBase} font-mono resize-y`}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-100 mb-1.5 uppercase tracking-wide">
          Type <span className="text-rose-500 normal-case">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                type === value
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-800'
                  : 'bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-xs font-medium text-zinc-600 dark:text-zinc-100 mb-1.5 uppercase tracking-wide"
        >
          Tags <span className="normal-case text-zinc-400">(comma separated)</span>
        </label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="js, react, tutorial"
          className={inputBase}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm shadow-indigo-500/30"
        >
          <Save className="w-4 h-4" />
          {busy
            ? 'Saving…'
            : mode === 'create'
              ? 'Create snippet'
              : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}
