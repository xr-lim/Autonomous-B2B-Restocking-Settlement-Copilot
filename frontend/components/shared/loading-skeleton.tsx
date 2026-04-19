import { cn } from "@/lib/utils"

type LoadingSkeletonProps = {
  rows?: number
  className?: string
}

export function LoadingSkeleton({
  rows = 3,
  className,
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border border-[#243047] bg-[#111827] p-5",
        className
      )}
      aria-label="Loading content"
    >
      <div className="mb-5 h-5 w-40 animate-pulse rounded-[10px] bg-[#172033]" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.5fr_1fr_96px] gap-4"
          >
            <div className="h-4 animate-pulse rounded-[10px] bg-[#172033]" />
            <div className="h-4 animate-pulse rounded-[10px] bg-[#172033]" />
            <div className="h-4 animate-pulse rounded-[10px] bg-[#172033]" />
          </div>
        ))}
      </div>
    </div>
  )
}
