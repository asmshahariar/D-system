import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchMovieBySlug } from "@/lib/content-fns";
import type { Movie } from "@/lib/types";
import { Download, Film, ArrowLeft, HardDrive } from "lucide-react";

export const Route = createFileRoute("/movie/$slug")({
  loader: async ({ params }) => {
    const movie = await fetchMovieBySlug({ data: params.slug });
    if (!movie) {
  return {
    movie: {
      title: "TEST MOVIE",
      year: 2026,
      qualities: []
    }
  }
}
    return { movie };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.movie.title} — Download` : "Download" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MoviePage,
  notFoundComponent: () => (    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Movie not found</h1>
        <p className="mt-2 text-muted-foreground">The movie you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary">Back home</Link>
      </main>
    </div>
  ),
});

function MoviePage() {
  const data = Route.useLoaderData() as { movie: Movie };
  const movie = data.movie;
  const totalLinks = movie.qualities.reduce((acc: number, q) => acc + q.links.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card p-1 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="relative flex flex-col items-center gap-6 rounded-[1.8rem] bg-gradient-to-br from-card/80 to-background/40 p-8 text-center backdrop-blur-xl sm:flex-row sm:items-center sm:text-left">
            
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                
                {movie.year && (
                  <span className="text-sm font-bold text-muted-foreground">
                    {movie.year}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black leading-none tracking-tight sm:text-5xl">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground/80 sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4 text-primary/60" />
                  <span>{movie.qualities.length} Quality options</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="h-4 w-4 text-primary/60" />
                  <span>{totalLinks} High-speed links</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Downloads */}
        <section className="mt-12 space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
              Select Quality
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
          </div>

          {movie.qualities.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border/40 p-16 text-center">
              <div className="mb-4 rounded-2xl bg-muted/50 p-4">
                <HardDrive className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">
                No download links available yet.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Please check back later for updates.
              </p>
            </div>
          )}

          <div className="grid gap-6">
            {movie.qualities.map((q, qi) => (
              <article
                key={`${q.quality}-${qi}`}
                className="group relative overflow-hidden rounded-[1.8rem] border border-border/40 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="flex flex-col border-b border-border/40 bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-black tracking-tighter text-primary-foreground shadow-lg shadow-primary/20">
                      {q.quality}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {q.links.length} Available Servers
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {q.links.map((l) => (
                    <a
                      key={l.id}
                      href={`/api/go/${l.id}`}
                      className="group/link flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 p-4 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover/link:bg-white/20">
                          <Download className="h-4 w-4 text-primary transition-colors group-hover/link:text-white" />
                        </div>
                        <span className="truncate text-xs font-black uppercase tracking-wide">
                          {l.name}
                        </span>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black uppercase transition-colors group-hover/link:bg-white/20">
                        →
                      </div>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
