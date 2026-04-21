import { createServerEntry } from '../dist/server/server.js';

export default function handler(request: Request) {
  const serverEntry = createServerEntry();
  return serverEntry.fetch(request);
}