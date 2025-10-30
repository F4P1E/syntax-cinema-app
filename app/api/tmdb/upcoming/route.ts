import { type NextRequest, NextResponse } from "next/server"
import { getUpcomingMovies } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")

    const data = await getUpcomingMovies(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB upcoming error:", error)
    return NextResponse.json({ error: "Failed to fetch upcoming movies" }, { status: 500 })
  }
}
