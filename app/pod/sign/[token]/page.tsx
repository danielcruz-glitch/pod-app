import { createClient } from "@supabase/supabase-js";
import SignatureForm from "./SignatureForm";

type SignPageProps = {
  params: {
    token: string;
  };
};

export default async function SignPage({ params }: SignPageProps) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("pod_submissions")
    .select("*")
    .eq("signing_token", params.token)
    .single();

  if (error || !data) {
    return (
      <main style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
        <h1>Invalid or Expired Link</h1>
        <p>This signing link is invalid or no longer available.</p>
      </main>
    );
  }

  if (data.signing_status === "signed") {
    return (
      <main style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
        <h1>POD Already Signed</h1>

        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#fff",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <p><strong>Order Number:</strong> {data.order_number || "-"}</p>
          <p><strong>Company:</strong> {data.company || "-"}</p>
          <p><strong>Customer Name:</strong> {data.customer_name || "-"}</p>
          <p><strong>Recipient Email:</strong> {data.recipient_email || "-"}</p>
          <p><strong>Delivery Address:</strong> {data.delivery_address || "-"}</p>
          <p><strong>Delivery Date:</strong> {data.delivery_date || "-"}</p>
          <p><strong>Delivery Time:</strong> {data.delivery_time || "-"}</p>
          <p><strong>Items:</strong> {data.items || "-"}</p>
          <p><strong>Driver Name:</strong> {data.driver_name || "-"}</p>
          <p><strong>Receiver Printed Name:</strong> {data.receiver_printed_name || "-"}</p>
          <p><strong>Status:</strong> Signed</p>

          {data.signature_data_url && (
            <div style={{ marginTop: "20px" }}>
              <p><strong>Saved Signature:</strong></p>
              <img
                src={data.signature_data_url}
                alt="Saved signature"
                style={{
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  maxWidth: "100%",
                }}
              />
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h1>POD Signature</h1>

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#fff",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <p><strong>Order Number:</strong> {data.order_number || "-"}</p>
        <p><strong>Company:</strong> {data.company || "-"}</p>
        <p><strong>Customer Name:</strong> {data.customer_name || "-"}</p>
        <p><strong>Recipient Email:</strong> {data.recipient_email || "-"}</p>
        <p><strong>Delivery Address:</strong> {data.delivery_address || "-"}</p>
        <p><strong>Delivery Date:</strong> {data.delivery_date || "-"}</p>
        <p><strong>Delivery Time:</strong> {data.delivery_time || "-"}</p>
        <p><strong>Items:</strong> {data.items || "-"}</p>
        <p><strong>Driver Name:</strong> {data.driver_name || "-"}</p>
        <p><strong>Driver Phone:</strong> {data.driver_phone || "-"}</p>
      </div>

      <div style={{ marginTop: "24px" }}>
        <SignatureForm token={params.token} />
      </div>
    </main>
  );
}