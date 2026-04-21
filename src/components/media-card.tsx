import { Link } from "@tanstack/react-router";
import type { Movie, Show } from "@/lib/types";
import { Film, Tv, ChevronRight } from "lucide-react";

type Item = (Movie | Show) & { kind: "movie" | "show" };

export function MediaCard({ item }: { item: Item }) {
  const to = item.kind === "movie" ? "/movie/$slug" : "/show/$slug";
  const Icon = item.kind === "movie" ? Film : Tv;
  return (
    <Link
      to={to}
      params={{ slug: item.slug }}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 transition-all hover:border-primary/60 hover:bg-card/80"
    >
      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-semibold">{item.title}</h3>
        <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
          {item.kind === "movie" ? "Movie" : "TV Show"}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
