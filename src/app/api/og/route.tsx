import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Digital Garden";
  const subtitle = searchParams.get("subtitle") || "Personal digital garden";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0e1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              color: "#e2e8f0",
              fontWeight: 600,
            }}
          >
            Digital Garden
          </span>
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#f8fafc",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "800px",
            letterSpacing: "-1px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "22px",
            color: "#94a3b8",
            marginTop: "20px",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
