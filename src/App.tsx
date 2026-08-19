import { useMemo, useRef } from "react";
import { MonthNav } from "./components/MonthNav";
import { MonthSection } from "./components/MonthSection";
import { ThemeToggle } from "./components/ThemeToggle";
import { TodayPanel } from "./components/TodayPanel";
import { useActiveMonth } from "./hooks/useActiveMonth";
import { useAlmanac } from "./hooks/useAlmanac";
import { useColorScheme } from "./hooks/useColorScheme";
import { useNavMetrics } from "./hooks/useNavMetrics";
import { useNavStuck } from "./hooks/useNavStuck";
import { computeTodayPanel, type AlmanacEntry } from "./lib/almanac";
import { FONT_SANS } from "./lib/theme";

function scrollToMonth(month: string): void {
  document.getElementById(`m-${month}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function App() {
  const { months, isLoading, error } = useAlmanac();
  const { mode, cycle } = useColorScheme();

  const flatEntries = useMemo<readonly AlmanacEntry[]>(() => months.flatMap((block) => block.entries), [months]);
  const monthNames = useMemo(() => months.map((block) => block.month), [months]);

  const navRef = useRef<HTMLDivElement>(null);
  const navSentinelRef = useRef<HTMLDivElement>(null);
  const { oneRow, height: navHeight } = useNavMetrics(navRef);
  const navStuck = useNavStuck(navSentinelRef);
  const activeMonth = useActiveMonth(monthNames, navRef);
  const scrollOffset = navHeight + 16; // カプセル上の余白(pt-2=8px) + バッファ(8px)

  const todayPanel = useMemo(() => computeTodayPanel(flatEntries, new Date()), [flatEntries]);
  const todayMonthLabel = `${new Date().getMonth() + 1}月`;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]" style={{ fontFamily: FONT_SANS }}>
      <div className="px-4 sm:px-6 pt-8 pb-4 flex items-start justify-between gap-4 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">日付ごとのハッシュタグネタ帳</h1>
          <p className="text-xs sm:text-sm mt-1 text-[var(--color-text-muted)]">
            SNSに投稿するときのネタ探し用に、日付ごとのハッシュタグをまとめました。
          </p>
        </div>
        <ThemeToggle mode={mode} onCycle={cycle} />
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        {months.map((block) => (
          <MonthSection key={block.month} block={block} scrollOffset={scrollOffset} />
        ))}

        <footer className="mt-6 pt-2 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="font-bold text-[var(--color-text-muted)]">日付ごとのハッシュタグネタ帳</span>
          <span className="text-[var(--color-text-subtle)]">個人メモとして収集した記念日一覧です・随時更新</span>
        </footer>

        {/* 12月のように短いセクションでも見出しがナビ直下のラインまで届くよう確保する余白 */}
        <div aria-hidden="true" style={{ minHeight: "70vh" }} />
      </div>
    </div>
  );
}

export default App;
