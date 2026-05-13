import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ResendSmsButton from "./ResendSmsButton";
import SignatureModal from "./SignatureModal";
import FilterBar from "@/components/FilterBar";

export const dynamic = "force-dynamic";

type PodSubmission = {
  id: number;
  order_number: string | null;
  company: string | null;
  customer_name: string | null;
  recipient_email: string | null;
  delivery_address: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  items: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  delivery_status: string | null;
  pod_status: string | null;
  sms_status: string | null;
  signing_status: string | null;
  receiver_printed_name: string | null;
  signed_at: string | null;
  signature_data_url: string | null;
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { signing = "", sms = "", q = "" } = await searchParams as {
    signing?: string;
    sms?: string;
    q?: string;
  };

  const { data, error } = await supabaseAdmin
    .from("pod_submissions")
    .select("*")
    .order("id", { ascending: false });

  const all = (data || []) as PodSubmission[];

  const pods = all.filter((p) => {
    if (signing && p.signing_status !== signing) return false;
    if (sms && p.sms_status !== sms) return false;
    if (q) {
      const lower = q.toLowerCase();
      const match = [p.order_number, p.customer_name, p.company].some((v) =>
        v?.toLowerCase().includes(lower)
      );
      if (!match) return false;
    }
    return true;
  });

  return (
    <main
      style={{
        padding: "28px 22px",
        backgroundColor: "#fafaf9",
        minHeight: "calc(100vh - 50px)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "19px",
            fontWeight: 700,
            color: "#1c1917",
          }}
        >
          Dashboard
        </h1>

        <FilterBar
          signing={signing}
          sms={sms}
          q={q}
          resultCount={pods.length}
          totalCount={all.length}
        />

        {error && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: "7px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#dc2626",
            }}
          >
            Failed to load POD records: {error.message}
          </div>
        )}

        {!error && pods.length === 0 && (
          <div
            style={{
              padding: "24px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #d6d3d1",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#78716c",
              textAlign: "center",
            }}
          >
            No POD records match the current filters.
          </div>
        )}

        {!error && pods.length > 0 && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid #d6d3d1",
              borderRadius: "10px",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1600px" }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#fafaf9",
                    borderBottom: "1.5px solid #d6d3d1",
                  }}
                >
                  {[
                    "Actions",
                    "ID",
                    "POD Status",
                    "Signing",
                    "Order #",
                    "Company",
                    "Customer",
                    "Address",
                    "Items",
                    "Driver",
                    "Date",
                    "Time",
                    "Delivery",
                    "SMS",
                    "Receiver",
                    "Signed At",
                    "Phone",
                    "Email",
                  ].map((h) => (
                    <th
                      key={h}
                      style={
                        h === "Actions"
                          ? { ...thStyle, position: "sticky", left: 0, backgroundColor: "#fafaf9", zIndex: 1 }
                          : thStyle
                      }
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pods.map((pod, i) => (
                  <tr
                    key={pod.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafaf9",
                      borderBottom: "1px solid #e7e5e4",
                    }}
                  >
                    <td style={{ ...tdStyle, position: "sticky", left: 0, backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafaf9", zIndex: 1 }}>
                      <ResendSmsButton podId={pod.id} />
                    </td>
                    <td style={tdStyle}>{pod.id}</td>
                    <td style={tdStyle}>
                      <StatusPill value={pod.pod_status} />
                    </td>
                    <td style={tdStyle}>
                      {pod.signing_status === "signed" ? (
                        <SignatureModal
                          podId={pod.id}
                          orderNumber={pod.order_number}
                          signatureDataUrl={pod.signature_data_url}
                          receiverName={pod.receiver_printed_name}
                          signedAt={pod.signed_at}
                        />
                      ) : (
                        <StatusPill value={pod.signing_status || "pending"} />
                      )}
                    </td>
                    <td style={tdStyle}>{pod.order_number || "—"}</td>
                    <td style={tdStyle}>{pod.company || "—"}</td>
                    <td style={tdStyle}>{pod.customer_name || "—"}</td>
                    <td style={tdStyle}>{pod.delivery_address || "—"}</td>
                    <td style={tdStyle}>
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {pod.items || "—"}
                      </div>
                    </td>
                    <td style={tdStyle}>{pod.driver_name || "—"}</td>
                    <td style={tdStyle}>{pod.delivery_date || "—"}</td>
                    <td style={tdStyle}>{pod.delivery_time || "—"}</td>
                    <td style={tdStyle}>{pod.delivery_status || "—"}</td>
                    <td style={tdStyle}>{pod.sms_status || "—"}</td>
                    <td style={tdStyle}>{pod.receiver_printed_name || "—"}</td>
                    <td style={tdStyle}>{pod.signed_at || "—"}</td>
                    <td style={tdStyle}>{pod.driver_phone || "—"}</td>
                    <td style={tdStyle}>{pod.recipient_email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function StatusPill({ value }: { value: string | null }) {
  if (!value) return <span style={{ color: "#78716c" }}>—</span>;
  const signed = value.toLowerCase() === "signed";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "10px",
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: signed ? "#d1fae5" : "#fef3c7",
        color: signed ? "#065f46" : "#92400e",
        border: `1px solid ${signed ? "#6ee7b7" : "#fbbf24"}`,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "#78716c",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "13px",
  color: "#44403c",
  verticalAlign: "top",
};
