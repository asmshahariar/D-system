import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/movies/")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await supabaseAdmin
          .from("movies")
          .select("id,title,slug,poster_url,description,year,qualities,created_at")
          .order("created_at", { ascending: false });
        if (error) return json({ error: error.message }, 500);
        return json(data);
      },
      POST: async ({ request }) => {
        try {
          requireAdmin(request);
          const body = await request.json();
          const { data, error } = await supabaseAdmin.from("movies").insert(body).select().single();
          if (error) {
            console.error("Supabase insert error:", error);
            return json({ error: error.message }, 400);
          }
          return json(data, 201);
        } catch (e) {
          console.error("API POST /api/movies error:", e);
          if (e instanceof Response) return e; // If requireAdmin throws a Response
          return json({ error: (e as Error).message || "Internal Server Error" }, 500);
        }
      },
    },
  },
});
