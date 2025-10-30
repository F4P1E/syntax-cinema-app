import { type NextRequest, NextResponse } from "next/server"
import { getPopularMovies } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")

    const data = await getPopularMovies(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB popular error:", error)
    return NextResponse.json({ error: "Failed to fetch popular movies" }, { status: 500 })
  }
}
