import { useMemo } from "react";
import { encode } from "uqr";

interface SiteQrCodeProps {
  readonly value: string;
}

/**
 * 余白なしでQRコードを黒で描画する。読み取りに必要な白い余白は、
 * 白固定の座布団(ShareSection)のpaddingで確保する。
 */
export function SiteQrCode({ value }: SiteQrCodeProps) {
  const { size, path } = useMemo(() => {
    const { data, size } = encode(value, { ecc: "M", border: 0 });
    const commands: string[] = [];
    data.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) commands.push(`M${x} ${y}h1v1h-1z`);
      });
    });
    return { size, path: commands.join("") };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label="このサイトのQRコード"
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className="block w-full h-auto"
    >
      <path d={path} fill="#000" />
    </svg>
  );
}
