"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, Star, Clock, Calendar, Play, Loader2 } from "lucide-react"
import type { MovieDetails } from "@/lib/tmdb-client"
import { getBackdropUrl, getPosterUrl, getProfileUrl } from "@/lib/tmdb-client"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inWatchlist, setInWatchlist] = useState(false)
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false)

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch(`/api/tmdb/movie/${id}`)
        if (!response.ok) throw new Error("Failed to fetch movie")
        const data = await response.json()
        setMovie(data)
        // Check watchlist status
        checkWatchlistStatus(Number.parseInt(id))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movie")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  const checkWatchlistStatus = async (movieId: number) => {
    try {
      const response = await fetch(`/api/watchlist/check?tmdb_id=${movieId}`)
      const data = await response.json()
      setInWatchlist(data.inWatchlist)
    } catch (error) {
      console.error("[v0] Failed to check watchlist:", error)
    }
  }

  const toggleWatchlist = async () => {
    if (!movie) return

    setIsWatchlistLoading(true)
    try {
      if (inWatchlist) {
        // Remove from watchlist
        const response = await fetch(`/api/watchlist?tmdb_id=${movie.id}`, {
          method: "DELETE",
        })
        if (response.status === 401) {
          router.push("/auth/login")
          return
        }
        if (response.ok) {
          setInWatchlist(false)
        }
      } else {
        // Add to watchlist
        const response = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tmdb_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          }),
        })
        if (response.status === 401) {
          router.push("/auth/login")
          return
        }
        if (response.ok) {
          setInWatchlist(true)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to toggle watchlist:", error)
    } finally {
      setIsWatchlistLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-muted-foreground">LOADING...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">ERROR</h1>
            <p className="text-muted-foreground font-mono">{error || "Movie not found"}</p>
            <Button onClick={() => router.push("/")} className="mt-6 font-mono border-2 border-border">
              ← BACK TO HOME
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Safely access credits arrays - credits or the nested arrays may be undefined depending on API response
  const director = movie.credits?.crew?.find((c) => c.job === "Director")
  const topCast = movie.credits?.cast?.slice(0, 12) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Backdrop */}
        <section className="relative border-b-2 border-border">
          {/* Backdrop Image */}
          <div className="relative h-[60vh] bg-muted">
            <Image
              src={getBackdropUrl(movie.backdrop_path) || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container mx-auto px-4 pb-8">
              <div className="flex flex-col md:flex-row gap-8 items-end">
                {/* Poster */}
                <div className="w-48 md:w-64 flex-shrink-0 border-2 border-border bg-card shadow-2xl">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={getPosterUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 192px, 256px"
                    />
                  </div>
                </div>

                {/* Title & Meta */}
                <div className="flex-1 pb-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-2 text-balance">{movie.title}</h1>
                  {movie.tagline && (
                    <p className="text-xl text-muted-foreground font-mono mb-4 italic">"{movie.tagline}"</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 font-mono text-sm">
                    <div className="flex items-center gap-2 border-2 border-border bg-background px-3 py-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-muted-foreground">/ 10</span>
                    </div>
                    <div className="flex items-center gap-2 border-2 border-border bg-background px-3 py-1">
                      <Calendar className="h-4 w-4" />
                      <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 border-2 border-border bg-background px-3 py-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.runtime} MIN</span>
                    </div>
                    <div className="border-2 border-border bg-background px-3 py-1">
                      <span className="uppercase">{movie.status}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={toggleWatchlist}
                      disabled={isWatchlistLoading}
                      className="border-2 border-border font-mono"
                    >
                      {isWatchlistLoading ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : inWatchlist ? (
                        <BookmarkCheck className="h-5 w-5 mr-2" />
                      ) : (
                        <Bookmark className="h-5 w-5 mr-2" />
                      )}
                      {inWatchlist ? "IN WATCHLIST" : "ADD TO WATCHLIST"}
                    </Button>
                    <Button size="lg" variant="outline" className="border-2 border-border font-mono bg-transparent">
                      <Play className="h-5 w-5 mr-2" />
                      WATCH TRAILER
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold font-mono mb-4 border-b-2 border-border pb-2">OVERVIEW</h2>
                <p className="text-lg leading-relaxed">{movie.overview}</p>
              </div>

              {/* Cast */}
              {topCast.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold font-mono mb-4 border-b-2 border-border pb-2">CAST</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {topCast.map((cast) => (
                      <div key={cast.id} className="border-2 border-border bg-card">
                        <div className="aspect-[2/3] relative bg-muted">
                          <Image
                            src={getProfileUrl(cast.profile_path) || "/placeholder.svg"}
                            alt={cast.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <div className="p-3 border-t-2 border-border">
                          <div className="font-mono text-sm font-bold mb-1 line-clamp-1">{cast.name}</div>
                          <div className="font-mono text-xs text-muted-foreground line-clamp-1">{cast.character}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Box */}
              <div className="border-2 border-border bg-secondary p-6">
                <h3 className="text-xl font-bold font-mono mb-4">INFO</h3>
                <dl className="space-y-3 font-mono text-sm">
                  {director && (
                    <div>
                      <dt className="text-muted-foreground mb-1">DIRECTOR</dt>
                      <dd className="font-bold">{director.name}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground mb-1">GENRES</dt>
                    <dd className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span key={genre.id} className="border-2 border-border bg-background px-2 py-1 text-xs">
                          {genre.name.toUpperCase()}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">RELEASE DATE</dt>
                    <dd className="font-bold">{movie.release_date}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">RUNTIME</dt>
                    <dd className="font-bold">{movie.runtime} MINUTES</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">LANGUAGE</dt>
                    <dd className="font-bold">{movie.original_language.toUpperCase()}</dd>
                  </div>
                  {movie.budget > 0 && (
                    <div>
                      <dt className="text-muted-foreground mb-1">BUDGET</dt>
                      <dd className="font-bold">${(movie.budget / 1000000).toFixed(1)}M</dd>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <dt className="text-muted-foreground mb-1">REVENUE</dt>
                      <dd className="font-bold">${(movie.revenue / 1000000).toFixed(1)}M</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Production Companies */}
              {(movie.production_companies?.length ?? 0) > 0 && (
                <div className="border-2 border-border bg-secondary p-6">
                  <h3 className="text-xl font-bold font-mono mb-4">PRODUCTION</h3>
                  <ul className="space-y-2 font-mono text-sm">
                    {movie.production_companies?.slice(0, 5).map((company) => (
                      <li key={company.id} className="text-muted-foreground">
                        {company.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
