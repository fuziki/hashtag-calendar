/** 1件のタグ・記念日エントリ（同じ日付でも複数存在しうる） */
export interface AlmanacEntry {
  readonly date: string;
  readonly tags: readonly string[];
  readonly description: string;
}

/** `### <月>` 見出し1つ分のブロック */
export interface MonthBlock {
  readonly month: string;
  readonly entries: readonly AlmanacEntry[];
}

/** `date` 文字列から抽出した月日（本日/次の判定に使用） */
export interface ParsedDate {
  readonly month: number;
  readonly day: number;
}

/** 同じ日付のエントリをまとめたグループ */
export interface DateGroup {
  readonly date: string;
  readonly items: readonly AlmanacEntry[];
}

const MONTH_HEADER_RE = /^### (.+)/;
const ENTRY_RE = /\*\*(.+?)：(.+?)\*\*\n\* (.+)/g;
const DATE_RE = /(\d+)月(\d+)日/;

/**
 * `public/hashtags.md` のフォーマットをパースする。
 * `### <月>` ごとにブロックを分け、各ブロック内の `**日付：タグ**` + `* 説明文` の
 * ペアをエントリとして抽出する。
 */
export function parseAlmanac(markdown: string): MonthBlock[] {
  const blocks = markdown.split(/\n(?=### )/).filter((block) => block.trim().startsWith("###"));

  return blocks.map((block): MonthBlock => {
    const month = block.match(MONTH_HEADER_RE)?.[1]?.trim() ?? "";
    const entries: AlmanacEntry[] = [];
    const entryRe = new RegExp(ENTRY_RE);
    let match: RegExpExecArray | null;
    while ((match = entryRe.exec(block)) !== null) {
      const [, date, tagList, description] = match;
      entries.push({
        date: (date ?? "").trim(),
        tags: (tagList ?? "").split("/").map((tag) => tag.trim()),
        description: (description ?? "").trim(),
      });
    }
    return { month, entries };
  });
}

/** `"8月21日"` のような文字列から月日を数値で取り出す */
export function parseDate(dateStr: string): ParsedDate | null {
  const match = dateStr.match(DATE_RE);
  if (!match) return null;
  const [, monthStr, dayStr] = match;
  if (monthStr === undefined || dayStr === undefined) return null;
  return { month: Number(monthStr), day: Number(dayStr) };
}

/** タグの中に `#` から始まるハッシュタグが1つでもあるか */
export function hasHashtag(tags: readonly string[]): boolean {
  return tags.some((tag) => tag.trim().startsWith("#"));
}

/** X（Twitter）検索用のURLを組み立てる */
export function xSearchUrl(tags: readonly string[]): string {
  const query = tags.join(" OR ");
  return `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;
}

/** 同じ日付のエントリを1グループにまとめる（出現順を保持） */
export function groupByDate(entries: readonly AlmanacEntry[]): DateGroup[] {
  const map = new Map<string, AlmanacEntry[]>();
  for (const entry of entries) {
    const items = map.get(entry.date);
    if (items) {
      items.push(entry);
    } else {
      map.set(entry.date, [entry]);
    }
  }
  return Array.from(map.entries(), ([date, items]) => ({ date, items }));
}

export type TodayBadgeLabel = "本日" | "明日" | "次";

/** 今日パネルに表示する内容（先頭1件 + 同日中の残り） */
export interface TodayPanelResult {
  readonly badgeLabel: TodayBadgeLabel;
  readonly head: AlmanacEntry;
  readonly rest: readonly AlmanacEntry[];
}

/**
 * `entries` は日付順という前提で、`now` ちょうどのエントリ（複数可）があればそれを、
 * 無ければ次に来るエントリを返す。年末で「次」が見つからない場合は先頭（＝来年最初のエントリ）にフォールバックする。
 */
export function computeTodayPanel(entries: readonly AlmanacEntry[], now: Date): TodayPanelResult | null {
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();

  const exactToday = entries.filter((entry) => {
    const parsed = parseDate(entry.date);
    return parsed !== null && parsed.month === nowMonth && parsed.day === nowDay;
  });

  const nextUp =
    entries.find((entry) => {
      const parsed = parseDate(entry.date);
      if (!parsed) return false;
      return parsed.month > nowMonth || (parsed.month === nowMonth && parsed.day > nowDay);
    }) ?? entries[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const nextUpDate = nextUp ? parseDate(nextUp.date) : null;
  const isNextUpTomorrow =
    nextUpDate !== null && nextUpDate.month === tomorrow.getMonth() + 1 && nextUpDate.day === tomorrow.getDate();

  const badgeLabel: TodayBadgeLabel = exactToday.length > 0 ? "本日" : isNextUpTomorrow ? "明日" : "次";
  const items = exactToday.length > 0 ? exactToday : nextUp ? [nextUp] : [];
  const [head, ...rest] = items;

  return head ? { badgeLabel, head, rest } : null;
}
