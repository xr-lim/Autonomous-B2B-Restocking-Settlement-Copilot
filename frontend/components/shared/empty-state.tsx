import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import type { ReactNode } from "react"

import type { StatusTone } from "@/lib/types"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  tone?: StatusTone
  compact?: boolean
}

const toneClassName: Record<StatusTone, string> = {
  default: "text-[#6B7280] bg-[#172033]",
  success: "text-[#10B981] bg-[#10B981]/10",
  warning: "text-[#F59E0B] bg-[#F59E0B]/10",
  danger: "text-[#EF4444] bg-[#EF4444]/10",
  ai: "text-[#8B5CF6] bg-[#8B5CF6]/10",
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  tone = "default",
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#243047] bg-[#111827] text-center",
        compact ? "min-h-[132px] p-5" : "min-h-[240px] p-8"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-[14px]",
          compact ? "size-10" : "size-12",
          toneClassName[tone]
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-[16px] font-semibold text-[#E5E7EB]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-md text-[14px] leading-6 text-[#9CA3AF]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
