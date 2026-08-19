import { useCallback, useEffect, useState } from "react";
import { ACCENT_COLORS, type AccentColor } from "../lib/theme";

const STORAGE_KEY = "hashtag-calendar:accent-color";
const DEFAULT_ACCENT: AccentColor = "red";

function isAccentColor(value: string | null): value is AccentColor {
  return value !== null && (ACCENT_COLORS as readonly string[]).includes(value);
}

function readStoredAccent(): AccentColor {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isAccentColor(raw) ? raw : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

export interface AccentColorState {
  readonly accent: AccentColor;
  readonly setAccent: (accent: AccentColor) => void;
}

/** 選択したアクセントカラーを localStorage に保存しつつ、`<html data-accent>` へ反映する */
export function useAccentColor(): AccentColorState {
  const [accent, setAccentState] = useState<AccentColor>(readStoredAccent);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  const setAccent = useCallback((next: AccentColor) => {
    setAccentState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // private mode 等で localStorage が使えない場合は永続化を諦める
    }
  }, []);

  return { accent, setAccent };
}
