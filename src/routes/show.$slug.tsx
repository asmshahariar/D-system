import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchShowBySlug } from "@/lib/content-fns";
import type { Show, QualityGroup } from "@/lib/types";
import { Download, Package, Tv, Play } from "lucide-react";

export const Route = createFileRoute("/show/$slug")({
  loader: async ({ params }) => {
    const show = await fetchShowBySlug({ data: params.slug });
    if (!show) throw notFound();
    return { show };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.show.title} — Download` : "Download" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ShowPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Show not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-primary">Back home</Link>
      </main>
    </div>
  ),
});

function QualityRow({ quality, links, idx }: QualityGroup & { idx: number }) {
  return (
    <div key={`${quality}-${idx}`} className="group/row flex flex-col gap-3 rounded-2xl border border-border/40 bg-background/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-background/60">
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          {quality}
        </span>
        <span className="text-[11px] font-bold text-muted-foreground">
          {links.length} {links.length === 1 ? "Server" : "Servers"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {links.map((l) => (
          <a
            key={l.id}
            href={`/api/go/${l.id}`}
            className="group/link flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-xs font-black uppercase tracking-tight transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg active:scale-[0.98]"
          >
            <span className="flex items-center gap-2 min-w-0">
              <Download className="h-3.5 w-3.5 shrink-0 text-primary transition-colors group-hover/link:text-white" />
              <span className="truncate">{l.name}</span>
            </span>
            <span className="text-[10px] font-black opacity-40 transition-colors group-hover/link:opacity-100">
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ShowPage() {
  const data = Route.useLoaderData() as { show: Show };
  const show = data.show;
  const totalEps = show.seasons.reduce((a: number, s) => a + s.episodes.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card p-1 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="relative flex flex-col items-center gap-6 rounded-[2.3rem] bg-gradient-to-br from-card/80 to-background/40 p-8 text-center backdrop-blur-xl sm:flex-row sm:items-center sm:text-left">
            
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                
                {show.year && (
                  <span className="text-sm font-bold text-muted-foreground">
                    {show.year}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black leading-none tracking-tight sm:text-5xl">
                {show.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground/80 sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-primary/60" />
                  <span>{show.seasons.length} Seasons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Play className="h-4 w-4 text-primary/60" />
                  <span>{totalEps} Episodes available</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Seasons */}
        <section className="mt-12 space-y-10">
          {show.seasons.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border/40 p-16 text-center">
              <div className="mb-4 rounded-2xl bg-muted/50 p-4">
                <Tv className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">
                No seasons yet.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Check back soon for new episodes.
              </p>
            </div>
          )}

          {show.seasons.map((season, si) => {
            const hasZip = Array.isArray(season.seasonZip) && season.seasonZip.length > 0;
            return (
              <article
                key={`s-${season.seasonNumber}-${si}`}
                className="overflow-hidden rounded-[2.5rem] border border-border/40 bg-card shadow-lg transition-all duration-300 hover:border-primary/20 hover:shadow-xl"
              >
                <header className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                      <span className="text-sm font-black tracking-tighter">S{season.seasonNumber}</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight">
                      Season {season.seasonNumber}
                    </h2>
                  </div>
                  <span className="rounded-full bg-muted px-4 py-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    {season.episodes.length} Episodes
                  </span>
                </header>

                <div className="space-y-6 p-8">
                  {hasZip && (
                    <div className="rounded-[2rem] border border-primary/30 bg-primary/5 p-6 shadow-inner">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                          Complete Season Pack
                        </span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {season.seasonZip!.map((q, qi) => (
                          <QualityRow key={`zip-${q.quality}-${qi}`} {...q} idx={qi} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4">
                    {season.episodes.map((ep, ei) => (
                      <div
                        key={`ep-${ep.episodeNumber}-${ei}`}
                        className="rounded-[1.8rem] border border-border/40 bg-background/40 p-6 transition-colors hover:bg-background/60"
                      >
                        <h3 className="mb-4 flex items-center gap-3 text-sm font-black uppercase tracking-tight">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Play className="h-4 w-4" />
                          </span>
                          Episode {ep.episodeNumber}
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {ep.qualities.map((q, qi) => (
                            <QualityRow key={`epq-${q.quality}-${qi}`} {...q} idx={qi} />
                          ))}
                        </div>
                        {ep.qualities.length === 0 && (
                          <div className="rounded-xl border border-dashed border-border/60 p-4 text-center">
                            <p className="text-[11px] font-bold text-muted-foreground/60">No links available yet.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {season.episodes.length === 0 && !hasZip && (
                    <div className="py-12 text-center">
                      <p className="text-sm font-bold text-muted-foreground/40">No content available for this season.</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <div className="mt-16 rounded-[2.5rem] bg-muted/30 p-10 text-center backdrop-blur-sm">
          <p className="text-xs font-bold leading-relaxed text-muted-foreground/60">
            Enjoy high-speed downloads with verified private links.<br />
            Our security verification step ensures a safe and private experience for all users.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
