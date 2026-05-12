"use client";

import { useState } from "react";

type Props = {
  podId: number;
  orderNumber: string | null;
  signatureDataUrl: string | null;
  receiverName: string | null;
  signedAt: string | null;
};

export default function SignatureModal({
  podId,
  orderNumber,
  signatureDataUrl,
  receiverName,
  signedAt,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "10px",
          fontSize: "11px",
          fontWeight: 600,
          backgroundColor: "#d1fae5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
          whiteSpace: "nowrap",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
        title="View signature"
      >
        signed
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid #d6d3d1",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#1c1917",
                  }}
                >
                  Signature — POD #{podId}
                </div>
                {orderNumber && (
                  <div style={{ fontSize: "12px", color: "#78716c", marginTop: "2px" }}>
                    {orderNumber}
                  </div>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#78716c",
                  lineHeight: 1,
                  padding: "2px 6px",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div
              style={{
                border: "1.5px solid #d6d3d1",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#fafaf9",
              }}
            >
              {signatureDataUrl ? (
                <img
                  src={signatureDataUrl}
                  alt={`Signature for POD ${podId}`}
                  style={{ width: "100%", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#a8a29e",
                  }}
                >
                  No signature image available.
                </div>
              )}
            </div>

            {(receiverName || signedAt) && (
              <div
                style={{
                  marginTop: "14px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px 16px",
                }}
              >
                {receiverName && (
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "#78716c",
                      }}
                    >
                      Signed By
                    </div>
                    <div style={{ fontSize: "13px", color: "#1c1917", marginTop: "2px" }}>
                      {receiverName}
                    </div>
                  </div>
                )}
                {signedAt && (
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "#78716c",
                      }}
                    >
                      Signed At
                    </div>
                    <div style={{ fontSize: "13px", color: "#1c1917", marginTop: "2px" }}>
                      {signedAt}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
