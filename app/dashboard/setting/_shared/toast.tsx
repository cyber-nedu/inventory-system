"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { Check, X } from "lucide-react"

type ToastContextValue = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(
  null,
)

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({
  children,
}: ToastProviderProps) {
  const [message, setMessage] = useState<string | null>(null)

  const showToast = useCallback((nextMessage: string) => {
    setMessage(nextMessage)
  }, [])

  useEffect(() => {
    if (!message) {
      return
    }

    const timer = window.setTimeout(() => {
      setMessage(null)
    }, 4000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [message])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {message ? (
        <div
          aria-live="polite"
          className="kyyp-toast-in fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-border bg-foreground px-4 py-3 text-sm text-text shadow-lg"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <Check className="h-4 w-4" />
          </span>

          <span className="flex-1">{message}</span>

          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setMessage(null)}
            className="rounded-md p-1 text-muted transition hover:bg-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider.",
    )
  }

  return context
}