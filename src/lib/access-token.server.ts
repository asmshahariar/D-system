import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchMovieBySlug, fetchShowBySlug } from "./content-fns";

/**
 * Simple, zero-dependency signed token using Web Crypto API.
 * This is server-side only to protect the ADMIN_PASSWORD secret.
 */

async function getSecretKey() {
  const secret = process.env.ADMIN_PASSWORD || "default-dev-secret";
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a payload (slug + expiration) into a hex token.
 */
async function _signAccessToken(slug: string): Promise<string> {
  const exp = Date.now() + 1000 * 60 * 60 * 4; // 4 hours TTL
  const payload = `${slug}:${exp}`;
  const encoder = new TextEncoder();
  const key = await getSecretKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  
  const combined = `${payload}:${sigHex}`;
  // Use Buffer for safe base64 in Node/Bun/Cloudflare nodejs_compat
  return Buffer.from(combined).toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Verifies a token and returns true if valid and not expired.
 */
async function _verifyAccessToken(token: string, expectedSlug: string): Promise<boolean> {
  try {
    if (!token) {
      console.error("Verify Access Token: Token is missing.");
      return false;
    }

    if (typeof Buffer === "undefined") {
      console.error("Verify Access Token: Buffer is not defined in this environment.");
      return false;
    }

    const decoded = Buffer.from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
    const parts = decoded.split(":");
    if (parts.length !== 3) {
      console.error("Verify Access Token: Decoded token has incorrect parts count.", { decoded, parts });
      return false;
    }
    
    const [slug, expStr, sigHex] = parts;
    const exp = parseInt(expStr, 10);

    if (slug !== expectedSlug) {
      console.error("Verify Access Token: Slug mismatch.", { slug, expectedSlug });
      return false;
    }
    if (Date.now() > exp) {
      console.error("Verify Access Token: Token expired.", { exp });
      return false;
    }

    if (typeof crypto === "undefined" || !crypto.subtle) {
      console.error("Verify Access Token: Web Crypto API (crypto.subtle) is not available.");
      return false;
    }

    // Re-verify signature
    const payload = `${slug}:${expStr}`;
    const encoder = new TextEncoder();
    const key = await getSecretKey();
    
    const sigBytes = new Uint8Array(
      sigHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
    if (!isValid) {
      console.error("Verify Access Token: Signature verification failed.");
    }
    return isValid;
  } catch (e) {
    console.error("Error during access token verification:", e);
    return false;
  }
}

/**
 * Server-side bridge for the client (Admin UI) to sign a token.
 */
export const signAccessToken = createServerFn({ method: "POST" })
  .inputValidator((slug: string) => {
    return z.string().parse(slug);
  })
  .handler(async ({ data: slug }): Promise<string> => {
    try {
      return await _signAccessToken(slug);
    } catch (e) {
      console.error("Error signing access token:", e);
      throw new Error("Failed to sign access token");
    }
  });

/**
 * SECURE LOADERS: These functions run entirely on the server.
 * They verify the token AND fetch the data in one go.
 */
export const loadMovieSecurely = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; token?: string }) => {
    return z.object({ slug: z.string(), token: z.string().optional() }).parse(data);
  })
  .handler(async ({ data }) => {
    console.log(`Attempting secure load for movie: ${data.slug}`);
    
    const ok = data.token ? await _verifyAccessToken(data.token, data.slug) : false;
    if (!ok) {
      console.error(`Access token verification failed for movie: ${data.slug}`);
      return { ok: false as const, reason: "invalid_token" };
    }

    const movie = await fetchMovieBySlug({ data: data.slug });
    if (!movie) {
      console.error(`Movie not found in database: ${data.slug}`);
      return { ok: false as const, reason: "not_found" };
    }

    console.log(`Successfully loaded movie: ${data.slug}`);
    return { ok: true as const, movie };
  });

export const loadShowSecurely = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; token?: string }) => {
    return z.object({ slug: z.string(), token: z.string().optional() }).parse(data);
  })
  .handler(async ({ data }) => {
    console.log(`Attempting secure load for show: ${data.slug}`);

    const ok = data.token ? await _verifyAccessToken(data.token, data.slug) : false;
    if (!ok) {
      console.error(`Access token verification failed for show: ${data.slug}`);
      return { ok: false as const, reason: "invalid_token" };
    }

    const show = await fetchShowBySlug({ data: data.slug });
    if (!show) {
      console.error(`Show not found in database: ${data.slug}`);
      return { ok: false as const, reason: "not_found" };
    }

    console.log(`Successfully loaded show: ${data.slug}`);
    return { ok: true as const, show };
  });
