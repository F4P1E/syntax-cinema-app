"use client"

import type { Movie } from "@/lib/tmdb-client"
import { getPosterUrl } from "@/lib/tmdb-client"
import { Star } from "lucide-react"
import Image from "next/image"

interface MovieCardProps {
  movie: Movie
  onClick?: () => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <button
      onClick={onClick}
      className="group border-2 border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left w-full"
    >
      {/* Poster - strict 2:3 aspect ratio */}
      <div className="aspect-[2/3] relative overflow-hidden bg-muted">
        <Image
          src={getPosterUrl(movie.poster_path) || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
        />
      </div>

      {/* Info */}
      <div className="p-3 border-t-2 border-border group-hover:border-accent">
        <div className="font-mono text-sm font-bold mb-1 line-clamp-2 group-hover:text-accent-foreground">
          {movie.title}
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground group-hover:text-accent-foreground">
          <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </button>
  )
}
