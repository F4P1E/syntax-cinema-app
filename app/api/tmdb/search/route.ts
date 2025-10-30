import { type NextRequest, NextResponse } from "next/server"
import { searchMovies } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const page = Number.parseInt(searchParams.get("page") || "1")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const data = await searchMovies(query, page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB search error:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}
