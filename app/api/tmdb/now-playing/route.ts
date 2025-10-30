import { type NextRequest, NextResponse } from "next/server"
import { getNowPlayingMovies } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")

    const data = await getNowPlayingMovies(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB now playing error:", error)
    return NextResponse.json({ error: "Failed to fetch now playing movies" }, { status: 500 })
  }
}
