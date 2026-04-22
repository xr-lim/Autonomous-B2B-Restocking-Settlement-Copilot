import { Bell } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-end border-b border-[#243047] bg-[#0B1020]/95 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="relative rounded-[10px] text-[#9CA3AF] hover:bg-[#172033] hover:text-[#E5E7EB]"
          aria-label="Notifications"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-[#EF4444]" />
        </Button>

        <div className="hidden items-center gap-3 rounded-[10px] border border-[#243047] bg-[#121A2B] px-3 py-2 xl:flex">
          <span className="text-[12px] text-[#9CA3AF]">Workspace</span>
          <span className="text-[14px] font-medium text-[#E5E7EB]">
            Merchant Admin
          </span>
        </div>

        <div className="flex h-8 items-center gap-2 rounded-[10px] border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 text-[12px] font-medium text-[#C4B5FD]">
          <span className="size-2 rounded-full bg-[#10B981]" />
          Z.AI Active
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="rounded-[10px] text-[#E5E7EB] hover:bg-[#172033]"
          aria-label="Open user menu"
        >
          <Avatar className="size-8 border border-[#243047]">
            <AvatarFallback className="bg-[#172033] text-[12px] font-semibold text-[#E5E7EB]">
              MA
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  )
}
