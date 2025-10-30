import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Check if a movie is in the user's watchlist
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ inWatchlist: false })
    }

    const { searchParams } = new URL(request.url)
    const tmdb_id = searchParams.get("tmdb_id")

    if (!tmdb_id) {
      return NextResponse.json({ error: "Movie ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("tmdb_id", Number.parseInt(tmdb_id))
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" which is expected
      throw error
    }

    return NextResponse.json({ inWatchlist: !!data })
  } catch (error) {
    console.error("[v0] Watchlist check error:", error)
    return NextResponse.json({ error: "Failed to check watchlist" }, { status: 500 })
  }
}
