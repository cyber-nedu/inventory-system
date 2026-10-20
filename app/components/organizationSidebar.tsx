"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Menu,
  Route,
  Settings,
  Truck,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"
import Logo from "@/app/components/logo"

type SidebarProps = {
  organizationName?: string
}

type NavigationItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Routes",
    href: "/dashboard/routes",
    icon: Route,
  },
  {
    label: "Vehicles",
    href: "/dashboard/vehicles",
    icon: Truck,
  },
  {
    label: "Members",
    href: "/dashboard/members",
    icon: Users,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function Sidebar({
  organizationName = "Your organization",
}: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }

    return pathname.startsWith(href)
  }

  const navigation = (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`group relative flex min-h-11 items-center gap-3 px-3 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-primary text-foreground shadow-sm"
                : "text-muted hover:bg-secondary hover:text-text"
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                active
                  ? "text-foreground"
                  : "text-muted group-hover:text-primary-dark"
              }`}
              strokeWidth={active ? 2.2 : 1.9}
            />

            <span className="truncate">{item.label}</span>

            {active && (
              <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-foreground" />
            )}
          </Link>
        )
      })}
    </nav>
  )

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 shrink-0 items-center border-b border-border px-5">
        <Logo />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        {navigation}
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
            <Building2 className="h-[18px] w-[18px]" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Organization
            </p>

            <p className="mt-0.5 truncate text-sm font-semibold text-text">
              {organizationName}
            </p>
          </div>

          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted"
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center border border-border bg-foreground text-text shadow-sm transition-colors duration-200 hover:bg-secondary lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-border bg-foreground lg:block">
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute inset-y-0 left-0 w-[min(86vw,320px)] bg-foreground shadow-2xl transition-transform duration-300 ease-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-5">
              <Logo />

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center text-muted transition-colors duration-200 hover:bg-secondary hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5">
              {navigation}
            </div>

            <div className="shrink-0 border-t border-border p-3">
              <div className="flex items-center gap-3 px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary-light text-primary-dark">
                  <Building2
                    className="h-[18px] w-[18px]"
                    strokeWidth={2}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                    Organization
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-text">
                    {organizationName}
                  </p>
                </div>

                <ChevronDown
                  className="h-4 w-4 shrink-0 text-muted"
                  strokeWidth={1.8}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}