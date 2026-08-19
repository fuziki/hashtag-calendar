import { useEffect, useState } from "react";
import { parseAlmanac, type MonthBlock } from "../lib/almanac";

export interface AlmanacState {
  readonly months: readonly MonthBlock[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

/** `public/hashtags.md` を fetch してパースする */
export function useAlmanac(): AlmanacState {
  const [state, setState] = useState<AlmanacState>({ months: [], isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const url = `${import.meta.env.BASE_URL}hashtags.md`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`hashtags.md の取得に失敗しました (status: ${response.status})`);
        }
        return response.text();
      })
      .then((text) => {
        if (cancelled) return;
        setState({ months: parseAlmanac(text), isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "データの読み込みに失敗しました";
        setState({ months: [], isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
