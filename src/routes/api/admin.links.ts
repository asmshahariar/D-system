import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

// Admin-only: upsert a batch of {id,url,label} download links.
// Called by the admin editor right before saving a movie/show, so the link IDs
// referenced in qualities/seasons resolve to real URLs.
export const Route = createFileRoute("/api/admin/links")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try { requireAdmin(request); } catch (r) { return r as Response; }
        const body = (await request.json()) as Array<{ id: string; url: string; label?: string }>;
        if (!Array.isArray(body)) return json({ error: "Expected array" }, 400);
        const cleaned = body
          .filter((b) => b && typeof b.id === "string" && b.id.trim() && typeof b.url === "string" && b.url.trim())
          .map((b) => ({ id: b.id.trim(), url: b.url.trim(), label: b.label ?? null }));
        if (cleaned.length === 0) return json({ success: true, count: 0 });
        const { error } = await supabaseAdmin.from("download_links").upsert(cleaned);
        if (error) return json({ error: error.message }, 400);
        return json({ success: true, count: cleaned.length });
      },
    },
  },
});
