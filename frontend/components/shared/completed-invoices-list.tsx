"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useMemo, useState } from "react"

import { EmptyState } from "@/components/shared/empty-state"
import { FilterToolbar } from "@/components/shared/filter-toolbar"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import type { Invoice, StatusTone, Supplier } from "@/lib/types"

type CompletedInvoicesListProps = {
  invoices: Invoice[]
  suppliers: Supplier[]
}

const riskTone: Record<Invoice["riskLevel"], StatusTone> = {
  "Low Risk": "success",
  "Medium Risk": "warning",
  "High Risk": "danger",
}

const validationTone: Record<Invoice["validationStatus"], StatusTone> = {
  Parsed: "default",
  Validated: "success",
  "Mismatch Detected": "danger",
  "Missing Information": "warning",
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
})

function supplierName(suppliers: Supplier[], supplierId: string) {
  return (
    suppliers.find((supplier) => supplier.id === supplierId)?.name ??
    "Unknown supplier"
  )
}

export function CompletedInvoicesList({
  invoices,
  suppliers,
}: CompletedInvoicesListProps) {
  const [query, setQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")

  const filteredInvoices = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return invoices.filter((invoice) => {
      const haystack = [
        invoice.id,
        invoice.invoiceNumber,
        invoice.workflowId,
        invoice.currency,
        invoice.amount.toString(),
        invoice.linkedSkus.join(" "),
        invoice.riskLevel,
        invoice.validationStatus,
        supplierName(suppliers, invoice.supplierId),
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch = !keyword || haystack.includes(keyword)
      const matchesRisk = riskFilter === "all" || invoice.riskLevel === riskFilter
      return matchesSearch && matchesRisk
    })
  }, [invoices, query, riskFilter, suppliers])

  return (
    <>
      <FilterToolbar
        searchPlaceholder="Search completed invoices, suppliers, SKU, workflow, or amount..."
        searchValue={query}
        onSearchChange={setQuery}
        filterLabel="Invoice risk"
        filterValue={riskFilter}
        onFilterChange={setRiskFilter}
        filterOptions={[
          { label: "All risk levels", value: "all" },
          { label: "Low risk", value: "Low Risk" },
          { label: "Medium risk", value: "Medium Risk" },
          { label: "High risk", value: "High Risk" },
        ]}
      />

      <section className="space-y-3">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <article
              key={invoice.id}
              className="grid grid-cols-12 items-center gap-3 rounded-[12px] border border-[#243047] bg-[#111827] px-4 py-3 transition hover:border-[#3B82F6]/70 hover:bg-[#172033]"
            >
              <div className="col-span-2">
                <p className="text-[14px] font-semibold text-[#E5E7EB]">
                  {invoice.id}
                </p>
                <p className="mt-0.5 text-[12px] text-[#9CA3AF]">
                  {dateFormatter.format(new Date(invoice.lastUpdated))}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[12px] text-[#6B7280]">Supplier</p>
                <p className="mt-0.5 truncate text-[14px] font-medium text-[#E5E7EB]">
                  {supplierName(suppliers, invoice.supplierId)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[12px] text-[#6B7280]">Linked SKU(s)</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {invoice.linkedSkus.map((sku) => (
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
              <div className="col-span-2">
                <p className="text-[12px] text-[#6B7280]">Amount</p>
                <p className="mt-0.5 text-[14px] font-semibold text-[#E5E7EB]">
                  {invoice.currency} {invoice.amount.toLocaleString("en-US")}
                </p>
              </div>
              <div className="col-span-3 flex flex-wrap gap-1.5">
                <StatusBadge label={invoice.approvalState} tone="success" />
                <StatusBadge
                  label={invoice.riskLevel}
                  tone={riskTone[invoice.riskLevel]}
                />
                <StatusBadge
                  label={invoice.validationStatus}
                  tone={validationTone[invoice.validationStatus]}
                />
                <StatusBadge label={invoice.workflowId} tone="default" />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  asChild
                  className="h-9 rounded-[10px] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
                >
                  <Link
                    href={`/invoice-management/${invoice.id}`}
                    className="flex items-center gap-2"
                  >
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="No completed invoices"
            description="No completed invoices match the current search and filter."
            tone="success"
          />
        )}
      </section>
    </>
  )
}
