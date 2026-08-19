import { useEffect, useState } from "react";
import { parseAlmanac, type MonthBlock } from "../lib/almanac";

export interface AlmanacState {
  readonly months: readonly MonthBlock[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

/** `hashtags.enc` の中身を復号する */
function decodePayload(payload: string): string {
  const binary = atob(payload.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** `public/hashtags.enc` を fetch し、復号してからパースする */
export function useAlmanac(): AlmanacState {
  const [state, setState] = useState<AlmanacState>({ months: [], isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const url = `${import.meta.env.BASE_URL}hashtags.enc`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`hashtags.enc の取得に失敗しました (status: ${response.status})`);
        }
        return response.text();
      })
      .then((payload) => {
        if (cancelled) return;
        setState({ months: parseAlmanac(decodePayload(payload)), isLoading: false, error: null });
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
