export default function DashboardBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(1,78,141,0.08),transparent_28%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="absolute -right-32 top-24 h-[420px] w-[420px] rounded-full border border-primary/10" />

      <div className="absolute -right-16 top-40 h-[300px] w-[300px] rounded-full border border-primary/10" />

      <div className="absolute right-20 top-56 h-2 w-2 bg-primary/20" />

      <div className="absolute left-[22%] top-[38%] h-px w-[28%] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      <div className="absolute bottom-[18%] right-[16%] h-px w-[20%] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </div>
  )
}