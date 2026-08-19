import { ACCENT_COLORS, ACCENT_LABEL, ACCENT_SWATCH, type AccentColor } from "../lib/theme";

const NAV_PAD = 6; // px: MonthNavの外枠パディングと揃える
const BTN_HEIGHT = 32; // px: ThemeModeControlのボタンと高さを揃える(外枠の角丸Rを一致させるため)
const DOT_SIZE = 20; // px: 通常時の丸の直径
const DOT_SIZE_ACTIVE = 14; // px: 選択中は一回り小さくする

interface AccentColorPickerProps {
  readonly accent: AccentColor;
  readonly onChange: (accent: AccentColor) => void;
}

/** MonthNavと同じガラス質感の座布団を持つセグメントコントロール(常時ガラス表示) */
export function AccentColorPicker({ accent, onChange }: AccentColorPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="アクセントカラー"
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
      <div className="grid grid-cols-5 gap-1">
        {ACCENT_COLORS.map((color) => {
          const active = color === accent;
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={ACCENT_LABEL[color]}
              title={ACCENT_LABEL[color]}
              onClick={() => onChange(color)}
              className="flex items-center justify-center transition-all duration-200 hover:opacity-80"
              style={{ height: BTN_HEIGHT, borderRadius: 9999 }}
            >
              <span
                aria-hidden="true"
                className="rounded-full transition-all duration-200"
                style={{
                  width: active ? DOT_SIZE_ACTIVE : DOT_SIZE,
                  height: active ? DOT_SIZE_ACTIVE : DOT_SIZE,
                  background: ACCENT_SWATCH[color],
                  boxShadow: active ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${ACCENT_SWATCH[color]}` : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
