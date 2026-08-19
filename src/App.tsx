import { useMemo, useRef } from "react";
import { AccentColorPicker } from "./components/AccentColorPicker";
import { MonthNav } from "./components/MonthNav";
import { MonthSection } from "./components/MonthSection";
import { ThemeModeControl } from "./components/ThemeModeControl";
import { TodayPanel } from "./components/TodayPanel";
import { useAccentColor } from "./hooks/useAccentColor";
import { useActiveMonth } from "./hooks/useActiveMonth";
import { useAlmanac } from "./hooks/useAlmanac";
import { useColorScheme } from "./hooks/useColorScheme";
import { useFooterPadding } from "./hooks/useFooterPadding";
import { useNavMetrics } from "./hooks/useNavMetrics";
import { useNavStuck } from "./hooks/useNavStuck";
import { computeTodayPanel, type AlmanacEntry } from "./lib/almanac";
import { FONT_SANS } from "./lib/theme";

function scrollToMonth(month: string): void {
  document.getElementById(`m-${month}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function App() {
  const { months, isLoading, error } = useAlmanac();
  const { mode, setMode } = useColorScheme();
  const { accent, setAccent } = useAccentColor();

  const flatEntries = useMemo<readonly AlmanacEntry[]>(() => months.flatMap((block) => block.entries), [months]);
  const monthNames = useMemo(() => months.map((block) => block.month), [months]);
  const lastMonth = monthNames[monthNames.length - 1];

  const navRef = useRef<HTMLDivElement>(null);
  const navSentinelRef = useRef<HTMLDivElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const { oneRow, height: navHeight } = useNavMetrics(navRef);
  const navStuck = useNavStuck(navSentinelRef);
  const activeMonth = useActiveMonth(monthNames, navRef);
  const scrollOffset = navHeight + 16; // カプセル上の余白(pt-2=8px) + バッファ(8px)
  const footerPadding = useFooterPadding(lastMonth, footerContentRef);

  const todayPanel = useMemo(() => computeTodayPanel(flatEntries, new Date()), [flatEntries]);
  const todayMonthLabel = `${new Date().getMonth() + 1}月`;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]" style={{ fontFamily: FONT_SANS }}>
      <div className="px-4 sm:px-6 pt-8 pb-4 max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">日付ごとのハッシュタグネタ帳</h1>
        <p className="text-xs sm:text-sm mt-1 text-[var(--color-text-muted)]">
          SNSに投稿するときのネタ探し用に、日付ごとのハッシュタグをまとめました。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {error && (
          <p className="px-3 py-3 sm:px-4 rounded-md mb-6 text-sm bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]">
            {error}
          </p>
        )}
        {!error && isLoading && (
          <p className="px-3 py-3 sm:px-4 rounded-md mb-6 text-sm bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]">
            読み込み中…
          </p>
        )}
        {!error && !isLoading && todayPanel && (
          <TodayPanel
            badgeLabel={todayPanel.badgeLabel}
            head={todayPanel.head}
            rest={todayPanel.rest}
            onJumpToCurrentMonth={() => scrollToMonth(todayMonthLabel)}
          />
        )}
      </div>

      <MonthNav
        months={monthNames}
        activeMonth={activeMonth}
        onSelect={scrollToMonth}
        navStuck={navStuck}
        oneRow={oneRow}
        navRef={navRef}
        sentinelRef={navSentinelRef}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {months.map((block) => (
          <MonthSection key={block.month} block={block} scrollOffset={scrollOffset} />
        ))}

        <footer className="mt-6 pt-2" style={{ paddingBottom: footerPadding }}>
          <div ref={footerContentRef} className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-[var(--color-text)]">設定</h2>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">テーマ</h3>
              <ThemeModeControl mode={mode} onChange={setMode} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">アクセントカラー</h3>
              <AccentColorPicker accent={accent} onChange={setAccent} />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
