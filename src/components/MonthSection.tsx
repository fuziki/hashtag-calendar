import { groupByDate, hasHashtag, type MonthBlock } from "../lib/almanac";
import { FONT_MONO, type ThemeTokens } from "../lib/theme";
import { TagSearchLink } from "./TagSearchLink";

interface MonthSectionProps {
  readonly block: MonthBlock;
  readonly theme: ThemeTokens;
  readonly scrollOffset: number;
}

export function MonthSection({ block, theme, scrollOffset }: MonthSectionProps) {
  return (
    <section id={`m-${block.month}`} style={{ scrollMarginTop: scrollOffset }}>
      <h2
        className="text-lg font-bold pt-8 pb-2"
        style={{ color: theme.accentText, borderBottom: `2px solid ${theme.accentBorder}` }}
      >
        {block.month}
      </h2>

      {groupByDate(block.entries).map((group) => {
        const [firstItem, ...restItems] = group.items;
        if (!firstItem) return null;
        const single = restItems.length === 0;
        return (
          <div key={group.date} className="py-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
            {single ? (
              <div className="flex items-center gap-3">
                <span
                  className="tabular-nums text-sm sm:text-base font-bold shrink-0"
                  style={{ fontFamily: FONT_MONO, color: theme.textMuted }}
                >
                  {group.date}
                </span>
                <span
                  className="flex-1 min-w-0 break-words text-sm sm:text-base font-bold"
                  style={{ color: theme.accentText }}
                >
                  {firstItem.tags.join(" / ")}
                </span>
                {hasHashtag(firstItem.tags) && <TagSearchLink tags={firstItem.tags} theme={theme} />}
              </div>
            ) : (
              <span
                className="tabular-nums text-sm sm:text-base font-bold"
                style={{ fontFamily: FONT_MONO, color: theme.textMuted }}
              >
                {group.date}
              </span>
            )}

            {single ? (
              <p className="mt-1 text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                {firstItem.description}
              </p>
            ) : (
              <div className="mt-2 space-y-3">
                {group.items.map((item) => (
                  <div key={item.tags.join()}>
                    <div className="flex items-center gap-3">
                      <span
                        className="flex-1 min-w-0 break-words text-sm sm:text-base font-bold"
                        style={{ color: theme.accentText }}
                      >
                        {item.tags.join(" / ")}
                      </span>
                      {hasHashtag(item.tags) && <TagSearchLink tags={item.tags} theme={theme} />}
                    </div>
                    <p className="mt-0.5 text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>
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
