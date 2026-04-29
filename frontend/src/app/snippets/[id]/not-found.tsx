import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center border border-gray-200 bg-white rounded-md p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Snippet not found
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          This snippet may have been deleted or never existed.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to list
        </Link>
      </div>
    </main>
  );
}
