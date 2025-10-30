"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Movie } from "@/lib/tmdb-client"

interface WatchlistItem {
  id: string
  user_id: string
  tmdb_id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  added_at: string
  watched: boolean
}

export default function WatchlistPage() {
  const router = useRouter()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unwatched" | "watched">("all")

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const response = await fetch("/api/watchlist")
      if (response.status === 401) {
        router.push("/auth/login")
        return
      }
      const data = await response.json()
      setWatchlist(data)
    } catch (error) {
      console.error("[v0] Failed to fetch watchlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWatched = async (tmdb_id: number, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/watchlist/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdb_id, watched: !currentStatus }),
      })

      if (response.ok) {
        setWatchlist((prev) =>
          prev.map((item) => (item.tmdb_id === tmdb_id ? { ...item, watched: !currentStatus } : item)),
        )
      }
    } catch (error) {
      console.error("[v0] Failed to toggle watched:", error)
    }
  }

  const removeFromWatchlist = async (tmdb_id: number) => {
    try {
      const response = await fetch(`/api/watchlist?tmdb_id=${tmdb_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWatchlist((prev) => prev.filter((item) => item.tmdb_id !== tmdb_id))
      }
    } catch (error) {
      console.error("[v0] Failed to remove from watchlist:", error)
    }
  }

  const filteredWatchlist = watchlist.filter((item) => {
    if (filter === "unwatched") return !item.watched
    if (filter === "watched") return item.watched
    return true
  })

  // Convert watchlist items to Movie format for MovieCard
  const moviesForDisplay: Movie[] = filteredWatchlist.map((item) => ({
    id: item.tmdb_id,
    title: item.title,
    poster_path: item.poster_path,
    release_date: item.release_date,
    vote_average: item.vote_average,
    backdrop_path: null,
    overview: "",
    vote_count: 0,
    genre_ids: [],
    popularity: 0,
    adult: false,
    original_language: "",
    original_title: item.title,
    video: false,
  }))

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-secondary">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-bold font-mono mb-4">MY WATCHLIST</h1>
            <p className="font-mono text-muted-foreground">
              {watchlist.length} {watchlist.length === 1 ? "FILM" : "FILMS"} SAVED
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="border-2 border-border font-mono"
              >
                ALL ({watchlist.length})
              </Button>
              <Button
                variant={filter === "unwatched" ? "default" : "outline"}
                onClick={() => setFilter("unwatched")}
                className="border-2 border-border font-mono"
              >
                TO WATCH ({watchlist.filter((i) => !i.watched).length})
              </Button>
              <Button
                variant={filter === "watched" ? "default" : "outline"}
                onClick={() => setFilter("watched")}
                className="border-2 border-border font-mono"
              >
                WATCHED ({watchlist.filter((i) => i.watched).length})
              </Button>
            </div>
          </div>
        </section>

        {/* Watchlist Grid */}
        <section className="container mx-auto px-4 py-12">
          {filteredWatchlist.length === 0 ? (
            <div className="text-center py-24">
              <h2 className="text-3xl font-bold font-mono mb-4">
                {filter === "all" ? "NO FILMS IN WATCHLIST" : `NO ${filter.toUpperCase()} FILMS`}
              </h2>
              <p className="text-muted-foreground font-mono mb-6">
                {filter === "all" ? "Start adding movies to your watchlist" : "Try a different filter"}
              </p>
              <Button onClick={() => router.push("/")} className="border-2 border-border font-mono">
                DISCOVER FILMS
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredWatchlist.map((item) => (
                <div key={item.id} className="relative group">
                  <MovieCard
                    movie={moviesForDisplay.find((m) => m.id === item.tmdb_id)!}
                    onClick={() => router.push(`/movie/${item.tmdb_id}`)}
                  />

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant={item.watched ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWatched(item.tmdb_id, item.watched)
                      }}
                      className="h-8 w-8 border-2 border-border bg-background hover:bg-accent"
                      title={item.watched ? "Mark as unwatched" : "Mark as watched"}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFromWatchlist(item.tmdb_id)
                      }}
                      className="h-8 w-8 border-2 border-border bg-background hover:bg-destructive hover:text-destructive-foreground"
                      title="Remove from watchlist"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Watched Badge */}
                  {item.watched && (
                    <div className="absolute bottom-14 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-mono font-bold border-2 border-border">
                      WATCHED
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
