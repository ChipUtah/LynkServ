import { ImageResponse } from "next/og";

export const size        = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1B4FD8",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/*
          "L" drawn as two overlapping divs — vertical stroke + horizontal stroke.
          Positioned manually so they match the pixel-art layout in favicon.ico.
        */}
        <div style={{ position: "relative", width: 14, height: 18, display: "flex" }}>
          {/* Vertical bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 4,
              height: 18,
              background: "white",
              borderRadius: 1,
            }}
          />
          {/* Horizontal bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 14,
              height: 4,
              background: "white",
              borderRadius: 1,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
