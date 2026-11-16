import { ArrowRight, Plus, Route as RouteIcon } from "lucide-react"

type RouteHeaderProps = {
  onAddRoute: () => void
}

export default function RouteHeader({ onAddRoute }: RouteHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-primary">
          <RouteIcon
            className="h-4 w-4 shrink-0"
            aria-hidden="true"
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            Transportation management
          </span>

          <ArrowRight
            className="h-3.5 w-3.5 text-muted"
            aria-hidden="true"
          />

          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Routes
          </span>
        </div>

        <div className="mt-3">
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Routes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Create, organize, and monitor the transportation routes used across
            your operations.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddRoute}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px"
      >
        <Plus
          className="h-4 w-4"
          aria-hidden="true"
        />
        Add route
      </button>
    </header>
  )
}