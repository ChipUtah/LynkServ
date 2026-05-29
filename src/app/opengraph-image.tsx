import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt         = "LynkServ — Your Link to Trusted Local Services in Utah";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #1B4FD8 0%, #1e40af 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-3px",
            lineHeight: 1,
            marginBottom: 24,
            display: "flex",
          }}
        >
          LynkServ
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 34,
            color: "#BFDBFE",
            fontWeight: 500,
            marginBottom: 36,
            maxWidth: 700,
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          Your Link to Trusted Local Services in Utah
        </div>

        {/* Badges row */}
        <div style={{ display: "flex", gap: 20, marginBottom: 0 }}>
          {["Vetted businesses", "Real reviews", "No lead fees", "Free for homeowners"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 18,
                  color: "#BFDBFE",
                  display: "flex",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            right: 80,
            fontSize: 22,
            color: "#93C5FD",
            display: "flex",
          }}
        >
          lynkserv.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
