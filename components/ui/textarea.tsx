import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full resize-y rounded-xl border border-border bg-foreground px-3 py-2.5 text-sm text-text transition-all outline-none placeholder:text-muted focus:border-primary/30 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }