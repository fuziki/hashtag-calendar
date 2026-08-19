/**
 * ニュートラル(無彩色) + 単一テーマカラー(えんじ色)の強調レベル別トークン。
 * accentBg(背景に薄く) → accentBorder(罫線) → accentText(文字) → accentSolid(塗り)
 * の4段階で強調度を使い分ける。ライト/ダークは色相を保ったまま明度だけ反転させる。
 */
export interface ThemeTokens {
  readonly bg: string;
  readonly bgSubtle: string;
  readonly border: string;
  readonly borderStrong: string;
  readonly text: string;
  readonly textMuted: string;
  readonly textSubtle: string;
  readonly accentBg: string;
  readonly accentBorder: string;
  readonly accentText: string;
  readonly accentSolid: string;
  readonly onAccentSolid: string;
  readonly glassBg: string;
  readonly glassBorder: string;
  readonly navSelectedBg: string;
  readonly navShadow: string;
}

export const LIGHT_THEME: ThemeTokens = {
  bg: "#FFFFFF",
  bgSubtle: "#F6F6F7",
  border: "#E3E3E6",
  borderStrong: "#CFCFD4",
  text: "#19191C",
  textMuted: "#57575E",
  textSubtle: "#8A8A91",
  accentBg: "#F6E8EA",
  accentBorder: "#E0BEC3",
  accentText: "#8E3B45",
  accentSolid: "#7A2E38",
  onAccentSolid: "#FFFFFF",
  glassBg: "rgba(255, 255, 255, 0.62)",
  glassBorder: "rgba(255, 255, 255, 0.7)",
  navSelectedBg: "rgba(255, 255, 255, 0.95)",
  navShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.06)",
};

export const DARK_THEME: ThemeTokens = {
  bg: "#111113",
  bgSubtle: "#19191C",
  border: "#2A2A2E",
  borderStrong: "#3A3A40",
  text: "#EDEDEF",
  textMuted: "#A1A1A8",
  textSubtle: "#6E6E76",
  accentBg: "#2E1518",
  accentBorder: "#5C2E33",
  accentText: "#E08A94",
  accentSolid: "#C9636F",
  onAccentSolid: "#1A1006",
  glassBg: "rgba(17, 17, 19, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  navSelectedBg: "rgba(255, 255, 255, 0.16)",
  navShadow: "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 1px rgba(0, 0, 0, 0.3)",
};

export const FONT_SANS =
  'system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif';
export const FONT_MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
