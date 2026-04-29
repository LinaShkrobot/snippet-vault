export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-9 w-64 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="h-32 bg-gray-100 rounded animate-pulse mb-6" />
      <ul className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="h-24 border border-gray-200 rounded-md p-4 animate-pulse bg-gray-50"
          />
        ))}
      </ul>
    </main>
  );
}
