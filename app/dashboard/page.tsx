import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ResendSmsButton from "./ResendSmsButton";

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
};

export default async function DashboardPage() {
  const { data, error } = await supabaseAdmin
    .from("pod_submissions")
    .select("*")
    .order("id", { ascending: false });

  const pods = (data || []) as PodSubmission[];

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "10px" }}>Dashboard</h1>
      <p style={{ marginBottom: "24px" }}>
        This page shows all POD records currently in the system.
      </p>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffe5e5",
            border: "1px solid #ffb3b3",
            marginBottom: "20px",
          }}
        >
          Failed to load POD records: {error.message}
        </div>
      )}

      {!error && pods.length === 0 && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f3f3f3",
            border: "1px solid #ddd",
          }}
        >
          No POD records found.
        </div>
      )}

      {!error && pods.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#111", color: "#fff" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Order #</th>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Recipient Email</th>
                <th style={thStyle}>Delivery Address</th>
                <th style={thStyle}>Delivery Date</th>
                <th style={thStyle}>Delivery Time</th>
                <th style={thStyle}>Items</th>
                <th style={thStyle}>Driver Name</th>
                <th style={thStyle}>Driver Phone</th>
                <th style={thStyle}>Delivery Status</th>
                <th style={thStyle}>POD Status</th>
                <th style={thStyle}>SMS Status</th>
                <th style={thStyle}>Signing Status</th>
                <th style={thStyle}>Receiver Name</th>
                <th style={thStyle}>Signed At</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pods.map((pod) => (
                <tr key={pod.id}>
                  <td style={tdStyle}>{pod.id}</td>
                  <td style={tdStyle}>{pod.order_number || "-"}</td>
                  <td style={tdStyle}>{pod.company || "-"}</td>
                  <td style={tdStyle}>{pod.customer_name || "-"}</td>
                  <td style={tdStyle}>{pod.recipient_email || "-"}</td>
                  <td style={tdStyle}>{pod.delivery_address || "-"}</td>
                  <td style={tdStyle}>{pod.delivery_date || "-"}</td>
                  <td style={tdStyle}>{pod.delivery_time || "-"}</td>
                  <td style={tdStyle}>
                    <div style={{ whiteSpace: "pre-wrap" }}>{pod.items || "-"}</div>
                  </td>
                  <td style={tdStyle}>{pod.driver_name || "-"}</td>
                  <td style={tdStyle}>{pod.driver_phone || "-"}</td>
                  <td style={tdStyle}>{pod.delivery_status || "-"}</td>
                  <td style={tdStyle}>{pod.pod_status || "-"}</td>
                  <td style={tdStyle}>{pod.sms_status || "-"}</td>
                  <td style={tdStyle}>{pod.signing_status || "pending"}</td>
                  <td style={tdStyle}>{pod.receiver_printed_name || "-"}</td>
                  <td style={tdStyle}>{pod.signed_at || "-"}</td>
                  <td style={tdStyle}>
                    {pod.signing_status === "pending" ? (
                      <ResendSmsButton podId={pod.id} />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  border: "1px solid #ddd",
  verticalAlign: "top",
  fontSize: "14px",
};