import { supabaseAdmin } from "@/lib/supabaseAdmin";
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

export default async function HistoryPage({
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "19px",
            fontWeight: 700,
            color: "#1c1917",
          }}
        >
          History
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
            Failed to load history: {error.message}
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
            No POD history matches the current filters.
          </div>
        )}

        {!error && pods.length > 0 && (
          <div style={{ display: "grid", gap: "12px" }}>
            {pods.map((pod) => {
              const isSigned =
                (pod.signing_status || "").toLowerCase() === "signed";
              return (
                <div
                  key={pod.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1.5px solid #d6d3d1",
                    borderRadius: "10px",
                    padding: "18px 20px",
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "14px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #e7e5e4",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1c1917",
                      }}
                    >
                      POD #{pod.id}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: isSigned ? "#d1fae5" : "#fef3c7",
                        color: isSigned ? "#065f46" : "#92400e",
                        border: `1px solid ${isSigned ? "#6ee7b7" : "#fbbf24"}`,
                      }}
                    >
                      {pod.signing_status || "pending"}
                    </span>
                  </div>

                  {/* Detail grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px 24px",
                    }}
                  >
                    {[
                      ["Order Number", pod.order_number],
                      ["Company", pod.company],
                      ["Customer", pod.customer_name],
                      ["Recipient Email", pod.recipient_email],
                      ["Delivery Address", pod.delivery_address],
                      ["Delivery Date", pod.delivery_date],
                      ["Delivery Time", pod.delivery_time],
                      ["Driver Name", pod.driver_name],
                      ["Driver Phone", pod.driver_phone],
                      ["Delivery Status", pod.delivery_status],
                      ["POD Status", pod.pod_status],
                      ["SMS Status", pod.sms_status],
                      ["Receiver Name", pod.receiver_printed_name],
                      ["Signed At", pod.signed_at],
                    ].map(([label, value]) => (
                      <div key={label as string}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            color: "#78716c",
                          }}
                        >
                          {label}
                        </span>
                        <div
                          style={{
                            fontSize: "13px",
                            color: value ? "#1c1917" : "#a8a29e",
                            marginTop: "2px",
                          }}
                        >
                          {value || "—"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Items (full width) */}
                  {pod.items && (
                    <div style={{ marginTop: "10px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#78716c",
                        }}
                      >
                        Items
                      </span>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#1c1917",
                          marginTop: "2px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {pod.items}
                      </div>
                    </div>
                  )}

                  {/* Signature */}
                  {pod.signature_data_url && (
                    <div style={{ marginTop: "14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#78716c",
                          display: "block",
                          marginBottom: "6px",
                        }}
                      >
                        Signature
                      </span>
                      <img
                        src={pod.signature_data_url}
                        alt={`Signature for POD ${pod.id}`}
                        style={{
                          maxWidth: "100%",
                          border: "1.5px solid #d6d3d1",
                          borderRadius: "7px",
                          backgroundColor: "#ffffff",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
