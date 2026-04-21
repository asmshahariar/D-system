import { createFileRoute, redirect } from "@tanstack/react-router";

// Step 1 of the download flow: /api/go/:id -> redirect to /verify/:id
export const Route = createFileRoute("/api/go/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return new Response(null, {
          status: 302,
          headers: { Location: `/verify/${encodeURIComponent(params.id)}` },
        });
      },
    },
  },
});
// Avoid unused import warnings (TanStack helper kept for future use)
void redirect;
