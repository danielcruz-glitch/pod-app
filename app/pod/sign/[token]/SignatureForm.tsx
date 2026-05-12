"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

type SignatureFormProps = {
  token: string;
};

export default function SignatureForm({ token }: SignatureFormProps) {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [receiverPrintedName, setReceiverPrintedName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage("");

    if (!receiverPrintedName.trim()) {
      setStatusMessage("Please enter the receiver printed name.");
      return;
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      setStatusMessage("Please provide a signature before submitting.");
      return;
    }

    setLoading(true);

    try {
      const signature_data_url = signatureRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      const response = await fetch("/api/pod/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          receiver_printed_name: receiverPrintedName,
          signature_data_url,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save signature.");
      }

      setStatusMessage("Signature submitted successfully.");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setStatusMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleClearSignature() {
    signatureRef.current?.clear();
    setStatusMessage("");
  }

  const isError =
    !!statusMessage && !statusMessage.toLowerCase().includes("successfully");

  return (
    <form onSubmit={handleSubmit}>
      {/* Receiver name */}
      <div style={{ marginBottom: "16px" }}>
        <label
          htmlFor="receiver_printed_name"
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "#44403c",
            marginBottom: "5px",
          }}
        >
          Receiver Printed Name
          <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
        </label>
        <input
          id="receiver_printed_name"
          name="receiver_printed_name"
          type="text"
          value={receiverPrintedName}
          onChange={(e) => setReceiverPrintedName(e.target.value)}
          required
          placeholder="Full name of receiver"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "9px 12px",
            border: `1.5px solid ${
              focused
                ? "#f59e0b"
                : receiverPrintedName
                ? "#78716c"
                : "#d6d3d1"
            }`,
            borderRadius: "7px",
            fontSize: "13px",
            color: "#1c1917",
            backgroundColor: "#ffffff",
            outline: "none",
            boxShadow: focused ? "0 0 0 3px rgba(245,158,11,0.15)" : "none",
            fontFamily: "inherit",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }}
        />
      </div>

      {/* Signature canvas */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#44403c",
            marginBottom: "5px",
          }}
        >
          Signature
          <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
        </div>
        <div
          style={{
            border: "1.5px solid #d6d3d1",
            borderRadius: "7px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            width: "100%",
          }}
        >
          <SignatureCanvas
            ref={signatureRef}
            penColor="#1c1917"
            canvasProps={{
              width: 600,
              height: 220,
              style: {
                width: "100%",
                height: "220px",
                display: "block",
                background: "#ffffff",
              },
            }}
          />
        </div>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "11px",
            color: "#78716c",
          }}
        >
          Draw your signature in the box above.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={handleClearSignature}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            border: "1.5px solid #d6d3d1",
            backgroundColor: "#ffffff",
            color: "#44403c",
            borderRadius: "7px",
            fontFamily: "inherit",
          }}
        >
          Clear
        </button>

        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px 0",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "14px",
            border: "none",
            backgroundColor: "#f59e0b",
            color: "#1c1917",
            borderRadius: "7px",
            opacity: loading ? 0.8 : 1,
            transition: "background 0.15s ease",
            fontFamily: "inherit",
          }}
        >
          {loading ? "Submitting…" : "Submit Signature →"}
        </button>
      </div>

      {statusMessage && (
        <div
          style={{
            marginTop: "14px",
            padding: "11px 14px",
            backgroundColor: isError ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${isError ? "#fca5a5" : "#86efac"}`,
            borderRadius: "7px",
            fontSize: "13px",
            color: isError ? "#dc2626" : "#15803d",
            fontWeight: 600,
          }}
        >
          {statusMessage}
        </div>
      )}
    </form>
  );
}
