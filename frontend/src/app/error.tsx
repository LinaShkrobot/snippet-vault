'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center border border-red-200 bg-red-50 rounded-md p-8">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-red-700 mb-4">
          {error.message || 'Unable to load snippets. Is the backend running?'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
