import Link from "next/link"
import { SearchX } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Record not found"
      description="The requested dashboard record is not in the demo dataset. Return to the control center to continue."
      action={
        <Button
          asChild
          className="h-10 rounded-[10px] bg-[#3B82F6] px-4 text-white hover:bg-[#2563EB]"
        >
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      }
      tone="warning"
    />
  )
}
