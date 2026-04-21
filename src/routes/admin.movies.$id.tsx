import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Movie, QualityGroup } from "@/lib/types";
import { getAdminPw } from "@/lib/admin-storage";
import { QualityEditor } from "@/components/admin-editors";
import { SavedLinkBanner } from "@/components/saved-link-banner";
import { Copy, Check, Link as LinkIcon, RefreshCw } from "lucide-react";

type LinkWithUrl = { id: string; name: string; url?: string };
type QGW = { quality: string; links: LinkWithUrl[] };

export const Route = createFileRoute("/admin/movies/$id")({
  component: MovieEditor,
});

function randomId(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function MovieEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [qualities, setQualities] = useState<QGW[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [accessLink, setAccessLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isNew) {
      setSlug(randomId());
      return;
    }
    fetch(`/api/movies/${id}`)
      .then((r) => r.json())
      .then((m: Movie) => {
        setTitle(m.title);
        setSlug(m.slug);
        setQualities(m.qualities as QGW[]);
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const generateLink = (currentSlug: string) => {
    const url = `${window.location.origin}/movie/${currentSlug}`;
    setAccessLink(url);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(accessLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = async () => {
    setSaving(true);
    setErr("");
    try {
      const getError = async (r: Response) => {
        try {
          const d = await r.json();
          return d.error || d.message || "Request failed";
        } catch {
          return `Error ${r.status}: ${r.statusText || "Unknown error"}`;
        }
      };

      // 1) Upsert any link URLs the admin entered
      const linksPayload = qualities
        .flatMap((q) => q.links)
        .filter((l) => l.id && l.url)
        .map((l) => ({ id: l.id, url: l.url!, label: l.name }));
      if (linksPayload.length) {
        const r = await fetch("/api/admin/links", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-password": getAdminPw() },
          body: JSON.stringify(linksPayload),
        });
        if (!r.ok) throw new Error(await getError(r));
      }
      // 2) Strip url before persisting movie
      const stripped: QualityGroup[] = qualities.map((q) => ({
        quality: q.quality,
        links: q.links.map(({ id, name }) => ({ id, name })),
      }));
      const body = {
        title: title.trim(),
        slug: (slug || randomId()).trim(),
        qualities: stripped,
      };
      const url = isNew ? "/api/movies" : `/api/movies/${id}`;
      const method = isNew ? "POST" : "PUT";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-password": getAdminPw() },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(await getError(r));
      const saved = await r.json();
      setSavedSlug(saved.slug);
      
      // Show the access link for the UI
      generateLink(saved.slug);
      
      if (isNew) {
        // switch URL to edit mode of the new record so re-saves update instead of creating
        navigate({ to: "/admin/movies/$id", params: { id: saved.id }, replace: true });
      }
    } catch (e) {
      console.error("Save error:", e);
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isNew ? "New movie" : "Edit movie"}</h2>
        {!isNew && (
          <button
            onClick={() => generateLink(slug)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/10"
          >
            <LinkIcon className="h-3 w-3" /> Get Access Link
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Private Slug (ID)">
          <div className="relative">
            <input
              className={inputCls + " pr-10"}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-random"
            />
            <button
              onClick={() => setSlug(randomId())}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-primary"
              title="Generate new random ID"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </Field>
      </div>

      {accessLink && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary">
            Direct Access Link
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={accessLink}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono outline-none"
            />
            <button
              onClick={copyLink}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Share this URL with the user.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
        <QualityEditor
          qualities={qualities as unknown as QualityGroup[]}
          onChange={(q) => setQualities(q as QGW[])}
        />
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving || !title.trim()}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={() => navigate({ to: "/admin" })}
          className="rounded-full border border-border px-6 py-2.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/40 focus:ring-2";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
