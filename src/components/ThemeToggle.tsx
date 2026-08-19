import { Monitor, Moon, Sun } from "lucide-react";
import type { ColorSchemeMode } from "../hooks/useColorScheme";
import type { ThemeTokens } from "../lib/theme";

const LABEL: Record<ColorSchemeMode, string> = {
  system: "テーマ: システム設定",
  dark: "テーマ: ダーク",
  light: "テーマ: ライト",
};

interface ThemeToggleProps {
  readonly mode: ColorSchemeMode;
  readonly theme: ThemeTokens;
  readonly onCycle: () => void;
}

export function ThemeToggle({ mode, theme, onCycle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={LABEL[mode]}
      title={LABEL[mode]}
      className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md border transition hover:opacity-70"
      style={{ borderColor: theme.border, color: theme.textMuted }}
    >
      {mode === "system" && <Monitor size={16} />}
      {mode === "dark" && <Moon size={16} />}
      {mode === "light" && <Sun size={16} />}
    </button>
  );
}
