import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Lock, Link2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VIDOBD — Private Download Portal" },
      { name: "description", content: "Private download portal. Access is by direct link only." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex min-h-[80vh] max-w-3xl items-center px-4 py-12">
        <section className="w-full rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-background p-8 text-center sm:p-14">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Private Download Portal
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            This site is invite-only. Content is accessible exclusively through direct links shared
            by the administrator.
          </p>

          <div className="mx-auto mt-10 grid max-w-xl gap-3 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
              <Link2 className="mb-2 h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">Link-only access</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Open the URL you were given to view downloads.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
              <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">Verified delivery</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Every download passes a quick verification step.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <a
  href="https://vidobd.shop/"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-foreground"
>
  <Lock className="h-3.5 w-3.5" /> VIDOBD
</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
