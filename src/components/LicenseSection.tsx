import { X } from "lucide-react";
import { useRef } from "react";
import licenses from "virtual:licenses";

const NAV_PAD = 6; // px: ThemeModeControl/AccentColorPickerの外枠パディングと揃える
const BTN_HEIGHT = 32; // px: 同上のボタン高さと揃える

/** 利用しているオープンソースソフトウェアのライセンスを、ダイアログで一覧表示する */
export function LicenseSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">ライセンス</h3>
      <div
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
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="flex w-full items-center justify-center text-xs sm:text-sm transition hover:opacity-80"
          style={{
            height: BTN_HEIGHT,
            color: "var(--color-text-muted)",
            fontWeight: 500,
            borderRadius: 9999,
          }}
        >
          オープンソースライセンス
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="license-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto w-[min(92vw,40rem)] max-h-[85vh] overflow-y-auto overscroll-contain rounded-2xl p-5 text-[var(--color-text)] bg-[var(--color-bg)] border border-[var(--color-border)] backdrop:bg-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="license-dialog-title" className="text-sm font-bold">
              オープンソースライセンス
            </h2>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              このサイトは、以下のオープンソースソフトウェアを利用しています。
            </p>
          </div>
          <button
            type="button"
            aria-label="閉じる"
            onClick={() => dialogRef.current?.close()}
            className="shrink-0 p-1 rounded-md text-[var(--color-text-muted)] transition hover:opacity-70"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {licenses.map((entry) => (
            <li key={entry.name} className="rounded-md border border-[var(--color-border)]">
              <details>
                <summary className="cursor-pointer px-3 py-2 text-xs sm:text-sm">
                  <span className="font-semibold">{entry.name}</span>{" "}
                  <span className="text-[var(--color-text-muted)]">
                    {entry.version} · {entry.license}
                  </span>
                </summary>
                <pre className="px-3 pb-3 text-[11px] leading-relaxed whitespace-pre-wrap break-words text-[var(--color-text-muted)]">
                  {entry.text || "ライセンス本文が同梱されていません。"}
                </pre>
              </details>
            </li>
          ))}
        </ul>
      </dialog>
    </div>
  );
}
