import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/movies/$id")({
  server: {
    handlers: {
      // GET supports both UUID id and slug
      GET: async ({ params }) => {
        const { id } = params;
        const isUuid = /^[0-9a-f-]{36}$/i.test(id);
        const q = supabaseAdmin.from("movies").select("*");
        const { data, error } = await (isUuid ? q.eq("id", id) : q.eq("slug", id)).maybeSingle();
        if (error) return json({ error: error.message }, 500);
        if (!data) return json({ error: "Not found" }, 404);
        return json(data);
      },
      PUT: async ({ params, request }) => {
        try {
          requireAdmin(request);
          const body = await request.json();
          const { data, error } = await supabaseAdmin
            .from("movies").update(body).eq("id", params.id).select().single();
          if (error) {
            console.error("Supabase update error:", error);
            return json({ error: error.message }, 400);
          }
          return json(data);
        } catch (e) {
          console.error("API PUT /api/movies/$id error:", e);
          if (e instanceof Response) return e;
          return json({ error: (e as Error).message || "Internal Server Error" }, 500);
        }
      },
      DELETE: async ({ params, request }) => {
        try {
          requireAdmin(request);
          const { error } = await supabaseAdmin.from("movies").delete().eq("id", params.id);
          if (error) {
            console.error("Supabase delete error:", error);
            return json({ error: error.message }, 400);
          }
          return json({ success: true });
        } catch (e) {
          console.error("API DELETE /api/movies/$id error:", e);
          if (e instanceof Response) return e;
          return json({ error: (e as Error).message || "Internal Server Error" }, 500);
        }
      },
    },
  },
});
