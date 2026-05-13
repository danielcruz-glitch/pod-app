"use client";

import { useState } from "react";

type Props = {
  podId: number;
};

export default function ResendSmsButton({ podId }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleResend() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/pod/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pod_id: podId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to resend notification.");
      }

      setMessage("Email sent.");
      setTimeout(() => window.location.reload(), 800);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleResend}
        disabled={loading}
        style={{
          padding: "5px 10px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 700,
          fontSize: "11px",
          border: "1.5px solid #d6d3d1",
          backgroundColor: "#ffffff",
          color: "#44403c",
          borderRadius: "6px",
          opacity: loading ? 0.7 : 1,
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "Sending…" : "Resend Email"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "4px",
            fontSize: "11px",
            color: message === "Email sent." ? "#15803d" : "#dc2626",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
