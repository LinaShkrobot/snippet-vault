import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SnippetForm from '@/components/SnippetForm';

export default function NewSnippetPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to list
      </Link>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
        New snippet
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-100 mb-8">
        Save a useful link, note, or terminal command.
      </p>
      <div className="bg-white/95 backdrop-blur-sm dark:bg-zinc-500/60 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
        <SnippetForm mode="create" />
      </div>
    </main>
  );
}
