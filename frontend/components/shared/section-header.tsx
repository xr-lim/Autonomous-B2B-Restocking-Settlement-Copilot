import type { ReactNode } from "react"

type SectionHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
}

export function SectionHeader({
  title,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[20px] font-semibold leading-tight text-[#E5E7EB]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[14px] text-[#9CA3AF]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
