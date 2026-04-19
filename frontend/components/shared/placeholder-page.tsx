import type { LucideIcon } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"

type PlaceholderPageProps = {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        icon={icon}
        title={`${title} workspace`}
        description="This section is ready for the next implementation pass using the shared shell, toolbar, cards, and status primitives."
      />
    </>
  )
}
