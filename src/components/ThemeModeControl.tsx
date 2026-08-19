import type { ColorSchemeMode } from "../hooks/useColorScheme";

const NAV_PAD = 6; // px: MonthNavの外枠パディングと揃える
const BTN_HEIGHT = 32; // px: AccentColorPickerのボタンと高さを揃える(外枠の角丸Rを一致させるため)

const OPTIONS: readonly { readonly mode: ColorSchemeMode; readonly label: string }[] = [
  { mode: "system", label: "端末に従う" },
  { mode: "light", label: "ライト固定" },
  { mode: "dark", label: "ダーク固定" },
];

interface ThemeModeControlProps {
  readonly mode: ColorSchemeMode;
  readonly onChange: (mode: ColorSchemeMode) => void;
}

/** MonthNavと同じガラス質感のセグメントコントロールでテーマを切り替える(常時ガラス表示) */
export function ThemeModeControl({ mode, onChange }: ThemeModeControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label="テーマ"
      className="w-full max-w-sm"
      style={{
        background: "var(--color-glass-bg)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid var(--color-glass-border)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        borderRadius: 9999,
        padding: NAV_PAD,
      }}
    >
      <div className="grid grid-cols-3 gap-1">
        {OPTIONS.map((option) => {
          const active = option.mode === mode;
          return (
            <button
              key={option.mode}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.mode)}
              className="flex items-center justify-center tabular-nums text-xs sm:text-sm transition-all duration-200"
              style={{
                height: BTN_HEIGHT,
                color: active ? "var(--color-nav-active-text)" : "var(--color-text-muted)",
                background: active ? "var(--color-accent-bg)" : "transparent",
                boxShadow: active ? "var(--shadow-nav)" : "none",
                fontWeight: active ? 600 : 500,
                borderRadius: 9999,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
