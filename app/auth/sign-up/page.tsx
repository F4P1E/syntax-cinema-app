"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            email_confirmed: true,
          },
        },
      })
      if (error) throw error

      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold font-mono">SYNTAX CINEMA</h1>
          </Link>
        </div>

        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-mono">SIGN UP</CardTitle>
            <CardDescription className="font-mono">Create a new account to start your watchlist</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-mono">
                    EMAIL
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-mono">
                    PASSWORD
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password" className="font-mono">
                    REPEAT PASSWORD
                  </Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="border-2 border-border"
                  />
                </div>
                {error && (
                  <div className="border-2 border-destructive bg-destructive/10 p-3">
                    <p className="text-sm text-destructive font-mono">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full border-2 border-border font-mono" disabled={isLoading}>
                  {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm font-mono">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline underline-offset-4 font-bold">
                  LOGIN
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
