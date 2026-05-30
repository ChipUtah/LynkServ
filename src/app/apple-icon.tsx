import { ImageResponse } from "next/og";

export const size        = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1B4FD8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Bold white "L" — iOS adds its own rounded corners */}
        <div style={{ position: "relative", width: 82, height: 104, display: "flex" }}>
          {/* Vertical bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 22,
              height: 104,
              background: "white",
              borderRadius: 4,
            }}
          />
          {/* Horizontal bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 82,
              height: 22,
              background: "white",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
