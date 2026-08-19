import { useMemo, useRef } from "react";
import { MonthNav } from "./components/MonthNav";
import { MonthSection } from "./components/MonthSection";
import { ThemeToggle } from "./components/ThemeToggle";
import { TodayPanel, type TodayBadgeLabel } from "./components/TodayPanel";
import { useActiveMonth } from "./hooks/useActiveMonth";
import { useAlmanac } from "./hooks/useAlmanac";
import { useColorScheme } from "./hooks/useColorScheme";
import { useNavMetrics } from "./hooks/useNavMetrics";
import { useNavStuck } from "./hooks/useNavStuck";
import { parseDate, type AlmanacEntry } from "./lib/almanac";
import { DARK_THEME, FONT_SANS, LIGHT_THEME } from "./lib/theme";

function scrollToMonth(month: string): void {
  document.getElementById(`m-${month}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function App() {
  const { months, isLoading, error } = useAlmanac();
  const { mode, isDark, cycle } = useColorScheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  const flatEntries = useMemo<readonly AlmanacEntry[]>(() => months.flatMap((block) => block.entries), [months]);
  const monthNames = useMemo(() => months.map((block) => block.month), [months]);

  const navRef = useRef<HTMLDivElement>(null);
  const navSentinelRef = useRef<HTMLDivElement>(null);
  const { oneRow, height: navHeight } = useNavMetrics(navRef);
  const navStuck = useNavStuck(navSentinelRef);
  const activeMonth = useActiveMonth(monthNames, navRef);
  const scrollOffset = navHeight + 16; // カプセル上の余白(pt-2=8px) + バッファ(8px)

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const todayMonthLabel = `${todayMonth}月`;

  const exactToday = flatEntries.filter((entry) => {
    const parsed = parseDate(entry.date);
    return parsed !== null && parsed.month === todayMonth && parsed.day === todayDay;
  });
  const nextUp =
    flatEntries.find((entry) => {
      const parsed = parseDate(entry.date);
      if (!parsed) return false;
      return parsed.month > todayMonth || (parsed.month === todayMonth && parsed.day > todayDay);
    }) ?? flatEntries[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowMonth = tomorrow.getMonth() + 1;
  const tomorrowDay = tomorrow.getDate();
  const nextUpDate = nextUp ? parseDate(nextUp.date) : null;
  const isNextUpTomorrow =
    nextUpDate !== null && nextUpDate.month === tomorrowMonth && nextUpDate.day === tomorrowDay;

  const badgeLabel: TodayBadgeLabel = exactToday.length > 0 ? "本日" : isNextUpTomorrow ? "明日" : "次";

  const todayPanelItems = exactToday.length > 0 ? exactToday : nextUp ? [nextUp] : [];
  const [todayHead, ...todayRest] = todayPanelItems;

  return (
    <div
      style={{ background: theme.bg, color: theme.text, fontFamily: FONT_SANS, minHeight: "100vh" }}
    >
      <style>{`
        * { box-sizing: border-box; }
        a:focus-visible, button:focus-visible {
          outline: 2px solid ${theme.accentSolid};
          outline-offset: 2px;
        }
      `}</style>

      <div className="px-4 sm:px-6 pt-8 pb-4 flex items-start justify-between gap-4 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">日付ごとのハッシュタグネタ帳</h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: theme.textMuted }}>
            SNSに投稿するときのネタ探し用に、日付ごとのハッシュタグをまとめました。
          </p>
        </div>
        <ThemeToggle mode={mode} theme={theme} onCycle={cycle} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {error && (
          <p
            className="px-3 py-3 sm:px-4 rounded-md mb-6 text-sm"
            style={{ background: theme.bgSubtle, color: theme.textMuted }}
          >
            {error}
          </p>
        )}
        {!error && isLoading && (
          <p
            className="px-3 py-3 sm:px-4 rounded-md mb-6 text-sm"
            style={{ background: theme.bgSubtle, color: theme.textMuted }}
          >
            読み込み中…
          </p>
        )}
        {!error && !isLoading && todayHead && (
          <TodayPanel
            theme={theme}
            badgeLabel={badgeLabel}
            head={todayHead}
            rest={todayRest}
            onJumpToCurrentMonth={() => scrollToMonth(todayMonthLabel)}
          />
        )}
      </div>

      <MonthNav
        months={monthNames}
        activeMonth={activeMonth}
        onSelect={scrollToMonth}
        theme={theme}
        isDark={isDark}
        navStuck={navStuck}
        oneRow={oneRow}
        navRef={navRef}
        sentinelRef={navSentinelRef}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        {months.map((block) => (
          <MonthSection key={block.month} block={block} theme={theme} scrollOffset={scrollOffset} />
        ))}

        <footer className="mt-6 pt-2 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="font-bold" style={{ color: theme.textMuted }}>
            日付ごとのハッシュタグネタ帳
          </span>
          <span style={{ color: theme.textSubtle }}>個人メモとして収集した記念日一覧です・随時更新</span>
        </footer>

        {/* 12月のように短いセクションでも見出しがナビ直下のラインまで届くよう確保する余白 */}
        <div aria-hidden="true" style={{ minHeight: "70vh" }} />
      </div>
    </div>
  );
}

export default App;
