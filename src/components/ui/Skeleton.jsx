// ✅ Skeleton loading components
// Use these instead of full-screen spinners
// They match the shape of content so there's no layout shift

// Single skeleton card — matches service/project card shape
export function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-700 rounded-xl" />
        <div className="flex-1">
          <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
          <div className="h-3 bg-slate-800 rounded w-1/4" />
        </div>
      </div>
      <div className="h-3 bg-slate-800 rounded w-full mb-2" />
      <div className="h-3 bg-slate-800 rounded w-2/3 mb-4" />
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
        <div className="h-6 bg-slate-700 rounded w-24" />
        <div className="h-3 bg-slate-800 rounded w-20" />
      </div>
    </div>
  );
}

// Grid of skeleton cards — use for Services, Projects pages
export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Skeleton row — use for table-like layouts (Alerts, Notifications)
export function SkeletonRow() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-700 rounded-lg" />
          <div>
            <div className="h-4 bg-slate-700 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-20" />
          </div>
        </div>
        <div className="h-6 bg-slate-700 rounded w-16" />
      </div>
    </div>
  );
}

// Skeleton list — use for Alerts, Incidents, Notifications pages
export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

// Skeleton stat cards — use for Dashboard KPIs
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 animate-pulse">
          <div className="h-3 bg-slate-800 rounded w-2/3 mb-3" />
          <div className="h-8 bg-slate-700 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
