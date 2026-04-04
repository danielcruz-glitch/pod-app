import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "POD App",
  description: "Digital Proof of Delivery System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            backgroundColor: "#111",
            color: "#fff",
            borderBottom: "1px solid #333",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>POD System</div>

          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/" style={navLinkStyle}>
              Dispatch
            </Link>

            <Link href="/dashboard" style={navLinkStyle}>
              Dashboard
            </Link>

            <Link href="/history" style={navLinkStyle}>
              History
            </Link>
          </div>
        </nav>

        <div>{children}</div>
      </body>
    </html>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500,
};