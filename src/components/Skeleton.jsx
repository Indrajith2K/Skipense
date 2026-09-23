/**
 * Skeleton — a single animated placeholder row.
 * Used in ExpenseList while the initial fetch is loading.
 * Pure presentational — no props, no state.
 */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-4 border-b border-skipense-mist last:border-0">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-4 flex-1 rounded" />
      <div className="skeleton h-4 w-16 rounded ml-auto" />
      <div className="skeleton h-8 w-8 rounded-lg" />
      <div className="skeleton h-8 w-8 rounded-lg" />
    </div>
  )
}

/**
 * SkeletonCard — mobile version of the skeleton (stacked layout).
 */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3 mb-3">
      <div className="flex justify-between">
        <div className="skeleton h-4 w-28 rounded" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-5 w-24 rounded ml-auto" />
    </div>
  )
}
