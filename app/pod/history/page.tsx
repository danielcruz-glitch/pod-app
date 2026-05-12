import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PodHistoryPage() {
  const { data, error } = await supabase
    .from("pod_submissions")
    .select(
      "id, created_at, delivery_date, customer_name, order_number, driver_name, delivery_status, recipient_email, email_status, pdf_url"
    )
    .order("created_at", { ascending: false });

  return (
    <main
      style={{
        padding: "28px 22px",
        backgroundColor: "#fafaf9",
        minHeight: "calc(100vh - 50px)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "19px",
            fontWeight: 700,
            color: "#1c1917",
          }}
        >
          POD History
        </h1>

        {error && (
          <p
            style={{
              padding: "12px 14px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: "7px",
              fontSize: "13px",
              color: "#dc2626",
              margin: "0 0 16px",
            }}
          >
            Error loading POD history: {error.message}
          </p>
        )}

        {!error && data && data.length === 0 && (
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
            No POD submissions found.
          </div>
        )}

        {!error && data && data.length > 0 && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid #d6d3d1",
              borderRadius: "10px",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "900px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#fafaf9",
                    borderBottom: "1.5px solid #d6d3d1",
                  }}
                >
                  {[
                    "Created",
                    "Delivery Date",
                    "Customer",
                    "Order #",
                    "Driver",
                    "Status",
                    "Recipient Email",
                    "Email Status",
                    "PDF",
                  ].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.map((pod, i) => (
                  <tr
                    key={pod.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafaf9",
                      borderBottom: "1px solid #e7e5e4",
                    }}
                  >
                    <td style={tdStyle}>
                      {pod.created_at
                        ? new Date(pod.created_at).toLocaleString()
                        : "—"}
                    </td>
                    <td style={tdStyle}>{pod.delivery_date || "—"}</td>
                    <td style={tdStyle}>{pod.customer_name || "—"}</td>
                    <td style={tdStyle}>{pod.order_number || "—"}</td>
                    <td style={tdStyle}>{pod.driver_name || "—"}</td>
                    <td style={tdStyle}>{pod.delivery_status || "—"}</td>
                    <td style={tdStyle}>{pod.recipient_email || "—"}</td>
                    <td style={tdStyle}>{pod.email_status || "pending"}</td>
                    <td style={tdStyle}>
                      {pod.pdf_url ? (
                        <a
                          href={pod.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#d97706",
                            fontWeight: 600,
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          View PDF
                        </a>
                      ) : (
                        <span style={{ color: "#a8a29e", fontSize: "12px" }}>
                          No PDF
                        </span>
                      )}
                    </td>
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
