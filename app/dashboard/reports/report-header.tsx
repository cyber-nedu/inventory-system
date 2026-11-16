import {
  Download,
  FileText,
  Printer,
  BarChart3,
} from "lucide-react"

type ReportHeaderProps = {
  onExport: () => void
  onPrint: () => void
}

export default function ReportHeader({
  onExport,
  onPrint,
}: ReportHeaderProps) {
  return (
    <>
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Transportation management
            </p>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Reports
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Review route activity, fleet availability, capacity, and
            operational utilisation from your current KYYP data.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-border bg-foreground px-5 text-sm font-semibold text-text transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </button>

          <button
            type="button"
            onClick={onExport}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </header>

      <div className="hidden print:block">
        <div className="border-b border-black pb-4">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-bold tracking-[0.15em] text-black">
                KYYP
              </p>

              <h2 className="mt-2 text-2xl font-bold text-black">
                Operational Reports
              </h2>
            </div>

            <p className="text-sm text-black">
              {new Intl.DateTimeFormat("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}