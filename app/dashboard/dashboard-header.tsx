"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Check, UserRound } from "lucide-react"

type DashboardHeaderProps = {
  organizationName: string
  role: "owner" | "admin" | "manager" | "staff"
}

const roleLabels = {
  owner: "OWNER",
  admin: "ADMIN",
  manager: "MANAGER",
  staff: "STAFF",
}

export default function DashboardHeader({
  organizationName,
  role,
}: DashboardHeaderProps) {
  const notificationRef = useRef<HTMLDivElement>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <header className="relative z-20 flex min-h-[88px] items-center justify-between gap-4 border border-border bg-foreground px-5 py-4 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.3)] sm:px-7 lg:px-9">
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Welcome
        </p>

        <h1 className="truncate text-xl font-bold tracking-tight text-text sm:text-2xl lg:text-[28px]">
          {organizationName}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 border border-border bg-secondary/70 px-4 py-2.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-dark" />

          <span className="text-[10px] font-bold tracking-[0.12em] text-text">
            {roleLabels[role]}
          </span>
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() =>
              setNotificationsOpen((current) => !current)
            }
            className={`relative flex h-11 w-11 items-center justify-center border transition-all duration-200 sm:h-12 sm:w-12 ${
              notificationsOpen
                ? "border-text bg-text text-foreground"
                : "border-border bg-foreground text-muted hover:border-text/30 hover:bg-secondary hover:text-text"
            }`}
          >
            <Bell className="h-[19px] w-[19px]" strokeWidth={1.8} />

            <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-foreground bg-red-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-[calc(100%+14px)] w-[min(340px,calc(100vw-32px))] overflow-hidden border border-border bg-foreground shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-text">
                    Notifications
                  </h2>

                  <p className="mt-1 text-xs text-muted">
                    Your latest updates
                  </p>
                </div>

                <span className="flex h-8 w-8 items-center justify-center bg-secondary text-muted">
                  <Bell className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="px-5 py-9 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center bg-secondary text-muted">
                  <Check className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-medium text-text">
                  You’re all caught up
                </p>

                <p className="mx-auto mt-1 max-w-[230px] text-xs leading-5 text-muted">
                  New notifications and important updates will appear here.
                </p>
              </div>

              <div className="border-t border-border px-5 py-3">
                <p className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                  KYYP Notifications
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Profile"
          className="flex h-11 w-11 items-center justify-center text-text transition-colors duration-200 hover:bg-secondary sm:h-12 sm:w-12"
        >
          <UserRound className="h-[23px] w-[23px]" strokeWidth={1.6} />
        </button>
      </div>
    </header>
  )
}