import { useMemo } from "react";
import { parseAlmanac, type MonthBlock } from "../lib/almanac";

export interface AlmanacState {
  readonly months: readonly MonthBlock[];
  readonly error: string | null;
}

/** ビルド時にHTMLへ埋め込まれた Base64 を復号する */
function decodePayload(payload: string): string {
  const binary = atob(payload.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function loadAlmanac(): AlmanacState {
  const payload = document.getElementById("almanac-data")?.textContent;
  if (!payload) {
    return { months: [], error: "埋め込みデータが見つかりませんでした" };
  }
  try {
    return { months: parseAlmanac(decodePayload(payload)), error: null };
  } catch {
    return { months: [], error: "データの読み込みに失敗しました" };
  }
}

/** HTMLに埋め込まれた `#almanac-data` を読み、復号・パースする（fetch不要） */
export function useAlmanac(): AlmanacState {
  return useMemo(() => loadAlmanac(), []);
}
