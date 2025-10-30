import { type NextRequest, NextResponse } from "next/server"
import { getMoviesByGenre } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const genreId = Number.parseInt(searchParams.get("genreId") || "0")
    const page = Number.parseInt(searchParams.get("page") || "1")

    if (!genreId) {
      return NextResponse.json({ error: "Genre ID is required" }, { status: 400 })
    }

    const data = await getMoviesByGenre(genreId, page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB genre error:", error)
    return NextResponse.json({ error: "Failed to fetch movies by genre" }, { status: 500 })
  }
}
