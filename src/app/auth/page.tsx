"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/ui/button"
import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

export default function AuthPage() {
  const { loginAsGuest } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGuest = async () => {
    setLoading(true)
    setError(null)
    try {
      await loginAsGuest()
      router.push("/tasks")
    } catch (err: any) {
      setError(err?.message || "Failed to connect to backend or database server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
          <span className="text-primary-foreground text-base font-bold">▲</span>
        </div>
        <span className="text-lg font-semibold text-foreground tracking-tight">Pyramid</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm border border-border rounded-2xl p-8 shadow-sm bg-card">
        <div className="text-center mb-7">
          <h1 className="text-xl font-semibold text-foreground mb-1.5">Let&apos;s get back on track</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to login to your account.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleGuest}
            disabled={loading}
            className="w-full h-11 rounded-full text-sm font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting to server...
              </span>
            ) : (
              "Continue as Guest"
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 rounded-full border border-border text-sm font-medium"
            onClick={() => alert("Google login coming soon")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login with Google
          </Button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-2 hover:text-foreground">Terms of Service</a>
        {" "}and{" "}
        <a href="#" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</a>
      </p>
    </div>
  )
}
