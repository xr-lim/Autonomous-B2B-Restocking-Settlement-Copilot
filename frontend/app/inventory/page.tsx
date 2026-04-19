import Link from "next/link"
import { AlertTriangle, Boxes, PackageCheck, Sparkles } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { FilterToolbar } from "@/components/shared/filter-toolbar"
import { InventoryListCharts } from "@/components/shared/inventory-charts"
import { RestockOrderCard } from "@/components/shared/restock-order-card"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  inventorySummaryStats,
  mockProducts,
  mockSuppliers,
  restockRecommendations,
} from "@/lib/mock-data"
import type { StatusTone, StockStatus } from "@/lib/types"

const summaryIcons = [Boxes, AlertTriangle, PackageCheck, Sparkles]

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

function supplierName(supplierId: string) {
  return (
    mockSuppliers.find((supplier) => supplier.id === supplierId)?.name ??
    "Unknown supplier"
  )
}

function formatTrend(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`
}

function trendClassName(value: number) {
  if (value < -20) {
    return "text-[#EF4444]"
  }

  if (value < 0) {
    return "text-[#F59E0B]"
  }

  return "text-[#10B981]"
}

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Inventory"
        title="Inventory"
        description="Track current stock, AI threshold changes, and supplier-linked restocking opportunities."
      />

      <section className="grid grid-cols-4 gap-4">
        {inventorySummaryStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            tone={stat.tone}
            icon={summaryIcons[index]}
          />
        ))}
      </section>

      <RestockOrderCard recommendation={restockRecommendations[0]} compact />

      <InventoryListCharts />

      <FilterToolbar searchPlaceholder="Search by SKU, product, supplier, or stock status..." />

      <Card className="rounded-[14px] border border-[#243047] bg-[#111827] py-0 shadow-none ring-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#243047] hover:bg-transparent">
                <TableHead className="px-4 text-[12px] text-[#9CA3AF]">SKU</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">Product Name</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">Supplier</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">Current Stock</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">Static Threshold</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">AI Threshold</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">Threshold Buffer</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">30D Trend</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">365D Trend</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">Stock Status</TableHead>
                <TableHead className="text-[12px] text-[#9CA3AF]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => {
                const thresholdBuffer = product.stockOnHand - product.aiThreshold

                return (
                  <TableRow
                    key={product.id}
                    className="border-[#243047] hover:bg-[#172033]/70"
                  >
                    <TableCell className="px-4 text-[12px] font-medium text-[#E5E7EB]">
                      {product.sku}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-[14px] font-medium text-[#E5E7EB]">
                          {product.name}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          {product.category}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[14px] text-[#9CA3AF]">
                      {supplierName(product.supplierId)}
                    </TableCell>
                    <TableCell className="text-[14px] text-[#E5E7EB]">
                      {product.stockOnHand}
                    </TableCell>
                    <TableCell className="text-[14px] text-[#9CA3AF]">
                      {product.staticThreshold}
                    </TableCell>
                    <TableCell className="text-[14px] text-[#E5E7EB]">
                      {product.aiThreshold}
                    </TableCell>
                    <TableCell
                      className={
                        thresholdBuffer < 0
                          ? "text-[14px] font-medium text-[#EF4444]"
                          : "text-[14px] font-medium text-[#10B981]"
                      }
                    >
                      {thresholdBuffer > 0 ? "+" : ""}
                      {thresholdBuffer}
                    </TableCell>
                    <TableCell className={`text-[14px] ${trendClassName(product.trend30d)}`}>
                      {formatTrend(product.trend30d)}
                    </TableCell>
                    <TableCell className={`text-[14px] ${trendClassName(product.trend365d)}`}>
                      {formatTrend(product.trend365d)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={stockStatusLabel[product.status]}
                        tone={stockStatusTone[product.status]}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        asChild
                        variant="outline"
                        className="h-8 rounded-[10px] border-[#243047] bg-[#172033] text-[#E5E7EB] hover:bg-[#243047]"
                      >
                        <Link href={`/inventory/${product.sku}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
