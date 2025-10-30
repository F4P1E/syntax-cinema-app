"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import type { Movie } from "@/lib/tmdb-client"

const CATEGORY_CONFIG: Record<string, { title: string; endpoint: string; param?: string }> = {
  trending: { title: "TRENDING", endpoint: "/api/tmdb/trending" },
  popular: { title: "POPULAR", endpoint: "/api/tmdb/popular" },
  "now-playing": { title: "NOW PLAYING", endpoint: "/api/tmdb/now-playing" },
  upcoming: { title: "UPCOMING", endpoint: "/api/tmdb/upcoming" },
  "top-rated": { title: "TOP RATED", endpoint: "/api/tmdb/top-rated" },
  action: { title: "ACTION", endpoint: "/api/tmdb/genre", param: "28" },
  drama: { title: "DRAMA", endpoint: "/api/tmdb/genre", param: "18" },
  "sci-fi": { title: "SCI-FI", endpoint: "/api/tmdb/genre", param: "878" },
}

export default function DiscoverPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const router = useRouter()
  const config = CATEGORY_CONFIG[category]

  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchMovies(1)
  }, [category])

  const fetchMovies = async (pageNum: number) => {
    if (!config) return

    setIsLoading(true)
    try {
      const url = config.param
        ? `${config.endpoint}?genreId=${config.param}&page=${pageNum}`
        : `${config.endpoint}?page=${pageNum}`

      const response = await fetch(url)
      const data = await response.json()
      setMovies(data.results)
      setTotalPages(data.total_pages)
      setPage(pageNum)
    } catch (error) {
      console.error("[v0] Fetch movies error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    fetchMovies(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!config) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-mono mb-4">404</h1>
            <p className="text-muted-foreground font-mono">Category not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Category Header */}
        <section className="border-b border-border bg-secondary">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-bold font-mono">{config.title}</h1>
          </div>
        </section>

        {/* Movies Grid */}
        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Page Info */}
              <div className="mb-8 flex items-center justify-between">
                <p className="font-mono text-sm text-muted-foreground">SHOWING {movies.length} FILMS</p>
                <div className="font-mono text-sm text-muted-foreground">
                  PAGE {page} / {totalPages}
                </div>
              </div>

              {/* Movie Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={() => router.push(`/movie/${movie.id}`)} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="border-2 border-border font-mono"
                  >
                    ← PREV
                  </Button>
                  <span className="font-mono text-sm px-4">
                    {page} / {Math.min(totalPages, 500)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || page >= 500}
                    className="border-2 border-border font-mono"
                  >
                    NEXT →
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
