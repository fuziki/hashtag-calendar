export const FONT_SANS =
  'system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif';
export const FONT_MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

/** 選択可能なアクセントカラー。実際の色値は index.css の `[data-accent]` 側で定義する */
export const ACCENT_COLORS = ["red", "green", "yellow", "blue", "pink"] as const;
export type AccentColor = (typeof ACCENT_COLORS)[number];

export const ACCENT_LABEL: Record<AccentColor, string> = {
  red: "赤",
  green: "緑",
  yellow: "黄色",
  blue: "青",
  pink: "ピンク",
};

/** 選択スウォッチ表示用の代表色（現在のテーマに関わらず常に同じ色を示す） */
export const ACCENT_SWATCH: Record<AccentColor, string> = {
  red: "#c6433a",
  green: "#2f8956",
  yellow: "#b4870f",
  blue: "#3b62b0",
  pink: "#c64592",
};
