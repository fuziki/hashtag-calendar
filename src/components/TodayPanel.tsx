import type { AlmanacEntry, TodayBadgeLabel } from "../lib/almanac";

interface TodayPanelProps {
  readonly badgeLabel: TodayBadgeLabel;
  readonly head: AlmanacEntry;
  readonly rest: readonly AlmanacEntry[];
  readonly onJumpToCurrentMonth: () => void;
}

export function TodayPanel({ badgeLabel, head, rest, onJumpToCurrentMonth }: TodayPanelProps) {
  // 「次」は正方形、「本日」「明日」は横長の固定幅バッジ
  const badgeWidth = badgeLabel === "次" ? 28 : 40;
  // バッジ幅 + gap-2(8px) 分、日付の開始位置と説明文の先頭を揃える
  const indent = badgeWidth + 8;

  return (
    <div className="px-3 py-3 sm:px-4 rounded-md mb-6 bg-[var(--color-accent-bg)]">
      <div className="flex items-center gap-2 text-sm tabular-nums flex-wrap">
        <span
          className="text-xs font-bold rounded shrink-0 inline-flex items-center justify-center bg-[var(--color-accent-solid)] text-[var(--color-on-accent-solid)]"
          style={{ width: badgeWidth, height: 28 }}
        >
          {badgeLabel}
        </span>
        <span className="text-[var(--color-text-subtle)]">{head.date}</span>
        <span className="font-semibold text-[var(--color-accent-text)]">{head.tags.join(" / ")}</span>
        <button
          type="button"
          onClick={onJumpToCurrentMonth}
          className="ml-auto text-xs font-medium underline underline-offset-2 shrink-0 text-[var(--color-text)]"
        >
          今月へジャンプ
        </button>
      </div>
      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)]" style={{ paddingLeft: indent }}>
        {head.description}
      </p>

      {rest.length > 0 && (
        <div className="mt-2 space-y-2">
          {rest.map((entry) => (
            <div key={entry.date + entry.tags.join()}>
              <div className="text-sm font-semibold text-[var(--color-accent-text)]">
                {entry.tags.join(" / ")}
              </div>
              <p className="text-xs sm:text-sm mt-0.5 leading-relaxed text-[var(--color-text-muted)]">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
