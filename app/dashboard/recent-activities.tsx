import {
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
    iconClass: "bg-primary-light text-primary-dark",
  },
  {
    id: 2,
    title: "Vehicle marked available",
    description: "Toyota Hiace · LND-204-KJ",
    time: "Today, 09:30 AM",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 3,
    title: "Vehicle sent for maintenance",
    description: "Mercedes-Benz Sprinter · ABC-123-DE",
    time: "Yesterday, 03:15 PM",
    icon: Wrench,
    iconClass: "bg-amber-50 text-amber-700",
  },
  {
    id: 4,
    title: "Vehicle added to fleet",
    description: "Ford Transit · KJA-451-XY",
    time: "Yesterday, 11:20 AM",
    icon: Truck,
    iconClass: "bg-primary-light text-primary-dark",
  },
]

export default function RecentActivities() {
  return (
    <section className="border border-border bg-foreground shadow-[0_8px_30px_-28px_rgba(15,23,42,0.4)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Activity
          </p>

          <h2 className="mt-1 text-base font-bold tracking-tight text-text sm:text-lg">
            Recent operational activity
          </h2>
        </div>

        <span className="flex h-9 w-9 items-center justify-center bg-secondary text-muted">
          <Clock3 className="h-4 w-4" />
        </span>
      </div>

      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        {activities.map((activity) => {
          const Icon = activity.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 transition-colors hover:bg-background sm:p-5"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center ${activity.iconClass}`}
              >
                <Icon
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-bold text-text">
                  {activity.title}
                </p>

                <p className="mt-1 truncate text-[11px] text-muted">
                  {activity.description}
                </p>

                <p className="mt-2 text-[9px] font-medium uppercase tracking-wide text-muted">
                  {activity.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}