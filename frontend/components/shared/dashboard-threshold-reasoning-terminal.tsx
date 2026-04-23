"use client"

type ThresholdReasoningItem = {
  sku: string
  status: string
  detail?: string
  currentThreshold?: number | null
  proposedThreshold?: number | null
  confidence?: number | null
  trace?: Array<{
    kind: string
    message: string
    toolName?: string
    toolInput?: unknown
    toolSummary?: string
    decision?: unknown
    proposedThreshold?: number
    requestId?: string
  }>
}

type DashboardThresholdReasoningTerminalProps = {
  items: ThresholdReasoningItem[]
  isRunning?: boolean
  message?: string
  error?: string
}

function formatStatus(status: string) {
  switch (status) {
    case "request_created":
      return "REQUEST_CREATED"
    case "no_change_recommended":
      return "NO_CHANGE"
    case "skipped_existing_pending_request":
      return "SKIPPED_PENDING"
    case "analysis_failed":
      return "ANALYSIS_FAILED"
    default:
      return status.toUpperCase()
  }
}

function formatTraceValue(value: unknown) {
  if (value == null) return undefined
  if (typeof value === "string") return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function DashboardThresholdReasoningTerminal({
  items,
  isRunning = false,
  message,
  error,
}: DashboardThresholdReasoningTerminalProps) {
  const renderedAt = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="rounded-[10px] border border-[#243047] bg-[#0B1220] p-3">
      <div className="flex items-center justify-between gap-3 border-b border-[#1F2A44] pb-2">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#93C5FD]">
          Threshold Reasoning Terminal
        </p>
        <p className="font-mono text-[11px] text-[#6B7280]">{renderedAt}</p>
      </div>

      <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1 font-mono text-[12px] leading-5 text-[#D1D5DB]">
        {isRunning ? (
          <div className="rounded-[8px] bg-[#0F172A] px-3 py-2">
            <p className="text-[#93C5FD]">{">"} starting threshold analysis...</p>
            <p className="mt-1 text-[#9CA3AF]">
              scanning all eligible SKUs, reading demand history, and checking current thresholds
            </p>
          </div>
        ) : null}

        {!isRunning && error ? (
          <div className="rounded-[8px] bg-[#1A1220] px-3 py-2">
            <p className="text-[#FCA5A5]">{">"} analysis failed</p>
            <p className="mt-1 whitespace-pre-wrap text-[#FECACA]">{error}</p>
          </div>
        ) : null}

        {!isRunning && !error && items.length === 0 ? (
          <div className="rounded-[8px] bg-[#0F172A] px-3 py-2">
            <p className="text-[#93C5FD]">{">"} terminal ready</p>
            <p className="mt-1 text-[#9CA3AF]">
              click Analyze Threshold to show the model reasoning for each SKU review
            </p>
          </div>
        ) : null}

        {items.map((item) => (
          <div key={`${item.sku}-${item.status}`} className="rounded-[8px] bg-[#0F172A] px-3 py-2">
            <p className="text-[#93C5FD]">
              {">"} {item.sku} [{formatStatus(item.status)}]
            </p>
            {item.currentThreshold != null || item.proposedThreshold != null ? (
              <p className="mt-1 text-[#9CA3AF]">
                threshold: {item.currentThreshold ?? "N/A"} {"->"} {item.proposedThreshold ?? "N/A"}
                {item.confidence != null ? ` | confidence: ${item.confidence}%` : ""}
              </p>
            ) : null}
            {item.detail ? (
              <p className="mt-1 whitespace-pre-wrap text-[#E5E7EB]">{item.detail}</p>
            ) : null}
            {item.trace && item.trace.length > 0 ? (
              <div className="mt-2 space-y-1 border-t border-[#1F2A44] pt-2">
                {item.trace.map((event, index) => (
                  <div key={`${item.sku}-${index}`} className="text-[11px] leading-5 text-[#A5B4C3]">
                    <p>
                      {">"} [{event.kind.toUpperCase()}] {event.message}
                    </p>
                    {event.toolName ? (
                      <p className="text-[#7DD3FC]">tool: {event.toolName}</p>
                    ) : null}
                    {event.toolInput ? (
                      <p className="truncate text-[#94A3B8]">
                        input: {formatTraceValue(event.toolInput)}
                      </p>
                    ) : null}
                    {event.toolSummary ? (
                      <p className="text-[#94A3B8]">result: {event.toolSummary}</p>
                    ) : null}
                    {event.decision ? (
                      <p className="truncate text-[#C4B5FD]">
                        decision: {formatTraceValue(event.decision)}
                      </p>
                    ) : null}
                    {event.requestId ? (
                      <p className="text-[#86EFAC]">request: {event.requestId}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {!isRunning && !error && message ? (
          <div className="rounded-[8px] bg-[#0F172A] px-3 py-2">
            <p className="text-[#93C5FD]">{">"} run summary</p>
            <p className="mt-1 text-[#E5E7EB]">{message}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
