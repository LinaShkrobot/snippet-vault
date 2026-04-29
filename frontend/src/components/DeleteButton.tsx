'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { ApiError, deleteSnippet } from '@/lib/api';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this snippet? This cannot be undone.')) return;

    setError(null);
    setBusy(true);
    try {
      await deleteSnippet(id);
      startTransition(() => {
        router.push('/');
        router.refresh();
      });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : 'Failed to delete snippet.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy || isPending}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {busy || isPending ? 'Deleting…' : 'Delete'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
