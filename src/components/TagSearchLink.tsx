import { ExternalLink } from "lucide-react";
import { xSearchUrl } from "../lib/almanac";

interface TagSearchLinkProps {
  readonly tags: readonly string[];
}

export function TagSearchLink({ tags }: TagSearchLinkProps) {
  return (
    <a
      href={xSearchUrl(tags)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium shrink-0 px-2 py-1 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:opacity-70"
    >
      Xで検索 <ExternalLink size={11} />
    </a>
  );
}
