import { type NextRequest, NextResponse } from "next/server"
import { getTrendingMovies } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeWindow = (searchParams.get("timeWindow") as "day" | "week") || "week"
    const page = Number.parseInt(searchParams.get("page") || "1")

    const data = await getTrendingMovies(timeWindow, page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB trending error:", error)
    return NextResponse.json({ error: "Failed to fetch trending movies" }, { status: 500 })
  }
}
