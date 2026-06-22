const SkeletonCard = () => (
  <div
    className="border-2 rounded-2xl p-5 animate-pulse"
    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-lime/10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-lime/10 rounded-lg w-3/4" />
        <div className="h-3 bg-lime/8 rounded-lg w-1/2" />
        <div className="h-3 bg-lime/5 rounded-lg w-1/3" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-8 bg-lime/8 rounded-xl w-24" />
      <div className="h-8 bg-lime/8 rounded-xl w-24" />
      <div className="h-8 bg-lime/5 rounded-xl w-10 ml-auto" />
    </div>
  </div>
)

export const SkeletonGrid = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export default SkeletonCard
