"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // If the user is logged in, redirect to dashboard
        router.push("/dashboard")
      } else {
        // If the user is not logged in, redirect to signin
        router.push("/signin")
      }
    }

    checkSession()
  }, [router])

  return null // You can return null or a loading state while checking session
}
