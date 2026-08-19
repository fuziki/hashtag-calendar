import { useEffect, useState, type RefObject } from "react";

/**
 * ナビ直前に置いた1pxのセンチネル要素が画面外に出たかどうかを監視する。
 * 出た = ナビが本来の位置から押し上げられてコンテンツに被り始めた、とみなし
 * Liquid Glass風のガラス質感をオンにするトリガーとして使う。
 */
export function useNavStuck(sentinelRef: RefObject<HTMLElement | null>): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(entry !== undefined && !entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelRef]);

  return stuck;
}
