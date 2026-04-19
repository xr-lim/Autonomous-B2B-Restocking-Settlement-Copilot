import Link from "next/link"
import {
  Bot,
  CircleStop,
  FileImage,
  FileText,
  ImageIcon,
  Mail,
  Mic,
  Paperclip,
} from "lucide-react"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  mockConversations,
  mockInvoices,
  mockNegotiationMessages,
  mockProducts,
  mockSuppliers,
} from "@/lib/mock-data"
import type {
  NegotiationMessage,
  NegotiationState,
  StatusTone,
  StockStatus,
} from "@/lib/types"

const stateTone: Record<NegotiationState, StatusTone> = {
  "New Input": "default",
  "Needs Analysis": "warning",
  "Counter Offer Suggested": "ai",
  "Waiting Reply": "default",
  Accepted: "success",
  Escalated: "danger",
  Closed: "success",
}

const messageTone: Record<NegotiationMessage["type"], StatusTone> = {
  "supplier-message": "default",
  "ai-interpretation": "ai",
  "merchant-action": "success",
  "ai-recommendation": "warning",
}

const attachmentIcon = {
  email: Mail,
  screenshot: FileImage,
  image: ImageIcon,
  pdf: FileText,
  voice: Mic,
}

const stockStatusTone: Record<StockStatus, StatusTone> = {
  healthy: "success",
  "near-threshold": "warning",
  "below-threshold": "danger",
  "batch-candidate": "ai",
}

const stockStatusLabel: Record<StockStatus, string> = {
  healthy: "Healthy",
  "near-threshold": "Near Threshold",
  "below-threshold": "Below Threshold",
  "batch-candidate": "Batch Candidate",
}

