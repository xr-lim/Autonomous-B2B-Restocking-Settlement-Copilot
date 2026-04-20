import { Badge } from "@/components/ui/badge"
import type { StatusTone } from "@/lib/types"
import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  label: string
  tone?: StatusTone
  className?: string
}

const toneClassName: Record<StatusTone, string> = {
  default: "border-[#243047] bg-[#172033] text-[#9CA3AF]",
  success: "border-[#10B981]/30 bg-[#10B981]/10 text-[#34D399]",
  warning: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FBBF24]",
  danger: "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#F87171]",
  ai: "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]",
}

export function StatusBadge({
  label,
  tone = "default",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-7 rounded-[10px] border px-2.5 text-[13px] font-medium",
        toneClassName[tone],
        className
      )}
    >
      {label}
    </Badge>
  )
}
