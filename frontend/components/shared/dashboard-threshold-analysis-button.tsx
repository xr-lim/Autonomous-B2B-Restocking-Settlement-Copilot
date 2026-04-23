"use client"

import Link from "next/link"
import { Bot, Loader2, PackagePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { DashboardThresholdReasoningTerminal } from "@/components/shared/dashboard-threshold-reasoning-terminal"
import { Button } from "@/components/ui/button"
import {
  analyzeThresholds,
  type ThresholdReasoningItem,
} from "@/lib/threshold-analysis"


export function DashboardThresholdAnalysisButton() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string>()
  const [error, setError] = useState<string>()
  const [reasoningItems, setReasoningItems] = useState<ThresholdReasoningItem[]>([])

  async function handleClick() {
    if (isSubmitting) return

    setIsSubmitting(true)
    setMessage(undefined)
    setError(undefined)

    const result = await analyzeThresholds()

    if (!result.ok) {
      setReasoningItems([])
      setError(result.message ?? "Unable to analyze thresholds.")
      setIsSubmitting(false)
      return
    }

    setReasoningItems(result.results ?? [])

    setMessage(
      result.createdCount && result.createdCount > 0
        ? `Analyzed ${result.analyzedCount ?? 0} SKU${result.analyzedCount === 1 ? "" : "s"} and created ${result.createdCount} request${result.createdCount === 1 ? "" : "s"}.`
        : `Analyzed ${result.analyzedCount ?? 0} SKU${result.analyzedCount === 1 ? "" : "s"} with no new threshold request.`
    )
    router.refresh()
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        variant="outline"
        className="h-14 w-full justify-center rounded-[10px] border-[#1D4ED8] bg-[#2563EB] px-4 text-[16px] font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Bot className="size-4" aria-hidden="true" />
        )}
        {isSubmitting ? "Analyzing..." : "Analyze Threshold"}
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-14 w-full justify-center rounded-[10px] border-[#7C3AED] bg-[#8B5CF6] px-4 text-[16px] font-semibold text-white hover:bg-[#7C3AED]"
      >
        <Link href="#restock-queue">
          <PackagePlus className="size-4" aria-hidden="true" />
          Restock Suggestion
        </Link>
      </Button>
      {message ? (
        <p className="text-center text-[12px] leading-5 text-[#93C5FD]">{message}</p>
      ) : null}
      {error ? (
        <p className="text-center text-[12px] leading-5 text-[#FCA5A5]">{error}</p>
      ) : null}
      <DashboardThresholdReasoningTerminal
        items={reasoningItems}
        isRunning={isSubmitting}
        message={message}
        error={error}
      />
    </div>
  )
}
