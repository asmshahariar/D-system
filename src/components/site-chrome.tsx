import { Link } from "@tanstack/react-router";
import { Film } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a
  href="https://vidobd.shop/"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 font-bold tracking-tight"
>
  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
    <Film className="h-4 w-4" />
  </span>
  <span className="text-lg">
    VIDO<span className="text-primary">BD</span>
  </span>
</a>
        <nav className="flex items-center gap-1 text-sm">
          
          <Link
            to="/admin"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 text-foreground bg-muted" }}
          >
            a
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4">
        Copyright 2026 VIDOBD, all rights reserved.
      </div>
    </footer>
  );
}
