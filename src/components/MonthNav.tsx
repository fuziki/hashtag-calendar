import type { RefObject } from "react";

const NAV_PAD = 6; // px: 外枠の内側パディング(全辺共通)
const BTN_HALF_HEIGHT = 16; // px: ボタンの実測高さ(約32px)の半分 = カプセル時の実効角丸半径
const BTN_RADIUS = 9999; // 選択状態のカプセルは行数によらず常にフルラウンド

interface MonthNavProps {
  readonly months: readonly string[];
  readonly activeMonth: string | undefined;
  readonly onSelect: (month: string) => void;
  readonly navStuck: boolean;
  readonly oneRow: boolean;
  readonly navRef: RefObject<HTMLDivElement | null>;
  readonly sentinelRef: RefObject<HTMLDivElement | null>;
}

/**
 * iOS Liquid Glass 風のセグメントコントロール。1行のときは丸ピル、2行のときは角丸四角にし、
 * 外枠とボタンのコーナーが同心円状(平行)に見えるよう半径を揃える。
 */
export function MonthNav({
  months,
  activeMonth,
  onSelect,
  navStuck,
  oneRow,
  navRef,
  sentinelRef,
}: MonthNavProps) {
  // 2行時は角丸四角。ボタンのカプセルと同心円になる半径
  const outerRadius = oneRow ? 9999 : BTN_HALF_HEIGHT + NAV_PAD;

  return (
    <>
      {/* ナビが「浮いているだけ」か「コンテンツと被っているか」を検知するセンチネル */}
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />

      <div className="sticky z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-2" style={{ top: 0 }}>
        <div
          ref={navRef}
          style={{
            background: navStuck ? "var(--color-glass-bg)" : "transparent",
            backdropFilter: navStuck ? "blur(20px) saturate(180%)" : "none",
            WebkitBackdropFilter: navStuck ? "blur(20px) saturate(180%)" : "none",
            border: `1px solid ${navStuck ? "var(--color-glass-border)" : "transparent"}`,
            boxShadow: navStuck ? "0 8px 24px rgba(0, 0, 0, 0.1)" : "none",
            borderRadius: outerRadius,
            padding: NAV_PAD,
            transition: "background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          }}
        >
          <div
            className="gap-1"
            style={{ display: "grid", gridTemplateColumns: `repeat(${oneRow ? 12 : 6}, minmax(0, 1fr))` }}
          >
            {months.map((month) => {
              const active = activeMonth === month;
              return (
                <button
                  key={month}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelect(month)}
                  className="tabular-nums text-xs sm:text-sm py-1.5 transition-all duration-200"
                  style={{
                    color: active ? "var(--color-nav-active-text)" : "var(--color-text-muted)",
                    background: active ? "var(--color-accent-bg)" : "transparent",
                    boxShadow: active ? "var(--shadow-nav)" : "none",
                    fontWeight: active ? 600 : 500,
                    borderRadius: BTN_RADIUS,
                  }}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
