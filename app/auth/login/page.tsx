"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CirclePile,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react"
import { createClient } from "@/app/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const routeUser = async (userId: string) => {
    const supabase = createClient()

    const { data: ownedWorkspaces, error: ownerError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("owner_id", userId)

    if (ownerError) {
      setMessage(ownerError.message)
      setLoading(false)
      return
    }

    const { data: memberships, error: membershipError } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId)

    if (membershipError) {
      setMessage(membershipError.message)
      setLoading(false)
      return
    }

    const workspaceIds = [
      ...(ownedWorkspaces ?? []).map((workspace) => workspace.id),
      ...(memberships ?? []).map((membership) => membership.workspace_id),
    ]

    const uniqueWorkspaceIds = [...new Set(workspaceIds)]

    if (uniqueWorkspaceIds.length === 0) {
      router.replace("/workspace/create")
      return
    }

    if (uniqueWorkspaceIds.length === 1) {
      router.replace(`/workspace/${uniqueWorkspaceIds[0]}/dashboard`)
      return
    }

    router.replace("/workspace")
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setMessage("Please enter your email and password.")
      return
    }

    setLoading(true)
    setMessage("")

    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (error || !data.user) {
      setMessage(error?.message || "Unable to log in.")
      setLoading(false)
      return
    }

    await routeUser(data.user.id)
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
              <p className="text-sm font-semibold tracking-wide text-primary-dark">
                Welcome back
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                Login to your account
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                Access your KYYP workspace and pick up right where you left off.
              </p>
            </div>

            <form onSubmit={login} className="space-y-5">
              <fieldset className="relative border border-border bg-foreground transition-all duration-200 focus-within:border-primary-dark focus-within:shadow-sm">
                <legend className="ml-3 px-2 text-xs font-medium text-muted">
                  Email address
                </legend>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

                  <input
                    id="login-email"
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

              <fieldset className="relative border border-border bg-foreground transition-all duration-200 focus-within:border-primary-dark focus-within:shadow-sm">
                <legend className="ml-3 px-2 text-xs font-medium text-muted">
                  Password
                </legend>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => router.push("/auth/password")}
                  className="text-sm font-medium text-muted transition-colors hover:text-primary-dark"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-13 w-full items-center justify-center gap-2 bg-primary-dark text-sm font-semibold text-foreground shadow-lg shadow-primary-dark/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-14"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                )}
              </button>

              {message && (
                <div className="border border-primary/20 bg-primary-light px-4 py-3 text-center text-sm leading-5 text-primary-dark">
                  {message}
                </div>
              )}
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted sm:mt-7">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Secure access to your workspace and account.</span>
          </div>
        </div>
      </div>
    </main>
  )
}
