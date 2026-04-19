"use client"

import { AlertTriangle } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Something failed to load"
      description="The workspace view could not render. Retry the view, or continue from another module in the sidebar."
      action={
        <Button
          type="button"
          onClick={reset}
          className="h-10 rounded-[10px] bg-[#3B82F6] px-4 text-white hover:bg-[#2563EB]"
        >
          Retry
        </Button>
      }
      tone="danger"
    />
  )
}
