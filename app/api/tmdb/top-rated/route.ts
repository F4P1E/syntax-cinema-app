import { type NextRequest, NextResponse } from "next/server"
import { getTopRatedMovies } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")

    const data = await getTopRatedMovies(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB top rated error:", error)
    return NextResponse.json({ error: "Failed to fetch top rated movies" }, { status: 500 })
  }
}
