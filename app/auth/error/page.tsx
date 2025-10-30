import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold font-mono">SYNTAX CINEMA</h1>
          </Link>
        </div>

        <Card className="border-2 border-border">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 border-2 border-border bg-destructive flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-mono text-center">AUTHENTICATION ERROR</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {params?.error ? (
              <p className="text-sm text-muted-foreground font-mono mb-6">Error code: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground font-mono mb-6">An unspecified error occurred.</p>
            )}
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline" className="border-2 border-border font-mono bg-transparent">
                <Link href="/auth/login">TRY AGAIN</Link>
              </Button>
              <Button asChild className="border-2 border-border font-mono">
                <Link href="/">GO HOME</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
