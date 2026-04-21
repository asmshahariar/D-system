import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

export function SavedLinkBanner({ path, label = "Public page" }: { path: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? window.location.origin + path : path;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
        ✓ Saved — {label}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <code className="flex-1 min-w-[200px] truncate rounded-lg bg-background/60 px-3 py-2 text-xs">
          {fullUrl}
        </code>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-primary"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open
        </a>
      </div>
    </div>
  );
}
