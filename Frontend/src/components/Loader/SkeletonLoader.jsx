export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="w-full space-y-3 animate-pulse py-2">
      <div className="flex items-center gap-4 px-4 py-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700/80 rounded-md flex-1" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="flex items-center gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80"
          >
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-md w-1/2" />
            </div>
            {Array.from({ length: columns - 1 }).map((_, cIdx) => (
              <div key={cIdx} className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md flex-1 hidden sm:block" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
            <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
        <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-36" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-24" />
    </div>
  );
}

export default function SkeletonLoader({ type = "table", rows = 5, columns = 5, count = 3 }) {
  if (type === "card") return <CardSkeleton count={count} />;
  if (type === "stat") return <StatSkeleton />;
  return <TableSkeleton rows={rows} columns={columns} />;
}
