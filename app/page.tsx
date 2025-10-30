"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MovieCard } from "@/components/movie-card"
import { useState, useEffect } from "react"
import type { Movie } from "@/lib/tmdb-client"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch trending movies on mount
  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch("/api/tmdb/trending")
        const data = await response.json()
        setTrendingMovies(data.results.slice(0, 12))
      } catch (error) {
        console.error("[v0] Failed to fetch trending movies:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrending()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/discover/${category.toLowerCase().replace(" ", "-")}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-24">
            <div className="max-w-4xl">
              <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none text-balance">
                DISCOVER
                <br />
                CINEMA
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-mono mb-8 max-w-2xl text-pretty">
                Fast, raw, content-first movie discovery for cinephiles and developers. No flourish. Just function.
              </p>

              {/* Large Search */}
              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search by title, year, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-14 pr-32 text-lg border-2 border-border focus-visible:ring-accent"
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
          </div>
        </section>

        {/* Quick Stats */}
        <section className="border-b border-border bg-secondary">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-r border-border pr-4">
                <div className="font-mono text-3xl font-bold">1M+</div>
                <div className="font-mono text-sm text-muted-foreground">FILMS</div>
              </div>
              <div className="border-r border-border pr-4">
                <div className="font-mono text-3xl font-bold">500K+</div>
                <div className="font-mono text-sm text-muted-foreground">CAST</div>
              </div>
              <div className="border-r border-border pr-4">
                <div className="font-mono text-3xl font-bold">100K+</div>
                <div className="font-mono text-sm text-muted-foreground">CREW</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-bold">LIVE</div>
                <div className="font-mono text-sm text-muted-foreground">UPDATES</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <h3 className="text-3xl font-bold mb-8 font-mono">BROWSE BY CATEGORY</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["TRENDING", "POPULAR", "NOW PLAYING", "UPCOMING", "TOP RATED", "ACTION", "DRAMA", "SCI-FI"].map(
                (category) => (
                  <Button
                    key={category}
                    variant="outline"
                    onClick={() => handleCategoryClick(category)}
                    className="h-24 border-2 border-border hover:bg-accent hover:text-accent-foreground hover:border-accent font-mono text-lg font-bold bg-transparent"
                  >
                    {category}
                  </Button>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Trending Movies Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold font-mono">TRENDING NOW</h3>
            <Button
              variant="ghost"
              onClick={() => router.push("/discover/trending")}
              className="font-mono border-2 border-transparent hover:border-border"
            >
              VIEW ALL →
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-2 border-border bg-secondary animate-pulse">
                  <div className="aspect-[2/3] bg-muted" />
                  <div className="p-3 border-t-2 border-border">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => router.push(`/movie/${movie.id}`)} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
