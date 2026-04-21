import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { getAdminPw, setAdminPw, clearAdminPw } from "@/lib/admin-storage";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getAdminPw()) setAuthed(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    // Probe auth with a no-op admin call (DELETE on a fake id returns 401 if pw wrong, 400 if right)
    const r = await fetch("/api/movies/00000000-0000-0000-0000-000000000000", {
      method: "DELETE",
      headers: { "x-admin-password": pw },
    });
    setBusy(false);
    if (r.status === 401) {
      setErr("Wrong password");
      return;
    }
    setAdminPw(pw);
    setAuthed(true);
  };

  const logout = () => {
    clearAdminPw();
    setAuthed(false);
    setPw("");
    navigate({ to: "/admin" });
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-12">
          <form onSubmit={submit} className="w-full rounded-3xl border border-border/60 bg-card p-8">
            <h1 className="text-xl font-bold">Admin login</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the admin password to manage content.
            </p>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className="mt-5 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none ring-primary/40 focus:ring-2"
              autoFocus
            />
            {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
            <button
              disabled={busy || !pw}
              className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Checking…" : "Sign in"}
            </button>
          </form>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin"
              activeOptions={{ exact: true }}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary"
              activeProps={{ className: "rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm text-primary" }}
            >
              Movies
            </Link>
            <Link
              to="/admin/shows"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary"
              activeProps={{ className: "rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm text-primary" }}
            >
              Shows
            </Link>
          </div>
          <button onClick={logout} className="text-xs text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
