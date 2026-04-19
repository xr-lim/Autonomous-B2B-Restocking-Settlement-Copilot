"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  bottomNavigationItems,
  navigationItems,
  workspaceNavigationMeta,
} from "@/lib/navigation"
import { cn } from "@/lib/utils"

function SidebarLink({
  href,
  icon: Icon,
  title,
  pathname,
}: {
  href: string
  icon: (typeof navigationItems)[number]["icon"]
  title: string
  pathname: string
}) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex h-10 items-center gap-3 rounded-[10px] px-3 text-[14px] font-medium text-[#9CA3AF] transition-colors hover:bg-[#172033] hover:text-[#E5E7EB]",
        isActive &&
          "bg-[#172033] text-[#E5E7EB] ring-1 ring-[#3B82F6]/40"
      )}
    >
      <Icon
        className={cn(
          "size-4 text-[#6B7280] transition-colors group-hover:text-[#3B82F6]",
          isActive && "text-[#3B82F6]"
        )}
        aria-hidden="true"
      />
      <span className="truncate">{title}</span>
    </Link>
  )
}

export function SidebarNav() {
  const pathname = usePathname()
  const AssistantIcon = workspaceNavigationMeta.assistantIcon

  return (
    <aside className="sticky top-0 flex h-screen w-[264px] shrink-0 flex-col border-r border-[#243047] bg-[#121A2B]">
      <div className="flex h-16 items-center gap-3 border-b border-[#243047] px-6">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20">
          <AssistantIcon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[#E5E7EB]">
            {workspaceNavigationMeta.name}
          </p>
          <p className="truncate text-[12px] text-[#9CA3AF]">
            Autonomous Restocking
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navigationItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            pathname={pathname}
          />
        ))}
      </nav>
      <div className="space-y-4 border-t border-[#243047] p-4">
        {bottomNavigationItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            pathname={pathname}
          />
        ))}
        <div className="rounded-[14px] border border-[#243047] bg-[#111827] p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#10B981]" />
            <span className="text-[12px] font-medium text-[#10B981]">
              Z.AI monitoring
            </span>
          </div>
          <p className="text-[12px] leading-5 text-[#9CA3AF]">
            Settlement, stock risk, and supplier signals are synced for review.
          </p>
        </div>
      </div>
    </aside>
  )
}
