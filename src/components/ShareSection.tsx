import { ExternalLink } from "lucide-react";
import { SITE_URL, xShareUrl } from "../lib/site";
import { SiteQrCode } from "./SiteQrCode";

const BTN_HEIGHT = 32; // px: ThemeModeControl/AccentColorPickerのボタン高さと揃える
const STACK_PAD = 24; // px: stack全体を囲む上下左右共通のpadding
const STACK_GAP = 12; // px: QRコードとボタンの間隔

export function ShareSection() {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">このサイトを共有</h3>
      {/* テーマに関わらず白固定の座布団(QRコードの読み取り用)。QRコードとボタンを縦にstackし、上下左右同じpaddingで囲む */}
      <div
        className="w-full max-w-sm"
        style={{
          background: "#fff",
          border: "1px solid #e3e3e6",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          borderRadius: 32,
          padding: STACK_PAD,
        }}
      >
        <div className="flex flex-col" style={{ gap: STACK_GAP }}>
          <SiteQrCode value={SITE_URL} />
          <a
            href={xShareUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs sm:text-sm transition hover:opacity-80"
            style={{
              height: BTN_HEIGHT,
              color: "var(--color-nav-active-text)",
              background: "var(--color-accent-bg)",
              boxShadow: "var(--shadow-nav)",
              fontWeight: 600,
              borderRadius: 9999,
            }}
          >
            Xでシェア <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
