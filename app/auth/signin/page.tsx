"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CirclePile,
  Mail,
  ShieldCheck,
} from "lucide-react"
import { createClient } from "@/app/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setMessage("Please enter your email address.")
      return
    }

    setLoading(true)
    setMessage("")

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setShowCode(true)
    setMessage("Check your email for your verification code.")
    setLoading(false)
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    const trimmedEmail = email.trim()
    const trimmedCode = code.trim()

    if (!trimmedEmail || !trimmedCode) {
      setMessage("Please enter the verification code.")
      return
    }

    setLoading(true)
    setMessage("")

    const supabase = createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedCode,
      type: "email",
    })

    if (error || !data.user) {
      setMessage(error?.message || "Verification failed.")
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        email: data.user.email ?? null,
      })

    if (profileError) {
      setMessage(profileError.message)
      setLoading(false)
      return
    }

    router.replace("/auth/password")
  }

  return (
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
              {!showCode ? (
                <>
                  <p className="text-sm font-semibold tracking-wide text-primary-dark">
                    Get started
                  </p>

                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                    Create your account
                  </h1>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                    Start with your email and we&apos;ll verify your account
                    before you continue.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold tracking-wide text-primary-dark">
                    Almost there
                  </p>

                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                    Verify your email
                  </h1>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                    We sent a verification code to{" "}
                    <span className="font-medium text-text">{email}</span>.
                  </p>
                </>
              )}
            </div>

            {!showCode ? (
              <form onSubmit={sendCode} className="space-y-5">
                <fieldset className="relative border border-border bg-foreground transition-all duration-200 focus-within:border-primary-dark focus-within:shadow-sm">
                  <legend className="ml-3 px-2 text-xs font-medium text-muted">
                    Email address
                  </legend>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

                    <input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="h-13 w-full bg-transparent px-4 pl-11 text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 sm:h-14"
                    />
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-13 w-full items-center justify-center gap-2 bg-primary-dark text-sm font-semibold text-foreground shadow-lg shadow-primary-dark/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-14"
                >
                  {loading ? "Sending code..." : "Continue"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="space-y-5">
                <fieldset className="relative border border-border bg-foreground transition-all duration-200 focus-within:border-primary-dark focus-within:shadow-sm">
                  <legend className="ml-3 px-2 text-xs font-medium text-muted">
                    Verification code
                  </legend>

                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter your code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    disabled={loading}
                    className="h-13 w-full bg-transparent px-4 text-center text-lg font-medium tracking-[0.3em] text-text outline-none placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 sm:h-14"
                  />
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-13 w-full items-center justify-center gap-2 bg-primary-dark text-sm font-semibold text-foreground shadow-lg shadow-primary-dark/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-14"
                >
                  {loading ? "Verifying..." : "Verify and continue"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setShowCode(false)
                    setCode("")
                    setMessage("")
                  }}
                  className="w-full pt-1 text-center text-sm font-medium text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Use a different email
                </button>
              </form>
            )}

            {message && (
              <div className="mt-6 border border-primary/20 bg-primary-light px-4 py-3 text-center text-sm leading-5 text-primary-dark">
                {message}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted sm:mt-7">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Secure account verification and protected access.</span>
          </div>
        </div>
      </div>
    </main>
  )
}

