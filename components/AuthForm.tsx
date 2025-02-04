"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface AuthFormProps {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // This state will help us handle the initial hydration and prevent the redirect
  const [isMounted, setIsMounted] = useState(false)

  // UseEffect to ensure we only run the redirect logic after the client is fully mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert("Check your email for the confirmation link!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        // Check session after successful sign-in and redirect
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          router.push("/dashboard") // Redirect to dashboard after successful sign-in
        } else {
          setError("Session not found after sign-in.")
        }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during sign in")
    }
  }

  // This effect is for checking session and redirecting if already authenticated
  useEffect(() => {
    if (!isMounted) return

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [isMounted, router])

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{mode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {mode === "signin" ? "Enter your credentials to access your account" : "Create an account to get started"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" type="submit">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
          <p className="mt-2 text-sm text-center">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <Link href={mode === "signin" ? "/signup" : "/signin"} className="text-blue-500 hover:underline">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
