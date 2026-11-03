import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Route,
  Truck,
  Wrench,
} from "lucide-react"

const activities = [
  {
    id: 1,
    title: "New route added",
    description: "Lagos Mainland – Island",
    time: "Today, 10:45 AM",
    icon: Route,
    color: "bg-primary-light text-primary-dark",
  },
  {
    id: 2,
    title: "Vehicle marked available",
    description: "Toyota Hiace · LND-204-KJ",
    time: "Today, 09:30 AM",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 3,
    title: "Vehicle sent for maintenance",
    description: "Mercedes-Benz Sprinter · ABC-123-DE",
    time: "Yesterday, 03:15 PM",
    icon: Wrench,
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: 4,
    title: "Vehicle added to fleet",
    description: "Ford Transit · KJA-451-XY",
    time: "Yesterday, 11:20 AM",
    icon: Truck,
    color: "bg-primary-light text-primary-dark",
  },
]

export default function RecentActivities() {
  return (
    <section className="border border-border bg-foreground">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Activity log
          </p>

          <h2 className="mt-2 text-lg font-bold tracking-tight text-text">
            Recent activity
          </h2>

          <p className="mt-1 text-xs text-muted">
            A record of recent operational updates.
          </p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center bg-secondary text-muted">
          <Clock3 className="h-4 w-4" />
        </span>
      </div>

      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const Icon = activity.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 px-5 py-4 sm:px-6"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center ${activity.color}`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">
                  {activity.title}
                </p>

                <p className="mt-1 truncate text-xs text-muted">
                  {activity.description}
                </p>

                <p className="mt-2 text-[10px] font-medium text-muted">
                  {activity.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-border px-5 py-3 sm:px-6">
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Recent operational updates
        </p>
      </div>
    </section>
  )
}