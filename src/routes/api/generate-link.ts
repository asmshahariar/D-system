import { createFileRoute } from "@tanstack/react-router";
import { signAccessToken } from "@/lib/access-token.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/generate-link")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { slug } = await request.json();
          if (!slug) return json({ error: "Slug is required" }, 400);
          
          const token = await signAccessToken({ data: slug });
          return json({ token });
        } catch (e) {
          console.error("API POST /api/generate-link error:", e);
          return json({ error: (e as Error).message || "Internal Server Error" }, 500);
        }
      },
    },
  },
});
