import Link from 'next/link';
import SnippetForm from '@/components/SnippetForm';

export default function NewSnippetPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to list
        </Link>
        <h1 className="text-2xl font-bold mt-2">New snippet</h1>
      </div>
      <SnippetForm mode="create" />
    </main>
  );
}
