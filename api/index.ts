import { createServerEntry } from '../dist/server/server.js';

export default async function handler(request: Request) {
  try {
    const serverEntry = createServerEntry();
    return await serverEntry.fetch(request);
  } catch (error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}