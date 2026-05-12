"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

type Props = {
  signing: string;
  sms: string;
  q: string;
  resultCount: number;
  totalCount: number;
};

export default function FilterBar({ signing, sms, q, resultCount, totalCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const push = useCallback(
    (next: { signing: string; sms: string; q: string }) => {
      const params = new URLSearchParams();
      if (next.signing) params.set("signing", next.signing);
      if (next.sms) params.set("sms", next.sms);
      if (next.q) params.set("q", next.q);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname]
  );

  const isFiltered = signing || sms || q;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        alignItems: "center",
        marginBottom: "14px",
      }}
    >
      {/* Search input */}
      <input
        type="text"
        placeholder="Search order #, customer, company…"
        defaultValue={q}
        onChange={(e) => push({ signing, sms, q: e.target.value })}
        style={{
          flex: "1 1 220px",
          minWidth: "180px",
          padding: "7px 10px",
          fontSize: "13px",
          border: "1.5px solid #d6d3d1",
          borderRadius: "7px",
          outline: "none",
          color: "#1c1917",
          backgroundColor: "#ffffff",
          fontFamily: "inherit",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
        onBlur={(e) => (e.target.style.borderColor = "#d6d3d1")}
      />

      {/* Signing status */}
      <select
        value={signing}
        onChange={(e) => push({ signing: e.target.value, sms, q })}
        style={{
          padding: "7px 28px 7px 10px",
          fontSize: "13px",
          border: "1.5px solid #d6d3d1",
          borderRadius: "7px",
          outline: "none",
          color: signing ? "#1c1917" : "#78716c",
          backgroundColor: "#ffffff",
          fontFamily: "inherit",
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2378716c'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 9px center",
          cursor: "pointer",
        }}
      >
        <option value="">All signing statuses</option>
        <option value="pending">Pending</option>
        <option value="signed">Signed</option>
      </select>

      {/* SMS status */}
      <select
        value={sms}
        onChange={(e) => push({ signing, sms: e.target.value, q })}
        style={{
          padding: "7px 28px 7px 10px",
          fontSize: "13px",
          border: "1.5px solid #d6d3d1",
          borderRadius: "7px",
          outline: "none",
          color: sms ? "#1c1917" : "#78716c",
          backgroundColor: "#ffffff",
          fontFamily: "inherit",
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2378716c'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 9px center",
          cursor: "pointer",
        }}
      >
        <option value="">All SMS statuses</option>
        <option value="pending">Pending</option>
        <option value="sent">Sent</option>
        <option value="resent">Resent</option>
      </select>

      {/* Clear */}
      {isFiltered && (
        <button
          onClick={() => push({ signing: "", sms: "", q: "" })}
          style={{
            padding: "7px 12px",
            fontSize: "12px",
            fontWeight: 600,
            border: "1.5px solid #d6d3d1",
            borderRadius: "7px",
            backgroundColor: "#ffffff",
            color: "#78716c",
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          Clear filters
        </button>
      )}

      {/* Count */}
      <span
        style={{
          marginLeft: "auto",
          fontSize: "12px",
          color: "#78716c",
          whiteSpace: "nowrap",
        }}
      >
        {isFiltered ? `${resultCount} of ${totalCount}` : `${totalCount}`} record
        {totalCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
