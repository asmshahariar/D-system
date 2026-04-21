// Server-only admin password check. Never imported by client code.
export function requireAdmin(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const json = (data: any, status: number) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  if (!expected) {
    throw json({ error: "Admin password not configured" }, 500);
  }
  const provided = request.headers.get("x-admin-password");
  if (provided !== expected) {
    throw json({ error: "Unauthorized" }, 401);
  }
}
