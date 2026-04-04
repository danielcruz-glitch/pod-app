import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

export default async function HistoryPage() {
  const { data, error } = await supabaseAdmin
    .from("pod_submissions")
    .select("*")
    .order("id", { ascending: false });

  const pods = (data || []) as PodSubmission[];

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "10px" }}>History</h1>
      <p style={{ marginBottom: "24px" }}>
        This page shows previous POD submissions.
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
          Failed to load history: {error.message}
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
          No POD history found.
        </div>
      )}

      {!error && pods.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {pods.map((pod) => (
            <div
              key={pod.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
                POD #{pod.id}
              </h2>

              <p style={{ margin: "6px 0" }}>
                <strong>Order Number:</strong> {pod.order_number || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Company:</strong> {pod.company || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Customer:</strong> {pod.customer_name || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Recipient Email:</strong> {pod.recipient_email || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Delivery Address:</strong> {pod.delivery_address || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Delivery Date:</strong> {pod.delivery_date || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Delivery Time:</strong> {pod.delivery_time || "-"}
              </p>
              <p style={{ margin: "6px 0", whiteSpace: "pre-wrap" }}>
                <strong>Items:</strong> {pod.items || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Driver Name:</strong> {pod.driver_name || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Driver Phone:</strong> {pod.driver_phone || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Delivery Status:</strong> {pod.delivery_status || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>POD Status:</strong> {pod.pod_status || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>SMS Status:</strong> {pod.sms_status || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Signing Status:</strong> {pod.signing_status || "pending"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Receiver Printed Name:</strong> {pod.receiver_printed_name || "-"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Signed At:</strong> {pod.signed_at || "-"}
              </p>

              {pod.signature_data_url && (
                <div style={{ marginTop: "16px" }}>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Signature:</strong>
                  </p>
                  <img
                    src={pod.signature_data_url}
                    alt={`Signature for POD ${pod.id}`}
                    style={{
                      maxWidth: "100%",
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}