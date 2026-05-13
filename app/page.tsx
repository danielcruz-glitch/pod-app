"use client";

import { useState } from "react";

const deliveryTimeOptions = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

export default function HomePage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [company, setCompany] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [items, setItems] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/pod/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_number: orderNumber,
          company,
          customer_name: customerName,
          recipient_email: recipientEmail,
          delivery_address: deliveryAddress,
          delivery_date: deliveryDate,
          delivery_time: deliveryTime,
          items,
          driver_name: driverName,
          driver_phone: driverPhone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create POD.");
      }

      setStatusMessage("POD created and email notification sent successfully.");

      setOrderNumber("");
      setCompany("");
      setCustomerName("");
      setRecipientEmail("");
      setDeliveryAddress("");
      setDeliveryDate("");
      setDeliveryTime("");
      setItems("");
      setDriverName("");
      setDriverPhone("");
    } catch (error: any) {
      setStatusMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function iStyle(name: string, val: string): React.CSSProperties {
    const f = focused === name;
    const h = val.length > 0;
    return {
      width: "100%",
      padding: "9px 12px",
      border: `1.5px solid ${f ? "#f59e0b" : h ? "#78716c" : "#d6d3d1"}`,
      borderRadius: "7px",
      fontSize: "13px",
      color: "#1c1917",
      backgroundColor: "#ffffff",
      outline: "none",
      boxShadow: f ? "0 0 0 3px rgba(245,158,11,0.15)" : "none",
      fontFamily: "inherit",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    };
  }

  function sStyle(name: string, val: string): React.CSSProperties {
    return {
      ...iStyle(name, val),
      padding: "9px 32px 9px 12px",
      appearance: "none",
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2378716c' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 8px center",
      backgroundSize: "20px",
      cursor: "pointer",
    };
  }

  const isError =
    !!statusMessage && !statusMessage.toLowerCase().includes("successfully");

  return (
    <main
      style={{
        backgroundColor: "#fafaf9",
        minHeight: "calc(100vh - 50px)",
        padding: "28px 22px",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          border: "1.5px solid #d6d3d1",
          borderRadius: "10px",
          padding: "20px 22px 24px",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: 700,
              color: "#1c1917",
            }}
          >
            Create POD
          </h1>
          <span
            style={{
              backgroundColor: "#fef3c7",
              color: "#92400e",
              border: "1px solid #fbbf24",
              borderRadius: "12px",
              padding: "3px 10px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ⚡ Live
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Section 1: ORDER INFORMATION ── */}
          <SectionLabel text="Order Information" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <FieldLabel text="Order Number" required />
              <input
                id="order_number"
                name="order_number"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                placeholder="e.g. ORD-1234"
                onFocus={() => setFocused("order_number")}
                onBlur={() => setFocused(null)}
                style={iStyle("order_number", orderNumber)}
              />
            </div>
            <div>
              <FieldLabel text="Company" required />
              <input
                id="company"
                name="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="Company name"
                onFocus={() => setFocused("company")}
                onBlur={() => setFocused(null)}
                style={iStyle("company", company)}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <FieldLabel text="Customer Name" required />
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="Full name"
                onFocus={() => setFocused("customer_name")}
                onBlur={() => setFocused(null)}
                style={iStyle("customer_name", customerName)}
              />
            </div>
            <div>
              <FieldLabel text="Recipient Email" required />
              <input
                id="recipient_email"
                name="recipient_email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                placeholder="email@example.com"
                onFocus={() => setFocused("recipient_email")}
                onBlur={() => setFocused(null)}
                style={iStyle("recipient_email", recipientEmail)}
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel text="Delivery Address" required />
            <input
              id="delivery_address"
              name="delivery_address"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              placeholder="Street address, city, state"
              onFocus={() => setFocused("delivery_address")}
              onBlur={() => setFocused(null)}
              style={iStyle("delivery_address", deliveryAddress)}
            />
          </div>

          {/* ── Divider ── */}
          <div style={{ borderTop: "1px solid #e7e5e4", margin: "14px 0" }} />

          {/* ── Section 2: CARGO & DRIVER ── */}
          <SectionLabel text="Cargo & Driver" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <FieldLabel text="Delivery Date" required />
              <input
                id="delivery_date"
                name="delivery_date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
                aria-label="Delivery Date"
                title="Delivery Date"
                onFocus={() => setFocused("delivery_date")}
                onBlur={() => setFocused(null)}
                style={iStyle("delivery_date", deliveryDate)}
              />
            </div>
            <div>
              <FieldLabel text="Delivery Time" required />
              <select
                id="delivery_time"
                name="delivery_time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
                aria-label="Delivery Time"
                title="Delivery Time"
                onFocus={() => setFocused("delivery_time")}
                onBlur={() => setFocused(null)}
                style={sStyle("delivery_time", deliveryTime)}
              >
                <option value="">Select time</option>
                {deliveryTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel text="Driver Name" required />
              <input
                id="driver_name"
                name="driver_name"
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
                placeholder="Driver full name"
                onFocus={() => setFocused("driver_name")}
                onBlur={() => setFocused(null)}
                style={iStyle("driver_name", driverName)}
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel text="Items" required />
            <textarea
              id="items"
              name="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              required
              rows={3}
              placeholder="e.g. 10 boxes of tile, 2 ladders, 1 pallet of cement"
              onFocus={() => setFocused("items")}
              onBlur={() => setFocused(null)}
              style={{
                ...iStyle("items", items),
                height: "80px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <FieldLabel text="Driver Phone" />
            <input
              id="driver_phone"
              name="driver_phone"
              type="tel"
              placeholder="e.g. 9175551234"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              onFocus={() => setFocused("driver_phone")}
              onBlur={() => setFocused(null)}
              style={iStyle("driver_phone", driverPhone)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 0",
              backgroundColor: "#f59e0b",
              color: "#1c1917",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              transition: "background 0.15s ease",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Submitting…" : "Create POD & Send Email →"}
          </button>
        </form>

        {statusMessage && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
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
      </div>
    </main>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        color: "#78716c",
        marginBottom: "10px",
      }}
    >
      {text}
    </div>
  );
}

function FieldLabel({
  text,
  required,
}: {
  text: string;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "#44403c",
        marginBottom: "5px",
      }}
    >
      {text}
      {required && (
        <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
      )}
    </label>
  );
}
