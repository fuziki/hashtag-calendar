import type { AlmanacEntry } from "../lib/almanac";
import type { ThemeTokens } from "../lib/theme";

export type TodayBadgeLabel = "本日" | "明日" | "次";

interface TodayPanelProps {
  readonly theme: ThemeTokens;
  readonly badgeLabel: TodayBadgeLabel;
  readonly head: AlmanacEntry;
  readonly rest: readonly AlmanacEntry[];
  readonly onJumpToCurrentMonth: () => void;
}

export function TodayPanel({ theme, badgeLabel, head, rest, onJumpToCurrentMonth }: TodayPanelProps) {
  // 「次」は正方形、「本日」「明日」は横長の固定幅バッジ
  const badgeWidth = badgeLabel === "次" ? 28 : 40;
  // バッジ幅 + gap-2(8px) 分、日付の開始位置と説明文の先頭を揃える
  const indent = badgeWidth + 8;

  return (
    <div className="px-3 py-3 sm:px-4 rounded-md mb-6" style={{ background: theme.accentBg }}>
      <div className="flex items-center gap-2 text-sm tabular-nums flex-wrap">
        <span
          className="text-xs font-bold rounded shrink-0 inline-flex items-center justify-center"
          style={{ background: theme.accentSolid, color: theme.onAccentSolid, width: badgeWidth, height: 28 }}
        >
          {badgeLabel}
        </span>
        <span style={{ color: theme.textSubtle }}>{head.date}</span>
        <span className="font-semibold" style={{ color: theme.accentText }}>
          {head.tags.join(" / ")}
        </span>
        <button
          type="button"
          onClick={onJumpToCurrentMonth}
          className="ml-auto text-xs font-medium underline underline-offset-2 shrink-0"
          style={{ color: theme.text }}
        >
          今月へジャンプ
        </button>
      </div>
      <p
        className="mt-1 text-xs sm:text-sm leading-relaxed"
        style={{ color: theme.textMuted, paddingLeft: indent }}
      >
        {head.description}
      </p>

      {rest.length > 0 && (
        <div className="mt-2 space-y-2">
          {rest.map((entry) => (
            <div key={entry.date + entry.tags.join()}>
              <div className="text-sm font-semibold" style={{ color: theme.accentText }}>
                {entry.tags.join(" / ")}
              </div>
              <p className="text-xs sm:text-sm mt-0.5 leading-relaxed" style={{ color: theme.textMuted }}>
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
