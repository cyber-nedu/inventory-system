"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Check, UserRound } from "lucide-react"

type DashboardHeaderProps = {
  organizationName: string
  role: "owner" | "admin" | "manager" | "staff"
}

export default function DashboardHeader({
  organizationName,
  role: _role,
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
    <header className="relative z-30 flex min-h-[72px] items-center justify-between gap-4 border border-border bg-foreground px-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:px-6 lg:px-7">
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Workspace
        </p>

        <h2 className="truncate text-lg font-bold tracking-tight text-text sm:text-xl">
          {organizationName}
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() =>
              setNotificationsOpen((current) => !current)
            }
            className={`relative flex h-10 w-10 items-center justify-center border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:h-11 sm:w-11 ${
              notificationsOpen
                ? "border-text bg-text text-foreground"
                : "border-border bg-foreground text-muted hover:border-primary/20 hover:bg-primary-light/40 hover:text-text"
            }`}
          >
            <Bell
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
            />

            <span
              aria-hidden="true"
              className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full border-2 border-foreground bg-red-500"
            />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] w-[min(340px,calc(100vw-32px))] overflow-hidden border border-border bg-foreground shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-text">
                    Notifications
                  </h3>

                  <p className="mt-1 text-xs text-muted">
                    Your latest updates
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center bg-secondary text-muted"
                >
                  <Bell className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-primary-light text-primary">
                  <Check
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={2}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-text">
                  You’re all caught up
                </p>

                <p className="mx-auto mt-1.5 max-w-[240px] text-xs leading-5 text-muted">
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
          className="flex h-10 w-10 items-center justify-center border border-transparent text-text transition-all duration-200 hover:border-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:h-11 sm:w-11"
        >
          <UserRound
            aria-hidden="true"
            className="h-[21px] w-[21px]"
            strokeWidth={1.6}
          />
        </button>
      </div>
    </header>
  )
}