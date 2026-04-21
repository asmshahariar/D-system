import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Movie } from "@/lib/types";
import { getAdminPw } from "@/lib/admin-storage";
import { Plus, Pencil, Trash2, Link as LinkIcon, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminMovies,
});

function AdminMovies() {
  const [items, setItems] = useState<Movie[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("Failed to load movies:", data);
          setItems([]);
        }
      })
      .catch((err) => {
        console.error("Error loading movies:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const copyAccessLink = async (slug: string, id: string) => {
    setCopyingId(id);
    try {
      const url = `${window.location.origin}/movie/${slug}`;
      await navigator.clipboard.writeText(url);
      toast.success("Access link copied");
    } catch (e) {
      toast.error("Failed to copy link");
    } finally {
      setTimeout(() => setCopyingId(null), 2000);
    }
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const r = await fetch(`/api/movies/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": getAdminPw() },
    });
    if (!r.ok) {
      let msg = "Delete failed";
      try {
        const d = await r.json();
        msg = d.error || msg;
      } catch {
        msg = `${msg} (${r.status})`;
      }
      alert(msg);
      return;
    }
    load();
  };

  const filtered = q ? items.filter((m) => m.title.toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies…"
          className="flex-1 min-w-[200px] rounded-full border border-border bg-card px-4 py-2 text-sm outline-none ring-primary/40 focus:ring-2"
        />
        <Link
          to="/admin/movies/new"
          className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New movie
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3 hidden sm:table-cell">Year</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No movies.</td></tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{m.slug}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{m.year ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => copyAccessLink(m.slug, m.id)}
                      className="grid h-8 w-8 place-items-center rounded-full text-primary hover:bg-primary/10"
                      title="Copy temporary access link"
                    >
                      {copyingId === m.id ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
                    </button>
                    <Link
                      to="/admin/movies/$id"
                      params={{ id: m.id }}
                      className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => remove(m.id, m.title)}
                      className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
