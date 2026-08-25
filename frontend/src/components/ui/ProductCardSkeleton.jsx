export default function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-ink-100" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-3 w-1/3 rounded bg-ink-100" />
        <div className="h-4 w-full rounded bg-ink-100" />
        <div className="h-4 w-2/3 rounded bg-ink-100" />
        <div className="h-4 w-1/2 rounded bg-ink-100 mt-1" />
        <div className="h-9 w-full rounded-xl bg-ink-100 mt-3" />
      </div>
    </div>
  )
}
