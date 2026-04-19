import Link from "next/link"
import {
  AlertTriangle,
  Bot,
  MessageSquareText,
  ReceiptText,
  SlidersHorizontal,
} from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { DashboardCharts } from "@/components/shared/dashboard-charts"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  dashboardKpis,
  insightCards,
  mockInvoices,
  mockSuppliers,
  restockRecommendations,
} from "@/lib/mock-data"
import type { Invoice, StatusTone } from "@/lib/types"

const statIcons = [
  AlertTriangle,
  SlidersHorizontal,
  MessageSquareText,
  ReceiptText,
]

const approvalTone: Record<Invoice["approvalState"], StatusTone> = {
  "Waiting Approval": "ai",
  "Needs Review": "warning",
  Blocked: "danger",
  Completed: "success",
}

const riskTone: Record<Invoice["riskLevel"], StatusTone> = {
  "Low Risk": "success",
  "Medium Risk": "warning",
  "High Risk": "danger",
}

const activeInvoices = mockInvoices.filter((invoice) =>
  ["Waiting Approval", "Needs Review", "Blocked"].includes(invoice.approvalState)
)

function supplierName(supplierId: string) {
  return (
    mockSuppliers.find((supplier) => supplier.id === supplierId)?.name ??
    "Unknown supplier"
  )
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bee2Bee command center"
        title="Restock Control Center"
        description="Monitor stock health, supplier communication, invoice risk, and approval pipeline."
        actions={
          <Button
            asChild
            className="h-10 rounded-[10px] bg-[#3B82F6] px-4 text-white hover:bg-[#2563EB]"
          >
            <Link href="/invoice-management">Review approvals</Link>
          </Button>
        }
      />

      <section className="grid grid-cols-4 gap-4">
        {dashboardKpis.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            tone={stat.tone}
            icon={statIcons[index]}
          />
        ))}
      </section>

      <section className="grid grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardHeader className="border-b border-[#243047] p-4">
              <div>
                <CardTitle className="text-[16px] font-semibold text-[#E5E7EB]">
                  Restock Queue
                </CardTitle>
                <p className="mt-1 text-[12px] leading-5 text-[#9CA3AF]">
                  SKUs below or near AI threshold that need restock action.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#243047] hover:bg-transparent">
                    <TableHead className="px-4 text-[12px] text-[#9CA3AF]">
                      SKU
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Product
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Supplier
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Stock / Threshold
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Quantity
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Target Price
                    </TableHead>
                    <TableHead className="text-right text-[12px] text-[#9CA3AF]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restockRecommendations.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-[#243047] hover:bg-[#172033]/70"
                    >
                      <TableCell className="px-4 text-[12px] font-medium text-[#E5E7EB]">
                        {item.sku}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#E5E7EB]">
                        {item.productName}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#9CA3AF]">
                        {item.supplier}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold text-[#E5E7EB]">
                            {item.currentStock}
                          </span>
                          <span className="text-[12px] text-[#6B7280]">
                            / {item.aiThreshold}
                          </span>
                          <StatusBadge label="needs restock" tone="danger" />
                        </div>
                      </TableCell>
                      <TableCell className="text-[14px] font-medium text-[#E5E7EB]">
                        {item.quantity.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#9CA3AF]">
                        {item.targetPrice}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          variant="outline"
                          className="h-8 rounded-[10px] border-[#243047] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
                        >
                          <Link href={`/conversations/${item.conversationId}`}>
                            Start
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardHeader className="border-b border-[#243047] p-4">
              <div>
                <CardTitle className="text-[16px] font-semibold text-[#E5E7EB]">
                  Invoice Action Queue
                </CardTitle>
                <p className="mt-1 text-[12px] leading-5 text-[#9CA3AF]">
                  Only invoices waiting for approval, review, or unblock action.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#243047] hover:bg-transparent">
                    <TableHead className="px-4 text-[12px] text-[#9CA3AF]">
                      Invoice
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Supplier
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Linked SKU(s)
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Amount
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      State
                    </TableHead>
                    <TableHead className="text-[12px] text-[#9CA3AF]">
                      Risk
                    </TableHead>
                    <TableHead className="text-right text-[12px] text-[#9CA3AF]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="border-[#243047] hover:bg-[#172033]/70"
                    >
                      <TableCell className="px-4 text-[12px] font-medium text-[#E5E7EB]">
                        {invoice.id}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#E5E7EB]">
                        {supplierName(invoice.supplierId)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
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
                      </TableCell>
                      <TableCell className="text-[14px] text-[#E5E7EB]">
                        {invoice.currency} {invoice.amount.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={invoice.approvalState}
                          tone={approvalTone[invoice.approvalState]}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={invoice.riskLevel}
                          tone={riskTone[invoice.riskLevel]}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          variant="outline"
                          className="h-8 rounded-[10px] border-[#243047] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
                        >
                          <Link href={`/invoice-management/${invoice.id}`}>
                            Review
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#E5E7EB]">
                  AI Threshold Recommendation
                </h3>
                <Bot className="size-5 text-[#8B5CF6]" aria-hidden="true" />
              </div>
              <p className="text-[28px] font-semibold text-[#E5E7EB]">
                {insightCards.thresholdRecommendation.value}
              </p>
              <p className="mt-3 text-[14px] leading-6 text-[#9CA3AF]">
                {insightCards.thresholdRecommendation.body}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
            <CardContent className="p-5">
              <h3 className="text-[16px] font-semibold text-[#E5E7EB]">
                Recent Supplier Activity
              </h3>
              <div className="mt-4 space-y-3">
                {insightCards.recentSupplierActivity.map((activity) => (
                  <p key={activity} className="text-[14px] leading-6 text-[#9CA3AF]">
                    {activity}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <DashboardCharts />
    </>
  )
}
