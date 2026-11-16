"use client"

import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleUserRound,
  Clipboard,
  Clock3,
  Database,
  KeyRound,
  LayoutDashboard,
  Monitor,
  Route,
  Save,
  Settings2,
  ShieldCheck,
  Truck,
  UserCheck,
  UserRound,
  UsersRound,
} from "lucide-react"
import Sidebar from "@/app/components/organizationSidebar"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import SettingsHeader from "./settings-header"
import { useDashboardRoutes, useDashboardVehicles } from "../dashboard-data"
import { createClient } from "@/app/lib/supabase/client"

type Role = "owner" | "admin" | "manager" | "staff"

type Organization = {
  id: string
  name: string
  owner_id: string
}

type OrganizationMember = {
  organization_id: string
  role: Role
}

type Tab = "overview" | "general" | "roles" | "interface"

type Preferences = {
  confirmBeforeDelete: boolean
  compactTables: boolean
}

const defaultPreferences: Preferences = {
  confirmBeforeDelete: true,
  compactTables: false,
}

function getStringMetadata(
  user: User,
  key: string,
): string {
  const value = user.user_metadata?.[key]

  return typeof value === "string" ? value.trim() : ""
}

function getDisplayName(user: User) {
  const fullName = getStringMetadata(user, "full_name")

  if (fullName) {
    return fullName
  }

  if (user.email) {
    return user.email.split("@")[0]
  }

  return "User"
}

function getFirstName(user: User) {
  const fullName = getStringMetadata(user, "full_name")

  if (fullName) {
    return fullName.split(/\s+/)[0]
  }

  if (user.email) {
    return user.email.split("@")[0]
  }

  return "there"
}

