import { useEffect, useState, type RefObject } from "react";

const SAFETY_BUFFER = 24; // px: 要素間マージン等の計算誤差を吸収する余白

/**
 * 一番下までスクロールしたときに、最後の月のセクション見出しがナビ直下のラインに来るよう、
 * フッターの下に確保する余白 = (ビューポート高さ) - (最後のセクションの高さ) - (フッター本体の高さ) を実測して求める。
 */
export function useFooterPadding(
  lastMonth: string | undefined,
  footerContentRef: RefObject<HTMLElement | null>,
): number {
  const [padding, setPadding] = useState(0);

  useEffect(() => {
    if (!lastMonth) return;
    const sectionEl = document.getElementById(`m-${lastMonth}`);
    const footerEl = footerContentRef.current;
    if (!sectionEl || !footerEl) return;

    const recalc = () => {
      const viewportHeight = window.innerHeight;
      const sectionHeight = sectionEl.getBoundingClientRect().height;
      const footerHeight = footerEl.getBoundingClientRect().height;
      setPadding(Math.max(0, viewportHeight - sectionHeight - footerHeight) + SAFETY_BUFFER);
    };

    recalc();

    const observer = new ResizeObserver(recalc);
    observer.observe(sectionEl);
    observer.observe(footerEl);
    window.addEventListener("resize", recalc);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [lastMonth, footerContentRef]);

  return padding;
}
