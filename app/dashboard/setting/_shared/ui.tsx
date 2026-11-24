"use client"

import Link from "next/link"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react"
import type { ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { getAvatarUrl } from "../profile/profile-utils"

function getWorkspaceInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) {
    return "K"
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

type CoverBannerProps = {
  className?: string
}

export function CoverBanner({
  className = "",
}: CoverBannerProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-32 overflow-hidden bg-linear-to-br from-primary-dark via-primary to-primary-light sm:h-40 ${className}`}
    >
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute right-12 top-8 h-24 w-24 rotate-12 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-sm" />
      <div className="absolute right-32 top-14 h-20 w-20 -rotate-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm" />
    </div>
  )
}

type AvatarCardProps = {
  user: User
  workspaceName: string
  editable?: boolean
  size?: "md" | "lg"
  className?: string
}

export function AvatarCard({
  user,
  workspaceName,
  editable = false,
  size = "md",
  className = "",
}: AvatarCardProps) {
  const avatarUrl = getAvatarUrl(user)
  const initials = getWorkspaceInitials(workspaceName)

  const sizeClass =
    size === "lg"
      ? "h-28 w-28 text-2xl"
      : "h-12 w-12 text-sm"

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-semibold text-muted ${sizeClass} ${className}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${workspaceName} profile`}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}

      {editable ? (
        <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-center text-[10px] font-medium text-white">
          Change
        </span>
      ) : null}
    </div>
  )
}

type SectionLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

export function SectionLayout({
  title,
  description,
  children,
}: SectionLayoutProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-sm font-semibold text-text">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-muted">
          {description}
        </p>
      </div>

      <div>{children}</div>
    </section>
  )
}

type SettingsCardProps = {
  children: ReactNode
  className?: string
}

export function SettingsCard({
  children,
  className = "",
}: SettingsCardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-foreground transition duration-200 hover:-translate-y-px hover:border-primary/30 motion-reduce:transform-none ${className}`}
    >
      {children}
    </div>
  )
}

type PrimaryButtonProps = {
  children: ReactNode
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function PrimaryButton({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

type SecondaryButtonProps = {
  children: ReactNode
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function SecondaryButton({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-foreground px-4 text-sm font-medium text-text transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

type SegmentedOptionProps = {
  selected: boolean
  label: string
  onClick: () => void
}

export function SegmentedOption({
  selected,
  label,
  onClick,
}: SegmentedOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-9 flex-1 rounded-md px-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        selected
          ? "bg-primary text-white"
          : "text-muted hover:bg-secondary hover:text-text"
      }`}
    >
      {label}
    </button>
  )
}

type ErrorAlertProps = {
  children: ReactNode
}

export function ErrorAlert({ children }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
    >
      {children}
    </div>
  )
}

type LoadingCardProps = {
  className?: string
}

export function LoadingCard({
  className = "",
}: LoadingCardProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-border bg-foreground p-5 ${className}`}
    >
      <div className="h-4 w-32 rounded bg-secondary" />
      <div className="mt-3 h-3 w-56 rounded bg-secondary" />
      <div className="mt-6 h-10 w-full rounded-lg bg-secondary" />
    </div>
  )
}

type ArrowLinkProps = {
  href: string
  children: ReactNode
}

export function ArrowLink({
  href,
  children,
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

export function CheckIcon() {
  return <Check className="h-4 w-4" />
}

export function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />
}

export function DropdownChevron() {
  return <ChevronDown className="h-4 w-4" />
}