export function generateStaticParams() {
  return mockConversations.map((conversation) => ({ id: conversation.id }))
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const conversation = mockConversations.find((item) => item.id === id)

  if (!conversation) {
    notFound()
  }

  const supplier = mockSuppliers.find((item) => item.id === conversation.supplierId)
  const linkedProducts = conversation.linkedSkus
    .map((sku) => mockProducts.find((product) => product.sku === sku))
    .filter((product) => Boolean(product))
  const messages = mockNegotiationMessages.filter(
    (item) => item.conversationId === conversation.id
  )
  const linkedInvoice = mockInvoices.find((invoice) =>
    conversation.linkedSkus.includes(invoice.productSku)
  )

  return (
    <>
      <PageHeader
        eyebrow="Conversation workspace"
        title={conversation.subject}
        description={`${conversation.id} / ${supplier?.name ?? "Unknown supplier"}`}
        actions={
          <>
            <Button
              type="button"
              className="h-10 rounded-[10px] bg-[#EF4444] px-4 text-white hover:bg-[#DC2626]"
            >
              <CircleStop className="size-4" aria-hidden="true" />
              Stop Z.AI
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-[10px] border-[#243047] bg-[#172033] px-4 text-[#E5E7EB] hover:bg-[#243047]"
            >
              <Link href="/conversations">Back to conversations</Link>
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-[300px_1fr_340px] gap-6">
        <aside className="space-y-4">
          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardHeader className="border-b border-[#243047] p-4">
              <CardTitle className="text-[16px] font-semibold text-[#E5E7EB]">
                Conversation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <InfoRow label="Supplier" value={supplier?.name ?? "Unknown supplier"} />
              <InfoRow label="Source Type" value={conversation.source} />
              <InfoRow label="Target Price Range" value={conversation.targetPriceRange} />
              <InfoRow label="Created Date" value={conversation.createdDate} />
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Current State</p>
                <div className="mt-2">
                  <StatusBadge
                    label={conversation.negotiationState}
                    tone={stateTone[conversation.negotiationState]}
                  />
                </div>
              </div>
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Linked SKU IDs</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {conversation.linkedSkus.map((sku) => (
                    <Link key={sku} href={`/inventory/${sku}`}>
                      <StatusBadge
                        label={sku}
                        tone="default"
                        className="hover:border-[#3B82F6] hover:text-[#93C5FD]"
                      />
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Linked Products</p>
                <div className="mt-2 space-y-2">
                  {linkedProducts.map((product) => (
                    <p key={product?.sku} className="text-[14px] text-[#E5E7EB]">
                      {product?.name}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardHeader className="border-b border-[#243047] p-4">
              <CardTitle className="text-[16px] font-semibold text-[#E5E7EB]">
                Linked Product Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {linkedProducts.map((product) => (
                <div
                  key={product?.sku}
                  className="rounded-[10px] border border-[#243047] bg-[#172033] p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[14px] font-medium text-[#E5E7EB]">
                        {product?.sku}
                      </p>
                      <p className="text-[12px] text-[#9CA3AF]">{product?.name}</p>
                    </div>
                    {product ? (
                      <StatusBadge
                        label={stockStatusLabel[product.status]}
                        tone={stockStatusTone[product.status]}
                      />
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12px] text-[#9CA3AF]">
                    <span>Stock: {product?.stockOnHand}</span>
                    <span>AI threshold: {product?.aiThreshold}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>

        <main>
          <Card className="min-h-[720px] rounded-[14px] border border-[#243047] bg-[#0F1728] py-0 shadow-none ring-0">
            <CardHeader className="border-b border-[#243047] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-[16px] font-semibold text-[#E5E7EB]">
                    Negotiation Thread
                  </CardTitle>
                  <p className="mt-1 text-[12px] text-[#9CA3AF]">
                    Z.AI negotiating autonomously with {supplier?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label="Z.AI live" tone="ai" />
                  <Button
                    type="button"
                    className="h-8 rounded-[10px] bg-[#EF4444] px-3 text-[12px] text-white hover:bg-[#DC2626]"
                  >
                    <CircleStop className="size-3.5" aria-hidden="true" />
                    Interrupt
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex min-h-[640px] flex-col p-0">
              <div className="border-b border-[#243047] px-5 py-3 text-center text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
                Negotiation initiated / Z.AI running supplier loop
              </div>

              <div className="flex-1 space-y-5 p-5">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}

                <div className="ml-8 max-w-[86%] rounded-[14px] border border-[#8B5CF6]/30 bg-[#111827] p-4 shadow-lg shadow-black/10">
                  <div className="mb-3 flex items-center gap-2">
                    <StatusBadge label="Z.AI autonomous draft" tone="ai" />
                    <span className="text-[12px] text-[#9CA3AF]">
                      auto-send queued
                    </span>
                  </div>
                  <p className="text-[14px] leading-6 text-[#E5E7EB]">
                    We can accept the split delivery only if freight is capped and
                    the second shipment quantity is confirmed. If volume increases
                    to the AI recommended bundle, can you meet the target range of{" "}
                    {conversation.targetPriceRange}?
                  </p>
                  <div className="mt-4 rounded-[10px] border border-[#243047] bg-[#172033] p-3">
                    <p className="text-[12px] font-medium text-[#C4B5FD]">
                      Z.AI automation rationale
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[#9CA3AF]">
                      {conversation.nextAction.negotiationSummary}
                    </p>
                  </div>
                  <p className="mt-4 text-[12px] text-[#9CA3AF]">
                    No approval required. Z.AI continues automatically unless the
                    operator interrupts.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#243047] bg-[#0B1020] p-4">
                <textarea
                  className="mb-3 min-h-[72px] w-full resize-none rounded-[10px] border border-[#243047] bg-[#172033] p-3 text-[14px] text-[#E5E7EB] outline-none placeholder:text-[#6B7280] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  placeholder="Optional operator note. Use Interrupt to stop Z.AI before it sends."
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-9 rounded-[10px] border-[#243047] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
                    >
                      <ImageIcon className="size-4" aria-hidden="true" />
                      Image
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 rounded-[10px] border-[#243047] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
                    >
                      <FileText className="size-4" aria-hidden="true" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 rounded-[10px] border-[#243047] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
                    >
                      <Mic className="size-4" aria-hidden="true" />
                      Voice
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button className="h-10 rounded-[10px] bg-[#172033] px-4 text-[#E5E7EB] hover:bg-[#243047]">
                      View Z.AI Analysis
                    </Button>
                    <Button className="h-10 rounded-[10px] bg-[#EF4444] px-4 text-white hover:bg-[#DC2626]">
                      <CircleStop className="size-4" aria-hidden="true" />
                      Interrupt & Take Over
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <aside className="space-y-4">
          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardHeader className="border-b border-[#243047] p-4">
              <CardTitle className="text-[16px] font-semibold text-[#E5E7EB]">
                AI Extraction Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <InfoRow label="Extracted Price" value={conversation.aiExtraction.extractedPrice} />
              <InfoRow
                label="Extracted Quantity"
                value={conversation.aiExtraction.extractedQuantity}
              />
              <InfoRow
                label="Delivery Estimate"
                value={conversation.aiExtraction.deliveryEstimate}
              />
              <InfoRow
                label="Supplier Language"
                value={conversation.aiExtraction.supplierLanguage}
              />
              <InfoRow
                label="Detected Intent"
                value={conversation.aiExtraction.detectedIntent}
              />
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Missing Fields</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {conversation.aiExtraction.missingFields.length > 0 ? (
                    conversation.aiExtraction.missingFields.map((field) => (
                      <StatusBadge key={field} label={field} tone="warning" />
                    ))
                  ) : (
                    <StatusBadge label="None" tone="success" />
                  )}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] text-[#9CA3AF]">
                    Confidence Score
                  </span>
                  <span className="text-[14px] font-semibold text-[#E5E7EB]">
                    {conversation.aiExtraction.confidenceScore}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#172033]">
                  <div
                    className="h-2 rounded-full bg-[#8B5CF6]"
                    style={{
                      width: `${conversation.aiExtraction.confidenceScore}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardHeader className="border-b border-[#243047] p-4">
              <CardTitle className="text-[16px] font-semibold text-[#E5E7EB]">
                Next Action Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="rounded-[14px] border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 p-4">
                <p className="text-[12px] font-medium text-[#C4B5FD]">
                  Recommended next step
                </p>
                <p className="mt-2 text-[14px] leading-6 text-[#E5E7EB]">
                  {conversation.nextAction.recommendedNextStep}
                </p>
              </div>
              <InfoRow
                label="Negotiation Summary"
                value={conversation.nextAction.negotiationSummary}
              />
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Linked Invoice Status</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge
                    label={conversation.nextAction.linkedInvoiceStatus}
                    tone="warning"
                  />
                  {linkedInvoice ? (
                    <Link
                      href={`/invoice-management/${linkedInvoice.id}`}
                      className="text-[12px] font-medium text-[#3B82F6] hover:text-[#93C5FD]"
                    >
                      Open invoice
                    </Link>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-[#9CA3AF]">{label}</p>
      <p className="mt-1 text-[14px] leading-6 text-[#E5E7EB]">{value}</p>
    </div>
  )
}

function MessageBubble({ message }: { message: NegotiationMessage }) {
  const isSupplier = message.type === "supplier-message"
  const isMerchant = message.type === "merchant-action"

  return (
    <div
      className={
        isSupplier
          ? "ml-auto flex max-w-[78%] items-start gap-3"
          : "mr-auto flex max-w-[84%] items-start gap-3"
      }
    >
      {!isSupplier ? (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD]">
          <Bot className="size-4" aria-hidden="true" />
        </div>
      ) : null}
      <div
        className={
          isSupplier
            ? "rounded-[14px] border border-[#243047] bg-[#273044] p-4"
            : isMerchant
              ? "rounded-[14px] border border-[#10B981]/30 bg-[#10B981]/10 p-4"
              : "rounded-[14px] border border-[#243047] bg-[#111827] p-4"
        }
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <StatusBadge
            label={message.type.replace(/-/g, " ")}
            tone={messageTone[message.type]}
          />
          <span className="text-[12px] text-[#6B7280]">
            {message.author} / {message.sentiment}
          </span>
        </div>
        <p className="text-[14px] leading-6 text-[#E5E7EB]">{message.body}</p>
        {message.attachmentType ? (
          <AttachmentPreview
            type={message.attachmentType}
            label={message.attachmentLabel ?? "Attachment"}
          />
        ) : null}
      </div>
      {isSupplier ? (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#273044] text-[11px] font-semibold text-[#CBD5E1]">
          AP
        </div>
      ) : null}
    </div>
  )
}

function AttachmentPreview({
  type,
  label,
}: {
  type: NonNullable<NegotiationMessage["attachmentType"]>
  label: string
}) {
  const Icon = attachmentIcon[type] ?? Paperclip
  const isVisual = type === "screenshot" || type === "image"

  return (
    <div className="mt-4 rounded-[12px] border border-[#243047] bg-[#111827] p-3">
      <div className="flex items-center gap-2 text-[12px] font-medium text-[#9CA3AF]">
        <Icon className="size-4 text-[#3B82F6]" aria-hidden="true" />
        {label}
      </div>
      {isVisual ? (
        <div className="mt-3 h-24 rounded-[10px] border border-[#243047] bg-[linear-gradient(135deg,#172033,#111827_45%,#243047)]" />
      ) : null}
      {type === "voice" ? (
        <div className="mt-3 rounded-[10px] bg-[#172033] p-3 text-[12px] leading-5 text-[#9CA3AF]">
          Transcription available. Z.AI detected conflicting dates and missing
          discount terms.
        </div>
      ) : null}
    </div>
  )
}
