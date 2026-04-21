import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Shield, Download, Copy, Check, Loader2 } from "lucide-react";

const COUNTDOWN = 5;

export const Route = createFileRoute("/verify/$id")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { id } = Route.useParams();
  const [seconds, setSeconds] = useState(COUNTDOWN);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const ready = seconds <= 0;
  const finalUrl = `/api/final/${id}`;

  const goDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ready) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setRedirecting(true);
    window.location.href = finalUrl;
  };

  const progress = ((COUNTDOWN - seconds) / COUNTDOWN) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex min-h-[85vh] max-w-md items-center px-4 py-8">
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-border/60 bg-gradient-to-b from-card to-background p-8 text-center shadow-2xl sm:p-10">
          {/* Decorative background element */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
              {ready ? (
                <Check className="h-10 w-10 animate-in zoom-in duration-500" />
              ) : (
                <Shield className="h-10 w-10 animate-pulse" />
              )}
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {ready ? "Ready to Go!" : "Verifying link"}
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {ready
                ? "Your secure download link is now active."
                : "Securely preparing your requested file..."}
            </p>

            {/* Progress/Countdown section */}
            <div className="my-10">
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/30"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * progress) / 100}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black tabular-nums tracking-tighter text-primary">
                    {ready ? "✓" : seconds}
                  </span>
                  {!ready && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                      wait
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={finalUrl}
                onClick={goDownload}
                aria-disabled={!ready || redirecting}
                className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl px-6 py-4.5 text-sm font-black tracking-wide transition-all duration-300 ${
                  ready && !redirecting
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                }`}
              >
                {redirecting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Starting Download...
                  </>
                ) : ready ? (
                  <>
                    <Download className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                    Get Download Link
                  </>
                ) : (
                  <>Link unlocking in {seconds}s</>
                )}
              </a>

              <Link
                to="/"
                className="mt-5 inline-block text-xs font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                Cancel and return
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
