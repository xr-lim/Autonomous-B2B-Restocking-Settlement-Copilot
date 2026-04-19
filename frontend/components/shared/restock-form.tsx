"use client"

import Link from "next/link"
import { Bot, PackagePlus, Pencil, Save, X } from "lucide-react"
import { useMemo, useState } from "react"

import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Product, RestockRecommendation, Supplier } from "@/lib/types"

type RestockFormProps = {
  recommendation: RestockRecommendation
  product: Product
  supplier?: Supplier
}

export function RestockForm({
  recommendation,
  product,
  supplier,
}: RestockFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(() => ({
    targetPrice: recommendation.targetPrice,
    quantity: recommendation.quantity,
    estimatedSpend: recommendation.estimatedSpend,
    reason: recommendation.reason,
  }))
  const [committed, setCommitted] = useState(draft)

  const thresholdDeficit = product.stockOnHand - product.aiThreshold
  const leadTime = supplier?.leadTimeDays ?? 0

  const fields = isEditing ? draft : committed

  const automationPlan = useMemo(() => recommendation.automationPlan, [
    recommendation.automationPlan,
  ])

  function handleSave() {
    setCommitted(draft)
    setIsEditing(false)
  }

  function handleCancel() {
    setDraft(committed)
    setIsEditing(false)
  }

  function handleEdit() {
    setDraft(committed)
    setIsEditing(true)
  }

  return (
    <Card className="rounded-[14px] border border-[#8B5CF6]/35 bg-[#111827] py-0 shadow-none ring-0">
      <CardHeader className="border-b border-[#243047] p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#8B5CF6]/15">
              <PackagePlus className="size-4 text-[#8B5CF6]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge label="Restock detected" tone="ai" />
                <span className="text-[12px] text-[#9CA3AF]">
                  Conversation ID · {recommendation.conversationId}
                </span>
              </div>
              <CardTitle className="mt-2 text-[16px] font-semibold text-[#E5E7EB]">
                Restock order for {recommendation.productName}
              </CardTitle>
              <p className="mt-1 text-[12px] text-[#9CA3AF]">
                Review stock context and adjust terms before Z.AI starts the
                autonomous negotiation.
              </p>
            </div>
          </div>

          <Bot
            className="size-5 shrink-0 text-[#8B5CF6]"
            aria-hidden="true"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <section>
          <SectionLabel>Stock context</SectionLabel>
          <div className="mt-2 grid grid-cols-4 gap-3">
            <StaticMetric label="Current Stock" value={product.stockOnHand} />
            <StaticMetric label="AI Threshold" value={product.aiThreshold} />
            <StaticMetric
              label="Deficit vs. Threshold"
              value={`${thresholdDeficit > 0 ? "+" : ""}${thresholdDeficit}`}
              valueClassName={
                thresholdDeficit < 0
                  ? "text-[#F87171]"
                  : "text-[#34D399]"
              }
            />
            <StaticMetric
              label="Lead Time"
              value={leadTime ? `${leadTime} days` : "—"}
            />
          </div>
        </section>

        <section>
          <SectionLabel>Order terms</SectionLabel>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <ReadOnlyField label="SKU" value={recommendation.sku} />
            <ReadOnlyField
              label="Supplier"
              value={supplier?.name ?? recommendation.supplier}
            />

            <FieldRow label="Target Price" editing={isEditing}>
              {isEditing ? (
                <Input
                  value={draft.targetPrice}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      targetPrice: event.target.value,
                    }))
                  }
                  className="h-9 rounded-[10px] border-[#243047] bg-[#0B1220] text-[14px] text-[#E5E7EB] placeholder:text-[#6B7280]"
                />
              ) : (
                <FieldValue>{fields.targetPrice}</FieldValue>
              )}
            </FieldRow>

            <FieldRow label="Quantity" editing={isEditing}>
              {isEditing ? (
                <Input
                  type="number"
                  min={0}
                  value={draft.quantity}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      quantity: Number(event.target.value),
                    }))
                  }
                  className="h-9 rounded-[10px] border-[#243047] bg-[#0B1220] text-[14px] text-[#E5E7EB]"
                />
              ) : (
                <FieldValue>
                  {fields.quantity.toLocaleString("en-US")} units
                </FieldValue>
              )}
            </FieldRow>

            <FieldRow label="Est. Spend" editing={isEditing}>
              {isEditing ? (
                <Input
                  value={draft.estimatedSpend}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      estimatedSpend: event.target.value,
                    }))
                  }
                  className="h-9 rounded-[10px] border-[#243047] bg-[#0B1220] text-[14px] text-[#E5E7EB]"
                />
              ) : (
                <FieldValue>{fields.estimatedSpend}</FieldValue>
              )}
            </FieldRow>
          </div>
        </section>

        <section>
          <SectionLabel>Reason</SectionLabel>
          <div className="mt-2">
            {isEditing ? (
              <Textarea
                value={draft.reason}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
                rows={3}
                className="rounded-[10px] border-[#243047] bg-[#0B1220] text-[14px] leading-6 text-[#E5E7EB]"
              />
            ) : (
              <p className="rounded-[10px] border border-[#243047] bg-[#172033] p-3 text-[14px] leading-6 text-[#9CA3AF]">
                {fields.reason}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[12px] border border-[#243047] bg-[#172033] p-4">
          <p className="text-[12px] font-medium text-[#C4B5FD]">
            After approval Z.AI will automate:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {automationPlan.map((step) => (
              <div
                key={step}
                className="flex gap-2 text-[12px] leading-5 text-[#9CA3AF]"
              >
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
                {step}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-[520px] text-[12px] leading-5 text-[#9CA3AF]">
            On <span className="font-medium text-[#C4B5FD]">Start restock</span>,
            Z.AI generates a purchase order PDF, sends it to the supplier, and
            opens a conversation to run the negotiation loop unless interrupted.
          </p>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-9 rounded-[10px] border-[#243047] bg-[#111827] px-3 text-[#E5E7EB] hover:bg-[#243047]"
                >
                  <X className="size-4" aria-hidden="true" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="h-9 rounded-[10px] bg-[#3B82F6] px-4 text-white hover:bg-[#2563EB]"
                >
                  <Save className="size-4" aria-hidden="true" />
                  Save changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleEdit}
                  variant="outline"
                  className="h-9 rounded-[10px] border-[#243047] bg-[#172033] px-3 text-[#E5E7EB] hover:bg-[#243047]"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Edit
                </Button>
                <Button
                  asChild
                  className="h-9 rounded-[10px] bg-[#3B82F6] px-4 text-white hover:bg-[#2563EB]"
                >
                  <Link href={`/conversations/${recommendation.conversationId}`}>
                    Start restock
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-medium uppercase tracking-wider text-[#9CA3AF]">
      {children}
    </p>
  )
}

function StaticMetric({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: number | string
  valueClassName?: string
}) {
  return (
    <div className="rounded-[10px] border border-[#243047] bg-[#172033] p-3">
      <p className="text-[12px] text-[#9CA3AF]">{label}</p>
      <p
        className={
          "mt-1 text-[16px] font-semibold text-[#E5E7EB] " +
          (valueClassName ?? "")
        }
      >
        {value}
      </p>
    </div>
  )
}

function FieldRow({
  label,
  editing,
  children,
}: {
  label: string
  editing: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={
        "rounded-[10px] border p-3 " +
        (editing
          ? "border-[#8B5CF6]/35 bg-[#0B1220]"
          : "border-[#243047] bg-[#172033]")
      }
    >
      <p className="text-[12px] text-[#9CA3AF]">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-[10px] border border-[#243047] bg-[#172033] p-3">
      <p className="text-[12px] text-[#9CA3AF]">{label}</p>
      <p className="mt-1 truncate text-[14px] font-semibold text-[#E5E7EB]">
        {value}
      </p>
    </div>
  )
}

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <p className="truncate text-[14px] font-semibold text-[#E5E7EB]">
      {children}
    </p>
  )
}
