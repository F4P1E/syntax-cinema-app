import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Fetch user's watchlist
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Watchlist fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

// POST - Add movie to watchlist
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tmdb_id, title, poster_path, release_date, vote_average } = body

    const { data, error } = await supabase
      .from("watchlist")
      .insert({
        user_id: user.id,
        tmdb_id,
        title,
        poster_path,
        release_date,
        vote_average,
      })
      .select()
      .single()

    if (error) {
      // Check for unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json({ error: "Movie already in watchlist" }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Watchlist add error:", error)
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
  }
}

// DELETE - Remove movie from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tmdb_id = searchParams.get("tmdb_id")

    if (!tmdb_id) {
      return NextResponse.json({ error: "Movie ID required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("tmdb_id", Number.parseInt(tmdb_id))

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Watchlist remove error:", error)
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
