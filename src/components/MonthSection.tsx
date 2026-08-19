import { groupByDate, hasHashtag, type MonthBlock } from "../lib/almanac";
import { FONT_MONO } from "../lib/theme";
import { TagSearchLink } from "./TagSearchLink";

interface MonthSectionProps {
  readonly block: MonthBlock;
  readonly scrollOffset: number;
}

export function MonthSection({ block, scrollOffset }: MonthSectionProps) {
  return (
    <section id={`m-${block.month}`} style={{ scrollMarginTop: scrollOffset }}>
      <h2 className="text-lg font-bold pt-8 pb-2 text-[var(--color-accent-text)] border-b-2 border-[var(--color-accent-border)]">
        {block.month}
      </h2>

      {groupByDate(block.entries).map((group) => {
        const [firstItem, ...restItems] = group.items;
        if (!firstItem) return null;
        const single = restItems.length === 0;
        return (
          <div key={group.date} className="py-3 border-b border-[var(--color-border)]">
            {single ? (
              <div className="flex items-center gap-3">
                <span
                  className="tabular-nums text-sm sm:text-base font-bold shrink-0 text-[var(--color-text-muted)]"
                  style={{ fontFamily: FONT_MONO }}
                >
                  {group.date}
                </span>
                <span className="flex-1 min-w-0 break-words text-sm sm:text-base font-bold text-[var(--color-accent-text)]">
                  {firstItem.tags.join(" / ")}
                </span>
                {hasHashtag(firstItem.tags) && <TagSearchLink tags={firstItem.tags} />}
              </div>
            ) : (
              <span
                className="tabular-nums text-sm sm:text-base font-bold text-[var(--color-text-muted)]"
                style={{ fontFamily: FONT_MONO }}
              >
                {group.date}
              </span>
            )}

            {single ? (
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)]">
                {firstItem.description}
              </p>
            ) : (
              <div className="mt-2 space-y-3">
                {group.items.map((item) => (
                  <div key={item.tags.join()}>
                    <div className="flex items-center gap-3">
                      <span className="flex-1 min-w-0 break-words text-sm sm:text-base font-bold text-[var(--color-accent-text)]">
                        {item.tags.join(" / ")}
                      </span>
                      {hasHashtag(item.tags) && <TagSearchLink tags={item.tags} />}
                    </div>
                    <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
