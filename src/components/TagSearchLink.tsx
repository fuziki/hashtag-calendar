import { ExternalLink } from "lucide-react";
import { xSearchUrl } from "../lib/almanac";
import type { ThemeTokens } from "../lib/theme";

interface TagSearchLinkProps {
  readonly tags: readonly string[];
  readonly theme: ThemeTokens;
}

export function TagSearchLink({ tags, theme }: TagSearchLinkProps) {
  return (
    <a
      href={xSearchUrl(tags)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium shrink-0 px-2 py-1 rounded-md border transition hover:opacity-70"
      style={{ borderColor: theme.border, color: theme.textMuted }}
    >
      Xで検索 <ExternalLink size={11} />
    </a>
  );
}
