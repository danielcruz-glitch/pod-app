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

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="receiver_printed_name">
          Receiver Printed Name
        </label>
        <br />
        <input
          id="receiver_printed_name"
          name="receiver_printed_name"
          type="text"
          value={receiverPrintedName}
          onChange={(e) => setReceiverPrintedName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
          }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
          Signature
        </p>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#fff",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{
              width: 600,
              height: 220,
              style: {
                width: "100%",
                height: "220px",
                display: "block",
                background: "#fff",
              },
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button
          type="button"
          onClick={handleClearSignature}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            border: "1px solid #ccc",
            backgroundColor: "#f3f3f3",
          }}
        >
          Clear Signature
        </button>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Submitting..." : "Submit Signature"}
        </button>
      </div>

      {statusMessage && (
        <div style={{ marginTop: "16px", fontWeight: "bold" }}>
          {statusMessage}
        </div>
      )}
    </form>
  );
}