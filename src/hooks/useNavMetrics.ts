import { useEffect, useState, type RefObject } from "react";

/** 12個のボタンが窮屈にならず1行に並ぶのに必要な目安幅(px) */
const MIN_WIDTH_FOR_ONE_ROW = 620;

export interface NavMetrics {
  readonly oneRow: boolean;
  readonly height: number;
}

/**
 * 月ナビの実測幅/高さを ResizeObserver で監視する。
 * Tailwindのブレークポイントに頼らず、ナビ自身の実際のコンテナ幅で行数を判定する。
 */
export function useNavMetrics(ref: RefObject<HTMLElement | null>): NavMetrics {
  const [metrics, setMetrics] = useState<NavMetrics>({ oneRow: true, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setMetrics({ oneRow: rect.width >= MIN_WIDTH_FOR_ONE_ROW, height: rect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return metrics;
}
