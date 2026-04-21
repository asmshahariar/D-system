import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/shows/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params;
        const isUuid = /^[0-9a-f-]{36}$/i.test(id);
        const q = supabaseAdmin.from("shows").select("*");
        const { data, error } = await (isUuid ? q.eq("id", id) : q.eq("slug", id)).maybeSingle();
        if (error) return json({ error: error.message }, 500);
        if (!data) return json({ error: "Not found" }, 404);
        return json(data);
      },
      PUT: async ({ params, request }) => {
        try { requireAdmin(request); } catch (r) { return r as Response; }
        const body = await request.json();
        const { data, error } = await supabaseAdmin
          .from("shows").update(body).eq("id", params.id).select().single();
        if (error) return json({ error: error.message }, 400);
        return json(data);
      },
      DELETE: async ({ params, request }) => {
        try { requireAdmin(request); } catch (r) { return r as Response; }
        const { error } = await supabaseAdmin.from("shows").delete().eq("id", params.id);
        if (error) return json({ error: error.message }, 400);
        return json({ success: true });
      },
    },
  },
});
