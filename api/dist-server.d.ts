declare module '../dist/server/server.js' {
  export function createServerEntry(entry?: unknown): {
    fetch(request: Request): Promise<Response>;
  };
}
