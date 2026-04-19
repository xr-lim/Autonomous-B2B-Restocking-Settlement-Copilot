import { LoadingSkeleton } from "@/components/shared/loading-skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-3 w-28 animate-pulse rounded-[10px] bg-[#8B5CF6]/25" />
        <div className="mt-4 h-8 w-80 animate-pulse rounded-[10px] bg-[#172033]" />
        <div className="mt-3 h-4 w-[520px] animate-pulse rounded-[10px] bg-[#172033]" />
      </div>
      <section className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} rows={2} className="min-h-[120px]" />
        ))}
      </section>
      <LoadingSkeleton rows={6} />
    </div>
  )
}
