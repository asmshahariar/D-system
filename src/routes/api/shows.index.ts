import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/shows/")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await supabaseAdmin
          .from("shows")
          .select("id,title,slug,poster_url,description,year,seasons,created_at")
          .order("created_at", { ascending: false });
        if (error) return json({ error: error.message }, 500);
        return json(data);
      },
      POST: async ({ request }) => {
        try { requireAdmin(request); } catch (r) { return r as Response; }
        const body = await request.json();
        const { data, error } = await supabaseAdmin.from("shows").insert(body).select().single();
        if (error) return json({ error: error.message }, 400);
        return json(data, 201);
      },
    },
  },
});
