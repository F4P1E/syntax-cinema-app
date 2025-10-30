import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH - Toggle watched status
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tmdb_id, watched } = body

    const { data, error } = await supabase
      .from("watchlist")
      .update({ watched })
      .eq("user_id", user.id)
      .eq("tmdb_id", tmdb_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Watchlist toggle error:", error)
    return NextResponse.json({ error: "Failed to toggle watched status" }, { status: 500 })
  }
}
