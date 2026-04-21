import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Movie, Show } from "@/lib/types";

export const fetchMovieBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<Movie | null> => {
    const { data, error } = await supabaseAdmin
      .from("movies")
      .select("id,title,slug,qualities,created_at")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      poster_url: null,
      description: null,
      year: null,
      created_at: data.created_at,
      qualities: (data.qualities as unknown as Movie["qualities"]) ?? [],
    };
  });

export const fetchShowBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<Show | null> => {
    const { data, error } = await supabaseAdmin
      .from("shows")
      .select("id,title,slug,seasons,created_at")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      poster_url: null,
      description: null,
      year: null,
      created_at: data.created_at,
      seasons: (data.seasons as unknown as Show["seasons"]) ?? [],
    };
  });
