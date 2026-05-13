import { supabaseAdmin } from "@/lib/supabaseAdmin";
import SignatureForm from "./SignatureForm";

type SignPageProps = {
  params: Promise<{ token: string }>;
};

export default async function SignPage({ params }: SignPageProps) {
  const { token } = await params;

  const { data, error } = await supabaseAdmin
    .from("pod_submissions")
    .select("*")
    .eq("signing_token", token)
    .single();

  if (error || !data) {
    return (
      <main
        style={{
          backgroundColor: "#fafaf9",
          minHeight: "calc(100vh - 50px)",
          padding: "40px 22px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1.5px solid #d6d3d1",
            borderRadius: "10px",
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "12px",
            }}
          >
            🔗
          </div>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "19px",
              fontWeight: 700,
              color: "#1c1917",
            }}
          >
            Invalid or Expired Link
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#78716c" }}>
            This signing link is invalid or no longer available.
          </p>
        </div>
      </main>
    );
  }

  if (data.signing_status === "signed") {
    return (
      <main
        style={{
          backgroundColor: "#fafaf9",
          minHeight: "calc(100vh - 50px)",
          padding: "28px 22px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "620px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "#d1fae5",
                color: "#065f46",
                border: "1px solid #6ee7b7",
              }}
            >
              ✓ Signed
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: "19px",
                fontWeight: 700,
                color: "#1c1917",
              }}
            >
              POD Already Signed
            </h1>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid #d6d3d1",
              borderRadius: "10px",
              padding: "20px 22px",
            }}
          >
            <PodDetails data={data} />

            {data.signature_data_url && (
              <div style={{ marginTop: "18px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#78716c",
                    marginBottom: "8px",
                  }}
                >
                  Saved Signature
                </div>
                <img
                  src={data.signature_data_url}
                  alt="Saved signature"
                  style={{
                    border: "1.5px solid #d6d3d1",
                    borderRadius: "7px",
                    backgroundColor: "#ffffff",
                    maxWidth: "100%",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundColor: "#fafaf9",
        minHeight: "calc(100vh - 50px)",
        padding: "28px 22px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "620px", margin: "0 auto" }}>
        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "19px",
            fontWeight: 700,
            color: "#1c1917",
          }}
        >
          POD Signature
        </h1>

        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #d6d3d1",
            borderRadius: "10px",
            padding: "20px 22px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              color: "#78716c",
              marginBottom: "12px",
            }}
          >
            Delivery Details
          </div>
          <PodDetails data={data} />
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #d6d3d1",
            borderRadius: "10px",
            padding: "20px 22px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              color: "#78716c",
              marginBottom: "14px",
            }}
          >
            Sign Below
          </div>
          <SignatureForm token={token} />
        </div>
      </div>
    </main>
  );
}

type PodData = {
  order_number?: string | null;
  company?: string | null;
  customer_name?: string | null;
  recipient_email?: string | null;
  delivery_address?: string | null;
  delivery_date?: string | null;
  delivery_time?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  items?: string | null;
  signing_status?: string | null;
  signature_data_url?: string | null;
  receiver_printed_name?: string | null;
};

function PodDetails({ data }: { data: PodData }) {
  const rows: [string, string | null | undefined][] = [
    ["Order Number", data.order_number],
    ["Company", data.company],
    ["Customer Name", data.customer_name],
    ["Recipient Email", data.recipient_email],
    ["Delivery Address", data.delivery_address],
    ["Delivery Date", data.delivery_date],
    ["Delivery Time", data.delivery_time],
    ["Driver Name", data.driver_name],
    ["Driver Phone", data.driver_phone],
    ["Items", data.items],
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px 20px",
      }}
    >
      {rows.map(([label, value]) => (
        <div key={label}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#78716c",
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: value ? "#1c1917" : "#a8a29e",
              marginTop: "2px",
              whiteSpace: "pre-wrap",
            }}
          >
            {value || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
