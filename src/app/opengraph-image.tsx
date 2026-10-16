import { ImageResponse } from "next/og";
export const alt = "Ram Kumar — Full stack, thoughtfully built.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#d5cfbe",
        color: "#101010",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 60,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          color: "#ffff00",
          fontSize: 200,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        RAM.
      </div>
      <div style={{ fontSize: 64, fontWeight: 700 }}>
        Full stack, thoughtfully built.
      </div>
      <div style={{ display: "flex", fontSize: 24 }}>
        Ram Kumar · Full Stack Developer · Sample portfolio
      </div>
    </div>,
    size,
  );
}
