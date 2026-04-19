import { AlertTriangle, Boxes, PackageCheck, Sparkles } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { FilterToolbar } from "@/components/shared/filter-toolbar"
import { InventoryListCharts } from "@/components/shared/inventory-charts"
import { InventoryTableClient } from "@/components/shared/inventory-table-client"
import { RestockAlertPanel } from "@/components/shared/restock-alert-panel"
import { StatCard } from "@/components/shared/stat-card"
import { ThresholdChangeRequestList } from "@/components/shared/threshold-change-request-list"
import {
  inventorySummaryStats,
  mockProducts,
  mockSuppliers,
  restockRecommendations,
  thresholdChangeRequests,
} from "@/lib/mock-data"

const summaryIcons = [Boxes, AlertTriangle, PackageCheck, Sparkles]

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

      <RestockAlertPanel recommendations={restockRecommendations} />

      <ThresholdChangeRequestList
        requests={thresholdChangeRequests}
        products={mockProducts}
        description="Z.AI proposes these threshold updates based on velocity, lead time and bundle signals. Approve to apply instantly to the AI threshold column."
      />

      <InventoryListCharts />

      <FilterToolbar searchPlaceholder="Search by SKU, product, supplier, or stock status..." />

      <InventoryTableClient
        initialProducts={mockProducts}
        suppliers={mockSuppliers}
      />
    </>
  )
}
