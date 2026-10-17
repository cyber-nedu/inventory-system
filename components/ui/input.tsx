import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-border bg-foreground px-3 text-sm text-text transition-all outline-none placeholder:text-muted focus:border-primary/30 focus:ring-2 focus:ring-primary/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export { Input }