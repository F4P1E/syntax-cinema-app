import { type NextRequest, NextResponse } from "next/server"
import { getMovieDetails } from "@/lib/tmdb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const movieId = Number.parseInt(id)

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const data = await getMovieDetails(movieId)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] TMDB movie details error:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
