export default function LoadingSpinner() {
  return (
    <div className="space-y-3 px-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="ml-auto h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="ml-auto h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
