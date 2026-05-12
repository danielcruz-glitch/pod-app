"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 22px",
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #f59e0b",
        height: "50px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "#f59e0b",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1c1917"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <path d="M16 8h4l3 5v3h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1c1917" }}>
          POD-App
        </span>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <NavLink href="/" label="Dispatch" active={pathname === "/"} />
        <NavLink
          href="/dashboard"
          label="Dashboard"
          active={pathname === "/dashboard"}
        />
        <NavLink
          href="/history"
          label="History"
          active={pathname === "/history"}
        />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        fontSize: "12px",
        color: active ? "#1c1917" : "#78716c",
        fontWeight: active ? 700 : 400,
        textDecoration: "none",
        paddingBottom: "2px",
        borderBottom: active ? "2px solid #f59e0b" : "2px solid transparent",
        lineHeight: "1.4",
      }}
    >
      {label}
    </Link>
  );
}
