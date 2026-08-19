import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hashtag-calendar:theme-mode";

/** "system" = 端末設定に追従、それ以外は手動で固定したテーマ */
export type ColorSchemeMode = "system" | "dark" | "light";

const CYCLE: readonly ColorSchemeMode[] = ["system", "dark", "light"];

function readStoredMode(): ColorSchemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "dark" || raw === "light" ? raw : "system";
  } catch {
    return "system";
  }
}

function prefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export interface ColorScheme {
  readonly mode: ColorSchemeMode;
  readonly isDark: boolean;
  readonly cycle: () => void;
}

/**
 * 端末のライト/ダーク設定に自動追従する「システム設定」を起点に、
 * 「システム設定 → ダーク → ライト → システム設定 …」の順で手動固定を巡回する。
 * 手動固定は localStorage に保存し、次回訪問時にも維持する(「システム設定」時は保存しない)。
 */
export function useColorScheme(): ColorScheme {
  const [systemDark, setSystemDark] = useState<boolean>(prefersDark);
  const [mode, setMode] = useState<ColorSchemeMode>(readStoredMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isDark = mode === "system" ? systemDark : mode === "dark";

  const cycle = useCallback(() => {
    setMode((current) => {
      const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length] ?? "system";
      try {
        if (next === "system") {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, next);
        }
      } catch {
        // private mode 等で localStorage が使えない場合は永続化を諦める
      }
      return next;
    });
  }, []);

  return { mode, isDark, cycle };
}
