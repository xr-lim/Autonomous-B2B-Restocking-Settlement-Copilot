import { Search, SlidersHorizontal } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"

type FilterToolbarProps = {
  searchPlaceholder?: string
  children?: ReactNode
}

export function FilterToolbar({
  searchPlaceholder = "Search...",
  children,
}: FilterToolbarProps) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-3 rounded-[14px] border border-[#243047] bg-[#111827] p-2">
      <div className="relative min-w-[320px] flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="h-9 w-full rounded-[10px] border border-transparent bg-[#172033] px-10 text-[14px] text-[#E5E7EB] outline-none placeholder:text-[#6B7280] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
        />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {children}
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-[10px] border-[#243047] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
        </Button>
      </div>
    </div>
  )
}
