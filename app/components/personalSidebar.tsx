"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Activity,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react"

type PersonalSidebarProps = {
  workspaceId: string
  workspaceName?: string | null
  avatarUrl?: string | null
}

type SidebarLink = {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

export default function PersonalSidebar({
  workspaceId,
  workspaceName,
  avatarUrl,
}: PersonalSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const basePath = `/${workspaceId}/personal`

  const sidebarLinks: SidebarLink[] = [
    {
      label: "Dashboard",
      href: `${basePath}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      label: "Tasks",
      href: `${basePath}/dashboard/tasks`,
      icon: CheckSquare,
    },
    {
      label: "Profile",
      href: `${basePath}/dashboard/profile`,
      icon: UserRound,
    },
    {
      label: "Activity",
      href: `${basePath}/dashboard/activity`,
      icon: Activity,
    },
    {
      label: "Settings",
      href: `${basePath}/settings`,
      icon: Settings,
    },
  ]

  const initials =
    workspaceName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U"

  const isActive = (href: string) => {
    if (href === `${basePath}/dashboard`) {
      return pathname === href
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const sidebarContent = (
    <>
      <div className="border-b border-white/10 px-6 py-6">
        <Link href={basePath} onClick={closeMenu}>
          <h1 className="text-xl font-semibold">
            KYYP<span className="text-primary">.</span>
          </h1>

          <p className="mt-1 text-xs text-white/60">
            Personal Workspace
          </p>
        </Link>
      </div>

      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={workspaceName || "Profile"}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {workspaceName || "User"}
            </p>

            <p className="mt-0.5 text-xs text-white/60">
              Personal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5">
        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-foreground text-text shadow-sm md:hidden"
      >
        <Menu size={21} />
      </button>

      <aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-primary-dark text-white md:flex">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/30"
          />

          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto bg-primary-dark text-white shadow-2xl max-[479px]:w-full max-[479px]:max-w-none">
            <div className="flex justify-end px-5 py-4">
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              {sidebarContent}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}