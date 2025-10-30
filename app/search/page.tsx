"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Movie } from "@/lib/tmdb-client"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, 1)
    }
  }, [initialQuery])

  const performSearch = async (query: string, pageNum: number) => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}&page=${pageNum}`)
      const data = await response.json()
      setMovies(data.results)
      setTotalPages(data.total_pages)
      setTotalResults(data.total_results)
      setPage(pageNum)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handlePageChange = (newPage: number) => {
    performSearch(initialQuery, newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <section className="border-b border-border bg-secondary">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-mono">SEARCH FILMS</h1>
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search by title, year, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-28 text-base border-2 border-border focus-visible:ring-accent"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2 border-2 border-border font-mono"
              >
                SEARCH
              </Button>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
            </div>
          ) : movies.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-mono mb-1">RESULTS FOR "{initialQuery}"</h2>
                  <p className="font-mono text-sm text-muted-foreground">{totalResults.toLocaleString()} FILMS FOUND</p>
                </div>
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
          ) : initialQuery ? (
            <div className="text-center py-24">
              <h2 className="text-3xl font-bold font-mono mb-4">NO RESULTS FOUND</h2>
              <p className="text-muted-foreground font-mono">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="text-center py-24">
              <h2 className="text-3xl font-bold font-mono mb-4">START SEARCHING</h2>
              <p className="text-muted-foreground font-mono">Enter a movie title, year, or genre above</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
