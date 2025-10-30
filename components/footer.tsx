import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-mono font-bold text-lg mb-2">SYNTAX CINEMA</h3>
            <p className="text-sm text-muted-foreground font-mono">Raw. Fast. Content-first movie discovery.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-2">NAVIGATION</h4>
            <ul className="space-y-1 text-sm font-mono">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  SEARCH
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  WATCHLIST
                </Link>
              </li>
            </ul>
          </div>

          {/* Attribution */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-2">DATA</h4>
            <p className="text-sm text-muted-foreground font-mono">
              Powered by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                TMDb API
              </a>
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-4">© {new Date().getFullYear()} SYNTAX CINEMA</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
