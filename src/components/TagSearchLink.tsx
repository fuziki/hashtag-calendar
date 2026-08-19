import { ExternalLink } from "lucide-react";
import { parseDate, resolveRecentOccurrence, xSearchUrl } from "../lib/almanac";

interface TagSearchLinkProps {
  readonly tags: readonly string[];
  /** `"6月2日"` のようなエントリの日付文字列。直近の発生日に絞って検索するために使う */
  readonly date: string;
}

export function TagSearchLink({ tags, date }: TagSearchLinkProps) {
  const parsed = parseDate(date);
  const targetDate = parsed ? resolveRecentOccurrence(parsed, new Date()) : new Date();

  return (
    <a
      href={xSearchUrl(tags, targetDate)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium shrink-0 px-2 py-1 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:opacity-70"
    >
      Xで検索 <ExternalLink size={11} />
    </a>
  );
}
