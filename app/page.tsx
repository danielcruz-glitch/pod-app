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

      setStatusMessage("POD created and SMS sent successfully.");

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

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Create POD</h1>
      <p>Enter the POD details below and send the signature link to the driver.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <div>
          <label htmlFor="order_number">Order Number</label>
          <br />
          <input
            id="order_number"
            name="order_number"
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label htmlFor="company">Company</label>
          <br />
          <input
            id="company"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label htmlFor="customer_name">Customer Name</label>
          <br />
          <input
            id="customer_name"
            name="customer_name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label htmlFor="recipient_email">Recipient Email</label>
          <br />
          <input
            id="recipient_email"
            name="recipient_email"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label htmlFor="delivery_address">Delivery Address</label>
          <br />
          <input
            id="delivery_address"
            name="delivery_address"
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label htmlFor="delivery_date">Delivery Date</label>
          <br />
          <input
            id="delivery_date"
            name="delivery_date"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label htmlFor="delivery_time">Delivery Time</label>
          <br />
          <select
            id="delivery_time"
            name="delivery_time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          >
            <option value="">Select delivery time</option>
            {deliveryTimeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="items">Items</label>
          <br />
          <textarea
            id="items"
            name="items"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            required
            rows={5}
            placeholder="Example: 10 boxes of tile, 2 ladders, 1 pallet of cement"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              resize: "vertical",
            }}
          />
        </div>

        <div>
          <label htmlFor="driver_name">Driver Name</label>
          <br />
          <input
            id="driver_name"
            name="driver_name"
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label htmlFor="driver_phone">Driver Phone</label>
          <br />
          <input
            id="driver_phone"
            name="driver_phone"
            type="tel"
            placeholder="+19175551234"
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
          <p style={{ fontSize: "14px", marginTop: "6px" }}>
            Enter phone number in format: +19175551234
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: loading ? "#6ea8fe" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            transition: "0.2s",
          }}
        >
          {loading ? "Submitting..." : "Create POD and Send SMS"}
        </button>
      </form>

      {statusMessage && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
          {statusMessage}
        </div>
      )}
    </main>
  );
}