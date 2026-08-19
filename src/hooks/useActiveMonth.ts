import { useEffect, useState, type RefObject } from "react";

interface MonthTarget {
  readonly month: string;
  readonly el: HTMLElement;
}

/**
 * 目次(月ナビ)のハイライト対象を判定する。
 * 月ごとにエントリ数が異なりセクションの高さがバラバラなため IntersectionObserver では
 * 精度が出しにくく、代わりに「ナビ直下のラインを、上から順にどの見出しが最後に通過したか」を
 * scroll イベント(rAFでスロットリング)で判定する。
 */
export function useActiveMonth(
  months: readonly string[],
  navRef: RefObject<HTMLElement | null>,
): string | undefined {
  const [activeMonth, setActiveMonth] = useState<string | undefined>(months[0]);

  useEffect(() => {
    const targets: MonthTarget[] = months.flatMap((month) => {
      const el = document.getElementById(`m-${month}`);
      return el ? [{ month, el }] : [];
    });
    const firstTarget = targets[0];
    if (!firstTarget) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const line = (navRef.current?.getBoundingClientRect().height ?? 0) + 16;
      let current = firstTarget.month;
      for (const target of targets) {
        if (target.el.getBoundingClientRect().top <= line) {
          current = target.month;
        } else {
          break;
        }
      }
      setActiveMonth(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [months, navRef]);

  return activeMonth;
}
