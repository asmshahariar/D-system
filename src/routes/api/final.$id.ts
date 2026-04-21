import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Step 2 of the download flow: /api/final/:id -> resolve link id to real URL and redirect.
// The real URL never reaches client code as serializable JSON.
export const Route = createFileRoute("/api/final/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { data, error } = await supabaseAdmin
          .from("download_links")
          .select("url")
          .eq("id", params.id)
          .maybeSingle();
        if (error || !data) {
          return new Response("Download link not found", { status: 404 });
        }
        return new Response(null, { status: 302, headers: { Location: data.url } });
      },
    },
  },
});
