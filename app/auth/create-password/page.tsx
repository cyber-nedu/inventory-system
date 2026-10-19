"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Check,
  CirclePile,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"
import { createClient } from "@/app/lib/supabase/client"

export default function PasswordPage() {
  const router = useRouter()

  const [sessionEmail, setSessionEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        setMessage(error.message)
        setCheckingSession(false)
        return
      }

      if (!session?.user) {
        router.replace("/auth/login")
        return
      }

      setSessionEmail(session.user.email ?? "")
      setCheckingSession(false)
    }

    checkSession()
  }, [router])

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  const passwordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSymbol

  const createPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    if (!password || !confirmPassword) {
      setMessage("Please enter and confirm your password.")
      return
    }

    if (!passwordValid) {
      setMessage("Please meet all password requirements before continuing.")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    setLoading(true)
    setMessage("")

    const supabase = createClient()

    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error || !data.user) {
      setMessage(error?.message || "Unable to create your password.")
      setLoading(false)
      return
    }

    setLoading(false)
    setShowSuccessModal(true)
  }

  const logout = async () => {
    const supabase = createClient()

    await supabase.auth.signOut()

    router.replace("/auth/login")
  }

  const continueToWorkspace = () => {
    router.replace("/workspace/create-workspace")
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary px-5">
        <div className="flex w-full max-w-xs flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-dark text-foreground shadow-lg shadow-primary-dark/10">
            <CirclePile className="h-6 w-6" />
          </div>

          <div className="mt-4 text-3xl font-bold tracking-tight text-text">
            KYYP<span className="text-primary-dark">.</span>
          </div>

          <p className="mt-5 text-sm font-medium text-muted">
            Checking your session...
          </p>
        </div>
      </main>
    )
  }

  const requirements = [
    {
      label: "At least 8 characters",
      valid: hasMinLength,
    },
    {
      label: "One uppercase letter",
      valid: hasUppercase,
    },
    {
      label: "One lowercase letter",
      valid: hasLowercase,
    },
    {
      label: "One number",
      valid: hasNumber,
    },
    {
      label: "One symbol",
      valid: hasSymbol,
    },
  ]

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-[1440px]">
          <div className="mx-auto w-full max-w-[500px]">
            <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-dark text-foreground shadow-lg shadow-primary-dark/10 sm:h-13 sm:w-13">
                <CirclePile className="h-6 w-6 sm:h-6.5 sm:w-6.5" />
              </div>

              <div className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
                KYYP<span className="text-primary-dark">.</span>
              </div>
            </div>

            <div className="border border-border/70 bg-foreground/75 p-5 shadow-2xl shadow-text/5 backdrop-blur-xl sm:p-8 md:p-9">
              <div className="mb-8 text-center">
                <p className="text-sm font-semibold tracking-wide text-primary-dark">
                  Account setup
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                  Create your password
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                  Your email has been verified. Create a secure password to
                  continue to your KYYP workspace.
                </p>
              </div>

              <form onSubmit={createPassword} className="space-y-5">
                {sessionEmail && (
                  <div className="border border-border bg-secondary px-4 py-3 text-sm text-muted">
                    <span className="font-medium text-text">
                      {sessionEmail}
                    </span>
                  </div>
                )}

                <fieldset className="relative border border-border bg-foreground transition-all duration-200 focus-within:border-primary-dark focus-within:shadow-sm">
                  <legend className="ml-3 px-2 text-xs font-medium text-muted">
                    Password
                  </legend>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-13 w-full bg-transparent px-12 text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 sm:h-14"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </fieldset>

                <div className="border border-border bg-secondary p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text">
                    Password requirements
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {requirements.map((requirement) => (
                      <div
                        key={requirement.label}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            requirement.valid
                              ? "bg-primary-dark text-foreground"
                              : "border border-border bg-foreground text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>

                        <span
                          className={
                            requirement.valid ? "text-text" : "text-muted"
                          }
                        >
                          {requirement.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <fieldset className="relative border border-border bg-foreground transition-all duration-200 focus-within:border-primary-dark focus-within:shadow-sm">
                  <legend className="ml-3 px-2 text-xs font-medium text-muted">
                    Confirm password
                  </legend>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-13 w-full bg-transparent px-12 text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 sm:h-14"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                      className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </fieldset>

                {confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        password === confirmPassword
                          ? "bg-primary-dark text-foreground"
                          : "border border-border bg-foreground text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>

                    <span
                      className={
                        password === confirmPassword
                          ? "text-text"
                          : "text-muted"
                      }
                    >
                      Passwords match
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !passwordValid ||
                    password !== confirmPassword
                  }
                  className="group flex h-13 w-full items-center justify-center gap-2 bg-primary-dark text-sm font-semibold text-foreground shadow-lg shadow-primary-dark/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-14"
                >
                  {loading ? "Creating password..." : "Create password"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={logout}
                  disabled={loading}
                  className="w-full pt-1 text-center text-sm font-medium text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sign out instead
                </button>
              </form>

              {message && (
                <div className="mt-6 border border-primary/20 bg-primary-light px-4 py-3 text-center text-sm leading-5 text-primary-dark">
                  {message}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted sm:mt-7">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Secure account setup and protected access.</span>
            </div>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-text/40 px-4">
          <div className="w-full max-w-[440px] border border-border bg-foreground p-6 shadow-2xl sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-dark text-foreground">
              <Check className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-text">
              Password created successfully
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Your account is ready. The next step is to create your KYYP
              workspace.
            </p>

            <button
              type="button"
              onClick={continueToWorkspace}
              className="group mt-7 flex h-13 w-full items-center justify-center gap-2 bg-primary-dark text-sm font-semibold text-foreground shadow-lg shadow-primary-dark/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl sm:h-14"
            >
              Create workspace

              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}