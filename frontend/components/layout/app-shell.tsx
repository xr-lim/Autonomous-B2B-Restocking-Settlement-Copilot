import type { ReactNode } from "react"

import { SidebarNav } from "@/components/layout/sidebar-nav"
import { TopHeader } from "@/components/layout/top-header"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#E5E7EB]">
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