function getInitials(user: User) {
  const displayName = getDisplayName(user)
  const parts = displayName.split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return "U"
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return "Good morning"
  }

  if (hour < 18) {
    return "Good afternoon"
  }

  return "Good evening"
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getRelativeTime(value?: string | null) {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const difference = Date.now() - date.getTime()
  const seconds = Math.round(difference / 1000)

  if (seconds < 60) {
    return "Just now"
  }

  const minutes = Math.round(seconds / 60)

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.round(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.round(hours / 24)

  if (days < 30) {
    return `${days}d ago`
  }

  const months = Math.round(days / 30)

  if (months < 12) {
    return `${months}mo ago`
  }

  const years = Math.round(months / 12)

  return `${years}y ago`
}

function formatLastUpdated(updatedAt?: string) {
  if (!updatedAt) {
    return "Recently"
  }

  const date = new Date(updatedAt)

  if (Number.isNaN(date.getTime())) {
    return "Recently"
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function getPreferences(user: User): Preferences {
  const value = user.user_metadata?.preferences

  if (!value || typeof value !== "object") {
    return defaultPreferences
  }

  const preferences = value as Partial<Preferences>

  return {
    confirmBeforeDelete:
      typeof preferences.confirmBeforeDelete === "boolean"
        ? preferences.confirmBeforeDelete
        : defaultPreferences.confirmBeforeDelete,
    compactTables:
      typeof preferences.compactTables === "boolean"
        ? preferences.compactTables
        : defaultPreferences.compactTables,
  }
}

function getRoleLabel(role: Role) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "neutral" | "success" | "warning" | "danger" | "primary"
}) {
  const classes = {
    neutral: "border-border bg-secondary text-muted",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    primary: "border-primary/20 bg-primary-light text-primary",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${classes[tone]}`}
    >
      {children}
    </span>
  )
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className = "",
}: {
  title: string
  description?: string
  icon: typeof Settings2
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`border border-border bg-foreground ${className}`}
    >
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center bg-secondary text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-text">{title}</h2>

            {description ? (
              <p className="mt-1 text-xs leading-5 text-muted">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function ProgressBar({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-text">{label}</span>

        <span className="text-xs font-bold text-primary">
          {value}%
        </span>
      </div>

      <div
        className="h-2 bg-secondary"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label}
      >
        <div
          className="h-full bg-primary transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: () => void
  label: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-5 border border-border bg-background px-4 py-4 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-pressed={checked}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-text">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>

      <span
        className={`relative h-6 w-11 shrink-0 border transition ${
          checked
            ? "border-primary bg-primary"
            : "border-border bg-secondary"
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 size-5 bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  )
}

function EmptyDataCard({
  icon: Icon,
  title,
  description,
  href,
  action,
}: {
  icon: typeof Route
  title: string
  description: string
  href: string
  action: string
}) {
  return (
    <div className="border border-dashed border-border bg-background p-5">
      <div className="flex size-10 items-center justify-center bg-secondary text-muted">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-text">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-muted">
        {description}
      </p>

      <Link
        href={href}
        className="mt-4 inline-flex min-h-10 items-center gap-2 border border-border bg-foreground px-3.5 text-xs font-bold text-text transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {action}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}

function TimelineItem({
  icon: Icon,
  title,
  date,
}: {
  icon: typeof Clock3
  title: string
  date?: string | null
}) {
  if (!date) {
    return null
  }

  return (
    <li className="flex gap-4">
      <div className="flex size-9 shrink-0 items-center justify-center bg-secondary text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 border-b border-border pb-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-semibold text-text">{title}</p>

          <span className="text-[11px] text-muted">
            {getRelativeTime(date)}
          </span>
        </div>

        <p className="mt-1 text-xs text-muted">
          {formatDateTime(date)}
        </p>
      </div>
    </li>
  )
}

function SettingsTabs({
  activeTab,
  onChange,
}: {
  activeTab: Tab
  onChange: (tab: Tab) => void
}) {
  const tabs: Array<{
    id: Tab
    label: string
  }> = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "general",
      label: "General",
    },
    {
      id: "roles",
      label: "Roles & Permissions",
    },
    {
      id: "interface",
      label: "Interface",
    },
  ]

  return (
    <div className="border-b border-border bg-foreground lg:ml-[260px]">
      <nav
        aria-label="Settings sections"
        className="mx-auto flex max-w-[1500px] overflow-x-auto px-4 sm:px-6 lg:px-8"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={active ? "page" : undefined}
              className={`relative min-h-12 shrink-0 border-b-2 px-4 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:border-border hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function OverviewTab({
  user,
  organization,
  role,
  workspaceCount,
  preferences,
  routesCount,
  vehiclesCount,
  onNavigate,
}: {
  user: User
  organization: Organization
  role: Role
  workspaceCount: number
  preferences: Preferences
  routesCount: number
  vehiclesCount: number
  onNavigate: (tab: Tab) => void
}) {
  const fullName = getStringMetadata(user, "full_name")
  const phone = getStringMetadata(user, "phone")
  const jobTitle = getStringMetadata(user, "job_title")
  const emailVerified = Boolean(user.email_confirmed_at)
  const pendingEmail = user.new_email?.trim() || ""
  const initials = getInitials(user)

  const profileItems = [
    {
      label: "Full name added",
      complete: Boolean(fullName),
      action: "Profile",
    },
    {
      label: "Phone number added",
      complete: Boolean(phone),
      action: "Profile",
    },
    {
      label: "Job title added",
      complete: Boolean(jobTitle),
      action: "Profile",
    },
    {
      label: "Email verified",
      complete: emailVerified,
      action: "Verification",
    },
    {
      label: "Interface preferences saved",
      complete: true,
      action: "Interface",
    },
  ]

  const completedCount = profileItems.filter(
    (item) => item.complete,
  ).length

  const profileCompletion = Math.round(
    (completedCount / profileItems.length) * 100,
  )

  const nextIncomplete = profileItems.find(
    (item) => !item.complete,
  )

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden border border-border bg-foreground">
        <div className="absolute inset-y-0 right-0 w-[45%] bg-primary-light/40 [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)]" />

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center bg-primary text-sm font-bold text-white sm:size-16">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary">
                  {getGreeting()}, {getFirstName(user)}
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-[-0.035em] text-text sm:text-3xl">
                  Your workspace at a glance.
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {user.email ? (
                    <span className="max-w-full truncate text-xs text-muted">
                      {user.email}
                    </span>
                  ) : null}

                  <StatusBadge
                    tone={emailVerified ? "success" : "warning"}
                  >
                    {emailVerified ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <AlertCircle className="size-3" />
                    )}
                    {emailVerified ? "Verified" : "Unverified"}
                  </StatusBadge>

                  <StatusBadge tone="primary">
                    {getRoleLabel(role)}
                  </StatusBadge>

                  <StatusBadge>{organization.name}</StatusBadge>
                </div>
              </div>
            </div>

            <div className="max-w-sm border-l-2 border-primary pl-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-text">
                Workspace status
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Your current KYYP workspace and access context are shown
                below. Profile, account, and workspace-session management
                are available from the three-dot menu above.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title="Profile completeness"
          description="A quick view of the account information currently available to KYYP."
          icon={CircleUserRound}
        >
          <div className="space-y-5">
            <ProgressBar
              value={profileCompletion}
              label="Profile completion"
            />

            <ul className="space-y-3">
              {profileItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-3"
                >
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center ${
                      item.complete
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-secondary text-muted"
                    }`}
                    aria-hidden="true"
                  >
                    {item.complete ? (
                      <Check className="size-3.5" />
                    ) : (
                      <span className="size-1.5 bg-muted" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        item.complete
                          ? "text-text"
                          : "text-muted"
                      }`}
                    >
                      {item.label}
                    </p>

                    {!item.complete && item.action === "Profile" ? (
                      <p className="mt-1 text-[11px] leading-5 text-muted">
                        Available from Profile in the three-dot menu.
                      </p>
                    ) : null}

                    {!item.complete &&
                    item.action === "Verification" ? (
                      <p className="mt-1 text-[11px] leading-5 text-muted">
                        Check your inbox for the confirmation link.
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            {nextIncomplete ? (
              <div className="border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-bold text-amber-800">
                  Recommended next step
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Complete: {nextIncomplete.label}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="size-4" />
                Your profile setup is complete.
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Security at a glance"
          description="A limited account-security summary without exposing unnecessary security details."
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
              <span className="text-xs text-muted">
                Email verification
              </span>

              <StatusBadge
                tone={emailVerified ? "success" : "warning"}
              >
                {emailVerified ? "Verified" : "Unverified"}
              </StatusBadge>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
              <span className="text-xs text-muted">
                Pending email change
              </span>

              <span
                className={`max-w-[65%] truncate text-right text-xs font-semibold ${
                  pendingEmail
                    ? "text-amber-700"
                    : "text-text"
                }`}
              >
                {pendingEmail ? `Pending: ${pendingEmail}` : "None"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="text-xs text-muted">
                Last sign-in
              </span>

              <span className="text-right text-xs font-semibold text-text">
                {formatDateTime(user.last_sign_in_at)}
              </span>
            </div>
          </div>

          <div className="mt-5 border border-border bg-background px-4 py-3">
            <p className="text-xs font-semibold text-text">
              Account security
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted">
              Password and account-security controls are available from
              Account in the three-dot menu.
            </p>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-muted">
            Signing out other devices is available from Account.
          </p>
        </SectionCard>
      </div>

      <SectionCard
        title="Workspace snapshot"
        description="Your current organization context and workspace access."
        icon={UsersRound}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Workspace
            </p>

            <p className="mt-2 truncate text-base font-bold text-text">
              {organization.name}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge tone="primary">
                {getRoleLabel(role)}
              </StatusBadge>

              {organization.owner_id === user.id ? (
                <StatusBadge tone="success">Owner</StatusBadge>
              ) : null}
            </div>
          </div>

          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Organization ID
            </p>

            <CopyOrganizationId organizationId={organization.id} />

            <p className="mt-3 text-[11px] leading-5 text-muted">
              You belong to {workspaceCount}{" "}
              {workspaceCount === 1 ? "workspace" : "workspaces"}.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-text">
              Workspace session
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted">
              Workspace switching is available from the Session option
              in the three-dot menu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("roles")}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-border bg-foreground px-4 text-xs font-bold text-text transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View roles and permissions
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Data in this browser"
        description="Current route and vehicle data available to this dashboard."
        icon={Database}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/routes"
            className="group border border-border bg-background p-5 transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-10 items-center justify-center bg-primary-light text-primary">
                <Route className="size-5" />
              </div>

              <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>

            <p className="mt-5 text-2xl font-bold tracking-[-0.03em] text-text">
              {routesCount}
            </p>

            <p className="mt-1 text-xs font-semibold text-text">
              Routes
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted">
              View and manage route records.
            </p>
          </Link>

          <Link
            href="/dashboard/vehicles"
            className="group border border-border bg-background p-5 transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-10 items-center justify-center bg-primary-light text-primary">
                <Truck className="size-5" />
              </div>

              <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>

            <p className="mt-5 text-2xl font-bold tracking-[-0.03em] text-text">
              {vehiclesCount}
            </p>

            <p className="mt-1 text-xs font-semibold text-text">
              Vehicles
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted">
              View and manage vehicle records.
            </p>
          </Link>
        </div>

        {routesCount === 0 && vehiclesCount === 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <EmptyDataCard
              icon={Route}
              title="No routes yet"
              description="Create your first route to start building operational data."
              href="/dashboard/routes"
              action="Add first route"
            />

            <EmptyDataCard
              icon={Truck}
              title="No vehicles yet"
              description="Add your first vehicle to begin building your fleet records."
              href="/dashboard/vehicles"
              action="Add first vehicle"
            />
          </div>
        ) : null}

        <p className="mt-4 border-t border-border pt-4 text-[11px] leading-5 text-muted">
          This data is stored in this browser only. It will not appear
          on other devices.
        </p>
      </SectionCard>

      <SectionCard
        title="Preferences summary"
        description="Your current dashboard preferences."
        icon={Monitor}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 border border-border bg-background px-4 py-4">
            <div>
              <p className="text-xs font-semibold text-text">
                Compact tables
              </p>

              <p className="mt-1 text-[11px] text-muted">
                Use tighter table spacing.
              </p>
            </div>

            <StatusBadge
              tone={preferences.compactTables ? "success" : "neutral"}
            >
              {preferences.compactTables ? "On" : "Off"}
            </StatusBadge>
          </div>

          <div className="flex items-center justify-between gap-4 border border-border bg-background px-4 py-4">
            <div>
              <p className="text-xs font-semibold text-text">
                Confirm before deleting
              </p>

              <p className="mt-1 text-[11px] text-muted">
                Ask for confirmation before delete actions.
              </p>
            </div>

            <StatusBadge
              tone={
                preferences.confirmBeforeDelete
                  ? "success"
                  : "neutral"
              }
            >
              {preferences.confirmBeforeDelete ? "On" : "Off"}
            </StatusBadge>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("interface")}
          className="mt-4 inline-flex min-h-10 items-center gap-2 border border-border bg-background px-4 text-xs font-bold text-text transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Change preferences
          <ArrowRight className="size-3.5" />
        </button>
      </SectionCard>

      <SectionCard
        title="Account timeline"
        description="Important account events available from your authenticated user record."
        icon={Clock3}
      >
        <ul className="space-y-4">
          <TimelineItem
            icon={Clock3}
            title="Last sign-in"
            date={user.last_sign_in_at}
          />

          <TimelineItem
            icon={UserRound}
            title="Profile last updated"
            date={user.updated_at}
          />

          <TimelineItem
            icon={ShieldCheck}
            title="Email confirmed"
            date={user.email_confirmed_at}
          />

          <TimelineItem
            icon={UserCheck}
            title="Account created"
            date={user.created_at}
          />
        </ul>

        <p className="mt-4 text-[11px] text-muted">
          Timestamps are shown in your local time.
        </p>
      </SectionCard>

      <SectionCard
        title="Quick actions"
        description="Move directly to the areas you can manage from this Settings page."
        icon={LayoutDashboard}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => onNavigate("general")}
            className="group flex min-h-[100px] flex-col justify-between border border-border bg-background p-4 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Settings2 className="size-5 text-primary" />

            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-text">
                Workspace details
              </span>

              <ArrowRight className="size-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("roles")}
            className="group flex min-h-[100px] flex-col justify-between border border-border bg-background p-4 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <KeyRound className="size-5 text-primary" />

            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-text">
                Roles & permissions
              </span>

              <ArrowRight className="size-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("interface")}
            className="group flex min-h-[100px] flex-col justify-between border border-border bg-background p-4 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Monitor className="size-5 text-primary" />

            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-text">
                Interface preferences
              </span>

              <ArrowRight className="size-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
          </button>

          <Link
            href="/dashboard/routes"
            className="group flex min-h-[100px] flex-col justify-between border border-border bg-background p-4 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Route className="size-5 text-primary" />

            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-text">
                Manage routes
              </span>

              <ArrowRight className="size-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
          </Link>

          <Link
            href="/dashboard/vehicles"
            className="group flex min-h-[100px] flex-col justify-between border border-border bg-background p-4 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Truck className="size-5 text-primary" />

            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-text">
                Manage vehicles
              </span>

              <ArrowRight className="size-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
          </Link>
        </div>
      </SectionCard>
    </div>
  )
}

function GeneralTab({
  user,
  organization,
  role,
  workspaceCount,
}: {
  user: User
  organization: Organization
  role: Role
  workspaceCount: number
}) {
  const fullName = getStringMetadata(user, "full_name")
  const jobTitle = getStringMetadata(user, "job_title")

  return (
    <div className="space-y-5">
      <SectionCard
        title="Workspace information"
        description="The organization context currently associated with this session."
        icon={Settings2}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Workspace name
            </p>

            <p className="mt-2 text-sm font-bold text-text">
              {organization.name}
            </p>
          </div>

          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Organization ID
            </p>

            <p className="mt-2 break-all font-mono text-xs text-text">
              {organization.id}
            </p>
          </div>

          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Your role
            </p>

            <div className="mt-2">
              <StatusBadge tone="primary">
                {getRoleLabel(role)}
              </StatusBadge>
            </div>
          </div>

          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Workspace access
            </p>

            <p className="mt-2 text-sm font-bold text-text">
              {workspaceCount}{" "}
              {workspaceCount === 1 ? "workspace" : "workspaces"}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Your profile context"
        description="Information currently available to your KYYP workspace experience."
        icon={CircleUserRound}
      >
        <div className="divide-y divide-border border border-border bg-background">
          <InfoRow
            label="Full name"
            value={fullName || "Not added yet"}
          />

          <InfoRow
            label="Job title"
            value={jobTitle || "Not added yet"}
          />

          <InfoRow
            label="Email"
            value={user.email || "—"}
          />

          <InfoRow
            label="Email status"
            value={user.email_confirmed_at ? "Verified" : "Unverified"}
          />
        </div>

        <div className="mt-4 border border-border bg-background px-4 py-3">
          <p className="text-xs font-semibold text-text">
            Profile management
          </p>

          <p className="mt-1 text-[11px] leading-5 text-muted">
            Your profile information is managed from Profile in the
            three-dot menu.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Workspace ownership"
        description="Your current organization ownership context."
        icon={ShieldCheck}
      >
        <div className="flex flex-col gap-4 border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-text">
              {organization.owner_id === user.id
                ? "You are the workspace owner."
                : "You are not the workspace owner."}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Workspace ownership is determined by the organization
              record.
            </p>
          </div>

          <StatusBadge
            tone={
              organization.owner_id === user.id
                ? "success"
                : "neutral"
            }
          >
            {organization.owner_id === user.id
              ? "Owner"
              : "Assigned role"}
          </StatusBadge>
        </div>
      </SectionCard>
    </div>
  )
}

function RolesTab({
  role,
}: {
  role: Role
}) {
  const roles: Role[] = [
    "owner",
    "admin",
    "manager",
    "staff",
  ]

  return (
    <div className="space-y-5">
      <SectionCard
        title="Your current role"
        description="The role assigned to your account in the active workspace."
        icon={KeyRound}
      >
        <div className="flex flex-col gap-4 border border-primary/20 bg-primary-light/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
              Current access level
            </p>

            <p className="mt-2 text-xl font-bold text-text">
              {getRoleLabel(role)}
            </p>
          </div>

          <StatusBadge tone="primary">
            Active role
          </StatusBadge>
        </div>
      </SectionCard>

      <SectionCard
        title="Role levels"
        description="KYYP currently recognizes these organization role levels."
        icon={UsersRound}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((item) => {
            const current = item === role

            return (
              <div
                key={item}
                className={`border p-4 ${
                  current
                    ? "border-primary/30 bg-primary-light/30"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-text">
                    {getRoleLabel(item)}
                  </p>

                  {current ? (
                    <StatusBadge tone="primary">
                      Current
                    </StatusBadge>
                  ) : null}
                </div>

                <p className="mt-2 text-[11px] leading-5 text-muted">
                  Organization role level assigned to an account.
                </p>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Access management"
        description="Role assignments and permissions are intentionally kept separate from the main Settings overview."
        icon={ShieldCheck}
      >
        <div className="border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold text-text">
                Permission controls
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                This page shows your current role level without adding
                member-management functionality. No Members page or
                membership-management interface is included in KYYP
                Settings.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function InterfaceTab({
  preferences,
  onChange,
  onSave,
  saving,
  saved,
}: {
  preferences: Preferences
  onChange: (
    key: keyof Preferences,
    value: boolean,
  ) => void
  onSave: () => void
  saving: boolean
  saved: boolean
}) {
  return (
    <div className="space-y-5">
      <SectionCard
        title="Interface preferences"
        description="Control small dashboard behaviors that affect how you work with KYYP."
        icon={Monitor}
      >
        <div className="space-y-3">
          <Toggle
            checked={preferences.compactTables}
            onChange={() =>
              onChange(
                "compactTables",
                !preferences.compactTables,
              )
            }
            label="Compact tables"
            description="Use tighter table spacing where supported."
          />

          <Toggle
            checked={preferences.confirmBeforeDelete}
            onChange={() =>
              onChange(
                "confirmBeforeDelete",
                !preferences.confirmBeforeDelete,
              )
            }
            label="Confirm before deleting"
            description="Ask for confirmation before delete actions."
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {saved ? (
              <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="size-4" />
                Preferences saved.
              </p>
            ) : (
              <p className="text-xs text-muted">
                Changes are saved to your authenticated KYYP account.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-4 text-xs font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Save className="size-4" />
            {saving ? "Saving..." : "Save preferences"}
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Appearance"
        description="Appearance controls are intentionally unchanged for now."
        icon={Monitor}
      >
        <div className="flex items-start gap-3 border border-border bg-background p-5">
          <Monitor className="mt-0.5 size-5 shrink-0 text-muted" />

          <div>
            <p className="text-sm font-semibold text-text">
              Current appearance settings remain unchanged.
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Dark and light mode configuration is not being changed as
              part of this Settings redesign.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Interface principles"
        description="The KYYP interface is designed around a focused operational workspace."
        icon={LayoutDashboard}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <InterfacePrinciple
            title="Focused"
            description="Keep important operational information easy to find."
          />

          <InterfacePrinciple
            title="Responsive"
            description="Settings remain usable across desktop and smaller screens."
          />

          <InterfacePrinciple
            title="Consistent"
            description="Use the same visual language across the KYYP dashboard."
          />
        </div>
      </SectionCard>
    </div>
  )
}

function InterfacePrinciple({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border border-border bg-background p-4">
      <div className="mb-3 flex size-8 items-center justify-center bg-secondary text-primary">
        <Check className="size-4" />
      </div>

      <p className="text-xs font-bold text-text">{title}</p>

      <p className="mt-1 text-[11px] leading-5 text-muted">
        {description}
      </p>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-xs text-muted">{label}</span>

      <span className="break-all text-xs font-semibold text-text sm:text-right">
        {value}
      </span>
    </div>
  )
}

function CopyOrganizationId({
  organizationId,
}: {
  organizationId: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(organizationId)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = organizationId
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-2 flex min-w-0 items-center gap-2">
      <span
        className="min-w-0 flex-1 truncate font-mono text-xs text-text"
        title={organizationId}
      >
        {organizationId}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy organization ID"
        className="flex size-9 shrink-0 items-center justify-center border border-border bg-foreground text-muted transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {copied ? (
          <Check className="size-4 text-emerald-600" />
        ) : (
          <Clipboard className="size-4" />
        )}
      </button>

      <span className="sr-only" aria-live="polite">
        {copied ? "Organization ID copied." : ""}
      </span>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <div className="h-40 animate-pulse bg-secondary motion-reduce:animate-none" />

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-72 animate-pulse bg-secondary motion-reduce:animate-none" />
        <div className="h-72 animate-pulse bg-secondary motion-reduce:animate-none" />
      </div>

      <div className="h-56 animate-pulse bg-secondary motion-reduce:animate-none" />
    </div>
  )
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] =
    useState<Organization | null>(null)
  const [role, setRole] = useState<Role>("staff")
  const [workspaceCount, setWorkspaceCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences)
  const [savingPreferences, setSavingPreferences] =
    useState(false)
  const [preferencesSaved, setPreferencesSaved] = useState(false)

  const routes = useDashboardRoutes()
  const vehicles = useDashboardVehicles()

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let mounted = true

    async function loadSettingsData() {
      setLoading(true)

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!mounted) {
        return
      }

      if (!currentUser) {
        window.location.href = "/login"
        return
      }

      const { data: memberships } = await supabase
        .from("organization_members")
        .select("organization_id, role")
        .eq("user_id", currentUser.id)

      if (!mounted) {
        return
      }

      const typedMemberships =
        (memberships as OrganizationMember[] | null) ?? []

      if (typedMemberships.length === 0) {
        window.location.href = "/workspace/create-workspace"
        return
      }

      const organizationIds = typedMemberships.map(
        (membership) => membership.organization_id,
      )

      const storedOrganizationId =
        typeof window !== "undefined"
          ? window.localStorage.getItem(
              "kyyp-active-organization",
            )
          : null

      const selectedMembership =
        typedMemberships.find(
          (membership) =>
            membership.organization_id === storedOrganizationId,
        ) ?? typedMemberships[0]

      const { data: organizationData } = await supabase
        .from("organizations")
        .select("id, name, owner_id")
        .eq("id", selectedMembership.organization_id)
        .maybeSingle()

      if (!mounted) {
        return
      }

      if (!organizationData) {
        window.location.href = "/workspace/create-workspace"
        return
      }

      const parsedOrganization =
        organizationData as Organization

      if (storedOrganizationId !== parsedOrganization.id) {
        window.localStorage.setItem(
          "kyyp-active-organization",
          parsedOrganization.id,
        )
      }

      setUser(currentUser)
      setOrganization(parsedOrganization)
      setRole(selectedMembership.role)
      setWorkspaceCount(organizationIds.length)
      setPreferences(getPreferences(currentUser))
      setLoading(false)
    }

    loadSettingsData()

    return () => {
      mounted = false
    }
  }, [supabase])

  function handlePreferenceChange(
    key: keyof Preferences,
    value: boolean,
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }))

    setPreferencesSaved(false)
  }

  async function handleSavePreferences() {
    if (!user) {
      return
    }

    setSavingPreferences(true)
    setPreferencesSaved(false)

    const currentMetadata =
      user.user_metadata && typeof user.user_metadata === "object"
        ? user.user_metadata
        : {}

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...currentMetadata,
        preferences,
      },
    })

    if (!error && data.user) {
      setUser(data.user)
      setPreferences(getPreferences(data.user))
      setPreferencesSaved(true)
    }

    setSavingPreferences(false)
  }

  function navigateToTab(tab: Tab) {
    setActiveTab(tab)

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  if (loading || !user || !organization) {
    return (
      <div className="min-h-screen bg-background lg:ml-[260px]">
        <LoadingState />
      </div>
    )
  }

  const routesCount = routes.length
  const vehiclesCount = vehicles.length

  return (
    <main className="min-h-screen bg-background">
      <Sidebar />

      <div className="lg:ml-[260px]">
        <SettingsHeader
          user={user}
          organization={organization}
          role={role}
          workspaceCount={workspaceCount}
        />

        <SettingsTabs
          activeTab={activeTab}
          onChange={navigateToTab}
        />

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {activeTab === "overview" ? (
            <OverviewTab
              user={user}
              organization={organization}
              role={role}
              workspaceCount={workspaceCount}
              preferences={preferences}
              routesCount={routesCount}
              vehiclesCount={vehiclesCount}
              onNavigate={navigateToTab}
            />
          ) : null}

          {activeTab === "general" ? (
            <GeneralTab
              user={user}
              organization={organization}
              role={role}
              workspaceCount={workspaceCount}
            />
          ) : null}

          {activeTab === "roles" ? (
            <RolesTab role={role} />
          ) : null}

          {activeTab === "interface" ? (
            <InterfaceTab
              preferences={preferences}
              onChange={handlePreferenceChange}
              onSave={handleSavePreferences}
              saving={savingPreferences}
              saved={preferencesSaved}
            />
          ) : null}

          <div className="mt-8 flex flex-col gap-1 border-t border-border pt-4 pb-2 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>KYYP Settings</span>

            <span>
              Last updated {formatLastUpdated(user.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}