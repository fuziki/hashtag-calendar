export const SITE_URL = "https://fuziki.github.io/hashtag-calendar/";
export const SITE_TITLE = "日付ごとのハッシュタグネタ帳";

/** Xの投稿画面（Web Intent）を開くURL */
export function xShareUrl(): string {
  const params = new URLSearchParams({ text: SITE_TITLE, url: SITE_URL });
  return `https://x.com/intent/tweet?${params.toString()}`;
}
