import { createFileRoute } from "@tanstack/react-router";
import { loadShowSecurely } from "@/lib/access-token.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/load-show/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const url = new URL(request.url);
          const token = url.searchParams.get("t") || undefined;
          const res = await loadShowSecurely({ data: { slug: params.slug, token } });
          return json(res);
        } catch (e) {
          return json({ ok: false, error: (e as Error).message }, 500);
        }
      },
    },
  },
});
