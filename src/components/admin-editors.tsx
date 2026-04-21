import { useState } from "react";
import type { QualityGroup, Season } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

const QUALITY_PRESETS: string[] = ["480p", "720p", "1080p", "4K", "HDR"];

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/40 focus:ring-2";
const labelCls = "text-xs font-medium text-muted-foreground";
const btnSm =
  "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary";
const btnIcon =
  "grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/15 hover:text-destructive";

export function QualityEditor({
  qualities,
  onChange,
  title = "Qualities",
}: {
  qualities: QualityGroup[];
  onChange: (q: QualityGroup[]) => void;
  title?: string;
}) {
  const update = (i: number, patch: Partial<QualityGroup>) =>
    onChange(qualities.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const remove = (i: number) => onChange(qualities.filter((_, idx) => idx !== i));
  const add = () => onChange([...qualities, { quality: "1080p", links: [] }]);
  void QUALITY_PRESETS;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <button type="button" onClick={add} className={btnSm}>
          <Plus className="h-3 w-3" /> Add quality
        </button>
      </div>
      {qualities.map((q, i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="flex items-center gap-2">
            <select
              value={QUALITY_PRESETS.includes(q.quality) ? q.quality : "1080p"}
              onChange={(e) => update(i, { quality: e.target.value })}
              className={inputCls + " max-w-[160px]"}
            >
              {QUALITY_PRESETS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button type="button" onClick={() => remove(i)} className={btnIcon} aria-label="Remove">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {q.links.map((l, li) => (
              <div key={li} className="grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr_1fr_auto]">
                <input
                  value={l.id}
                  onChange={(e) =>
                    update(i, {
                      links: q.links.map((x, idx) => (idx === li ? { ...x, id: e.target.value } : x)),
                    })
                  }
                  placeholder="link id"
                  className={inputCls}
                />
                <input
                  value={l.name}
                  onChange={(e) =>
                    update(i, {
                      links: q.links.map((x, idx) => (idx === li ? { ...x, name: e.target.value } : x)),
                    })
                  }
                  placeholder="Server name"
                  className={inputCls}
                />
                <input
                  value={(l as { url?: string }).url ?? ""}
                  onChange={(e) =>
                    update(i, {
                      links: q.links.map((x, idx) =>
                        idx === li ? ({ ...x, url: e.target.value } as typeof x & { url: string }) : x,
                      ),
                    })
                  }
                  placeholder="Real URL (saved separately)"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() =>
                    update(i, { links: q.links.filter((_, idx) => idx !== li) })
                  }
                  className={btnIcon}
                  aria-label="Remove link"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                update(i, {
                  links: [...q.links, { id: crypto.randomUUID().slice(0, 8), name: "Server 1", ...({} as object) } as never],
                })
              }
              className={btnSm}
            >
              <Plus className="h-3 w-3" /> Add link
            </button>
          </div>
        </div>
      ))}
      {qualities.length === 0 && (
        <p className="text-xs text-muted-foreground">No qualities added.</p>
      )}
    </div>
  );
}

export function SeasonEditor({
  seasons,
  onChange,
}: {
  seasons: Season[];
  onChange: (s: Season[]) => void;
}) {
  const update = (i: number, patch: Partial<Season>) =>
    onChange(seasons.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const remove = (i: number) => onChange(seasons.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([
      ...seasons,
      { seasonNumber: (seasons.at(-1)?.seasonNumber ?? 0) + 1, episodes: [] },
    ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Seasons</h4>
        <button type="button" onClick={add} className={btnSm}>
          <Plus className="h-3 w-3" /> Add season
        </button>
      </div>
      {seasons.map((season, i) => {
        const hasZip = Array.isArray(season.seasonZip);
        return (
          <div key={i} className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className={labelCls}>Season #</span>
              <input
                type="number"
                value={season.seasonNumber}
                onChange={(e) => update(i, { seasonNumber: Number(e.target.value) })}
                className={inputCls + " max-w-[100px]"}
              />
              <button type="button" onClick={() => remove(i)} className={btnIcon} aria-label="Remove season">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* OPTIONAL season ZIP */}
            <div className="mb-4 rounded-xl border border-border/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Season ZIP (optional)</span>
                {hasZip ? (
                  <button
                    type="button"
                    onClick={() => update(i, { seasonZip: undefined })}
                    className={btnSm}
                  >
                    Remove ZIP section
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => update(i, { seasonZip: [] })}
                    className={btnSm}
                  >
                    <Plus className="h-3 w-3" /> Add ZIP section
                  </button>
                )}
              </div>
              {hasZip && (
                <QualityEditor
                  title="ZIP qualities"
                  qualities={season.seasonZip ?? []}
                  onChange={(zq) => update(i, { seasonZip: zq })}
                />
              )}
            </div>

            {/* Episodes */}
            <EpisodesEditor
              episodes={season.episodes}
              onChange={(eps) => update(i, { episodes: eps })}
            />
          </div>
        );
      })}
      {seasons.length === 0 && <p className="text-xs text-muted-foreground">No seasons.</p>}
    </div>
  );
}

function EpisodesEditor({
  episodes,
  onChange,
}: {
  episodes: Season["episodes"];
  onChange: (e: Season["episodes"]) => void;
}) {
  const update = (i: number, patch: Partial<Season["episodes"][number]>) =>
    onChange(episodes.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const remove = (i: number) => onChange(episodes.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([
      ...episodes,
      { episodeNumber: (episodes.at(-1)?.episodeNumber ?? 0) + 1, qualities: [] },
    ]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold">Episodes</h5>
        <button type="button" onClick={add} className={btnSm}>
          <Plus className="h-3 w-3" /> Add episode
        </button>
      </div>
      {episodes.map((ep, i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className={labelCls}>Episode #</span>
            <input
              type="number"
              value={ep.episodeNumber}
              onChange={(e) => update(i, { episodeNumber: Number(e.target.value) })}
              className={inputCls + " max-w-[100px]"}
            />
            <button type="button" onClick={() => remove(i)} className={btnIcon}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <QualityEditor
            qualities={ep.qualities}
            onChange={(q) => update(i, { qualities: q })}
          />
        </div>
      ))}
    </div>
  );
}

// Convenience: simple controlled text input for forms
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const [, setLocal] = useState(value);
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className={inputCls + " mt-1"}
      />
    </label>
  );
}
