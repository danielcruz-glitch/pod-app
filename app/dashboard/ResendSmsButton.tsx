"use client";

import { useState } from "react";

type ResendSmsButtonProps = {
  podId: number;
};

export default function ResendSmsButton({ podId }: ResendSmsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleResend() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/pod/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pod_id: podId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to resend SMS.");
      }

      setMessage("SMS resent.");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error: any) {
      setMessage(error.message || "Something went wrong.");
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
          padding: "8px 12px",
          cursor: "pointer",
          fontWeight: "bold",
          border: "1px solid #ccc",
          backgroundColor: "#f3f3f3",
        }}
      >
        {loading ? "Resending..." : "Resend SMS"}
      </button>

      {message && (
        <div style={{ marginTop: "6px", fontSize: "12px" }}>{message}</div>
      )}
    </div>
  );
}